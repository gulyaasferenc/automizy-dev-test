import path from 'path'
import grpc from 'grpc'
const protoLoader = require("@grpc/proto-loader")
import config from '../../config/service'
import db from '../database/connect'
import Sequelize from 'sequelize'
import ManagementModel from '../database/model/management'
const PROTO_PATH = path.join(__dirname, '../../proto/management.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

// const for Sequelize operators
const Op = db.DataType.Op

// Load in our service definition
const managementProto = grpc.loadPackageDefinition(packageDefinition).management
const server = new grpc.Server()

const managementModel = ManagementModel(db)

// Implement the list function
const List = async (call, callback) => {
  // const condition = first_name ? { first_name: { [Op.like]: `%${first_name}%` } } : null;

  try {
    const result = await managementModel.findAll()
    callback(null, { managements: result })
  }
  catch (err) {
    callback({
      code: grpc.status.ABORTED,
      details: "Aborted"
    })
  }
}
// Implement the insert function
const Create = async (call, callback) => {
  let management = call.request
  console.log('MANAGEMENT', management)
  try {
    let isExisting = await managementModel.findAndCountAll({
      where: {
        student_id: Number(management.student_id),
        project_id: Number(management.project_id)
      }
    })
    if (isExisting.count > 0) {
      callback({
        code: grpc.status.ALREADY_EXISTS,
        details: 'CUSTOM_ALREADY_EXISTS'
      })
    } else {
      let result = await managementModel.create(management)
      callback(null, result)
    }
  } catch (err) {
    switch (err.name) {
      case 'SequelizeUniqueConstraintError':
        let jsErr = new Error('ALREADY_EXISTS')
        jsErr.code = grpc.status.ALREADY_EXISTS
        jsErr.metadata = dbErrorCollector({ errors: err.errors })
        callback(jsErr)
        break
      default:
        callback({
          code: grpc.status.ABORTED,
          details: "ABORTED"
        })
    }
  }
}
// Implement the function which get all the entires which project_id JSON property contain the project_id from the call
const ReadByProjectID = async (call, callback) => {
  let project_id = call.request.project_id

  try {
    let result = await db.sequelize.query(
      `SELECT management.id, management.project_id, student.first_name, management.student_id, student.last_name, project.name as project_name, project.description as project_description from management as management INNER JOIN students as student on management.student_id = student.id INNER JOIN projects as project on management.project_id = project.id where management.project_id = ${project_id}`,
      { type: Sequelize.QueryTypes.SELECT }
    )
    if (result.length > 0) {

      callback(null, { managements: result })
    }
    else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      })
    }
  } catch (err) {
    callback({
      code: grpc.status.ABORTED,
      details: "Aborted"
    })
  }
}

// Implement the function which get all the entires which has the student_id value equal to the project_id from the call
const ReadByStudentID = async (call, callback) => {
  let student_id = call.request.student_id
  try {
    let result = await db.sequelize.query(
      `SELECT management.id, management.project_id, student.first_name, management.student_id, student.last_name, project.name as project_name, project.description as project_description from management as management INNER JOIN students as student on management.student_id = student.id INNER JOIN projects as project on management.project_id = project.id where management.student_id = ${student_id}`,
      { type: Sequelize.QueryTypes.SELECT }
    )
    if (result) {
      callback(null, { managements: result })
    }
    else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      })
    }
  } catch (err) {
    callback({
      code: grpc.status.ABORTED,
      details: "Aborted"
    })
  }
}

// Implement the update function
const Update = async (call, callback) => {
  let management = call.request
  try {
    let affectedRows = await managementModel.update(
      {
        "student_id": management.student_id,
        "management_id": management.management_id
      },
      {
        where: { student_id: management.student_id }
      }
    )
    if (affectedRows[0]) {
      callback(null, affectedRows)
    }
    else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      })
    }
  } catch (err) {
    callback({
      code: grpc.status.ABORTED,
      details: "Aborted"
    })
  }
}
// Implement the delete function
const Delete = async (call, callback) => {
  let id = call.request.id
  try {
    let result = await managementModel.destroy({ where: { "id": id } })
    if (result) {
      callback(null, { managements: result })
    }
    else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      })
    }
  } catch (err) {
    callback({
      code: grpc.status.ABORTED,
      details: "Aborted"
    })
  }
}
// Collect errors
const dbErrorCollector = ({
  errors
}) => {
  const metadata = new grpc.Metadata()
  const error = errors.map(item => {
    metadata.set(item.path, item.type)
  })
  return error
}
const exposedFunctions = {
  List,
  Create,
  ReadByProjectID,
  ReadByStudentID,
  Update,
  Delete
}

server.addService(managementProto.ManagementService.service, exposedFunctions)
server.bind(config.management.host + ':' + config.management.port, grpc.ServerCredentials.createInsecure())

db.sequelize.sync().then(() => {
  console.log("Re-sync db.")
  server.start()
  console.log('Server running at ' + config.management.host + ':' + config.management.port)
})
  .catch(err => {
    console.log('Can not start server at ' + config.management.host + ':' + config.management.port)
    console.log(err)
  })