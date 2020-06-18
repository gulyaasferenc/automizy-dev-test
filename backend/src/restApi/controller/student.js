import { body } from 'express-validator'
import path from 'path'
import grpc from 'grpc'
const protoLoader = require("@grpc/proto-loader")
import config from '../../config/service'
import { handleError } from '../lib'
const PROTO_PATH = path.join(__dirname, '../../proto/student.proto')

// check mandatory props
exports.validationRules = (method) => {
  switch (method) {
    case 'create': {
      return [
        body('first_name').not().isEmpty(),
        body('last_name').not().isEmpty(),
        body('email').isEmail()
      ]
    }
  }
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

// Load in our service definition
const studentProto = grpc.loadPackageDefinition(packageDefinition).student
const client = new studentProto.StudentService(config.student.host + ':' + config.student.port, grpc.credentials.createInsecure())

// call List from student microservice
const studentList = (options) => {
  return new Promise((resolve, reject) => {
    client.List(options, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

exports.list = async (req, res, next) => {
  try {
    const options = {
      email: req.params.email ? req.params.email : null,
    }
    // pass options which will be used by the microservice
    let result = await studentList(options)
    res.status(200).json(result)
  } catch (err) {
    handleError(err, res, '')
  }
}

// create student
const studentCreate = (options) => {
  return new Promise((resolve, reject) => {
    client.Create(options, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

exports.create = async (req, res, next) => {
  try {
    // pass options which will be used by the microservice
    let result = await studentCreate({
      "first_name": req.body.first_name,
      "last_name": req.body.last_name,
      "email": req.body.email
    })
    res.status(201).json(result)
  } catch (err) {
    handleError(err, res, 'Student with this email already exists')
  }
}

// get student by id, currently not in use
const studentRead = (options) => {
  return new Promise((resolve, reject) => {
    client.Read(options, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

exports.read = async (req, res, next) => {
  try {
    let result = await studentRead({
      "id": req.params.id
    })
    res.status(200).json(result)
  } catch (err) {
    handleError(err, res, '')
  }
}

// update student data
const studentUpdate = (options) => {
  return new Promise((resolve, reject) => {
    client.Update(options, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

exports.update = async (req, res, next) => {
  try {
    let result = await studentUpdate({
      "id": req.params.id,
      "first_name": req.body.first_name,
      "last_name": req.body.last_name,
      "email": req.body.email
    })
    res.status(200).json({ id: req.params.id })
  } catch (err) {
   handleError(err, res, 'Student with this email already exists')
  }
}

// delet student
const studentDelete = (options) => {
  return new Promise((resolve, reject) => {
    client.Delete(options, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

exports.delete = async (req, res, next) => {
  try {
    let result = await studentDelete({
      "id": req.params.id
    })
    res.status(200).json({ id: req.params.id })
  } catch (err) {
    handleError(err, res, '')
  }
}