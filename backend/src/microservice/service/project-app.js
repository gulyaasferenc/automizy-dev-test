import path from 'path'
import grpc from 'grpc'
const protoLoader = require("@grpc/proto-loader")
import config from '../../config/service'
import db from '../database/connect'
import ProjectModel from '../database/model/project'
import ManagementModel from '../database/model/management'

const PROTO_PATH = path.join(__dirname, '../../proto/project.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

// Load in our service definition
const projectProto = grpc.loadPackageDefinition(packageDefinition).project
const server = new grpc.Server()

const projectModel = ProjectModel(db)
const managementModel = ManagementModel(db)

// Implement the list function
const List = async (call, callback) => {
  const name = call.request.name
  const Op = db.DataType.Op
  const condition = name ? {
    name: {
      [Op.like]: `%${name}%`
    }
  } : null;

  // List projects from DB
  try {
    const result = await projectModel.findAll({ where: condition })
    // const result = await projectModel.findAll()
    callback(null, { projects: result })
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
  let project = call.request
  try {
    let isExisting = await projectModel.findAndCountAll({
      where: {
        name: project.name
      }
    })
    if (isExisting.count > 0) {
      callback({
        code: grpc.status.ALREADY_EXISTS,
        details: 'CUSTOM_ALREADY_EXISTS'
      })
    } else {
      let result = await projectModel.create(project)
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
// Implement the read function
const Read = async (call, callback) => {
  let id = call.request.id
  try {
    let result = await projectModel.findByPk(id)
    if (result) {
      callback(null, result)
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
  let project = call.request
  try {
    let affectedRows = await projectModel.update(
      {
        "name": project.name,
        "description": project.description
      },
      {
        where: { id: project.id }
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
    // also delete the related management entries
    await managementModel.destroy({ where: { "project_id": id } })
    let result = await projectModel.destroy({ where: { "id": id } })
    if (result) {
      callback(null, result)
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
  return metadata
}
const exposedFunctions = {
  List,
  Create,
  Read,
  Update,
  Delete
}

server.addService(projectProto.ProjectService.service, exposedFunctions)
server.bind(config.project.host + ':' + config.project.port, grpc.ServerCredentials.createInsecure())

db.sequelize.sync().then(() => {
  console.log("Re-sync db.")
  server.start()
  console.log('Server running at ' + config.project.host + ':' + config.project.port)
})
  .catch(err => {
    console.log('Can not start server at ' + config.project.host + ':' + config.project.port)
    console.log(err)
  })