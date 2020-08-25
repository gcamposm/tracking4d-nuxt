const express = require('express')
const { writeFileSync } = require('fs')
const { join } = require('path')
const modelRoutes = express.Router()


//folders & model file
const rootFolder = join(__dirname, '../../')
const dataFolder = join(rootFolder, 'data')
const facesFileName = 'faces.json'

module.exports = modelRoutes
