import express from 'express'
const router = express()
import student from './student'
import project from './project'
import management from './management'

// Documentation
// https://expressjs.com/en/api.html#router

// Define the 3 branches
router.use('/student', student)
router.use('/project', project)
router.use('/management', management)
export default router