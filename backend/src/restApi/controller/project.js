import { body } from 'express-validator'
import path from 'path'
import grpc from 'grpc'
const protoLoader = require("@grpc/proto-loader")
import config from '../../config/service'
import { handleError } from '../lib'
const PROTO_PATH = path.join(__dirname, '../../proto/project.proto')

// check mandatory props
exports.validationRules = (method) => {
  switch (method) {
    case 'create': {
      return [
        body('name').not().isEmpty(),
        body('description').not().isEmpty(),
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
const projectProto = grpc.loadPackageDefinition(packageDefinition).project
const client = new projectProto.ProjectService(config.project.host + ':' + config.project.port, grpc.credentials.createInsecure())

// call List from project microservice
const projectList = (options) => {
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
      name: req.params.name ? req.params.name : null
    }
    // pass options/filter which will be used by the microservice
    let result = await projectList(options)
    res.status(200).json(result)
  } catch (err) {
    handleError(err, res, '')
  }
}

// create new project
const projectCreate = (options) => {
  return new Promise((resolve, reject) => {
    client.Create(options, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

exports.create = async (req, res, next) => {
  try {
    let result = await projectCreate({
      "name": req.body.name,
      "description": req.body.description
    })
    res.status(201).json(result)
  } catch (err) {
    handleError(err, res, 'Project with this tilte already exists')
  }
}

// get project by id - currently not in use
const projectRead = (options) => {
  return new Promise((resolve, reject) => {
    client.Read(options, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

exports.read = async (req, res, next) => {
  try {
    let result = await projectRead({
      "id": req.params.id
    })
    res.status(200).json(result)
  } catch (err) {
    handleError(err, res, '')
  }
}

// update project
const projectUpdate = (options) => {
  return new Promise((resolve, reject) => {
    client.Update(options, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

exports.update = async (req, res, next) => {
  try {
    let result = await projectUpdate({
      "id": req.params.id,
      "name": req.body.name,
      "description": req.body.description
    })
    res.status(200).json({ id: req.params.id })
  } catch (err) {
    handleError(err, res, 'Project with this tilte already exists')
  }
}

// delete project
const projectDelete = (options) => {
  return new Promise((resolve, reject) => {
    client.Delete(options, (error, response) => {
      if (error) { reject(error) }
      resolve(response)
    })
  })
}

exports.delete = async (req, res, next) => {
  try {
    let result = await projectDelete({
      "id": req.params.id
    })
    res.status(200).json({ id: req.params.id })
  } catch (err) {
    handleError(err, res, '')
  }
}