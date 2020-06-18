import { body, validationResult } from 'express-validator'
import path from 'path'
import grpc from 'grpc'
const protoLoader = require("@grpc/proto-loader")
import config from '../../config/service'
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

exports.validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(400).json({
    errors: extractedErrors
  })
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
  } catch (e) {
    res.status(500).json(e)
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
    switch (err?.details) {
      case 'ALREADY_EXISTS':
        res.status(409).json({
          error: err.metadata.getMap()
        })
        case 'CUSTOM_ALREADY_EXISTS':
          res.status(409).json({
            error: 'Project with this tilte already exists'
          })
        break
      default:
        res.status(500).json(err)
    }
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
  } catch (e) {
    if (e.details === 'Not found') {
      res.status(204).json(e)
    }
    else {
      res.status(500).json(e)
    }
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
  } catch (e) {
    if (e.details === 'Not found') {
      res.status(204).json(e)
    }
    else {
      res.status(500).json(e)
    }
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
  } catch (e) {
    if (e.details === 'Not found') {
      res.status(204).json(e)
    }
    else {
      res.status(500).json(e)
    }
  }
}