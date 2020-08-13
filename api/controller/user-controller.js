const express = require('express')
const {

  readFileSync,
  writeFile,
  unlinkSync
} = require('fs')
const {
  join
} = require('path')
const rimraf = require('rimraf')
const sharp = require('sharp')
sharp.cache(false)
const multer = require("multer")
const userRoutes = express.Router()

userRoutes.post("/delete", async(req, res) => {
  await axios
    .delete(`http://localhost:8443/persons/delete/byRut/` + req.body.rut)
    .then(response => {
      console.log('delete person with rut ' + req.body.rut)
    })
    .catch(e => {
      console.log('error' + e)
    })
})

userRoutes.post("/uploadBase64", async(req, res) => {
  res.header("Content-Type", "application/json")
  await uploadBase64(req.body.upload)
    .then(result => res.send(result))
    .catch(e => {
      console.error(e)
      res.sendStatus(500).send(e)
    })
})

async function uploadBase64(upload) {
  const fileName = `${upload.user}_${Date.now()}.jpg`
  const imgPath = join(usersFolder, upload.user, fileName)
  const content = upload.content.split(',')[1]
  return new Promise(async(resolve, reject) => {
    writeFile(imgPath, content, 'base64', (err) => {
      if (err) {
        reject(new Error(err))
      }
      resolve([`/data/users/${upload.user}/${fileName}`])
    })
  })
}

module.exports = userRoutes
