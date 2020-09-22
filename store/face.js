import * as faceapi from 'face-api.js'
import { FaceExpressions } from 'face-api.js'
import axios from "axios"

export const state = () => ({
  serverURL: 'http://localhost:8441',
  //serverURL: 'https://tracking4dd.tk:8443',

  facesBackend: [],
  loading: false,
  loaded: false,
  faceMatcher: null,
  matches: [],
  useTiny: false,
  finalEmotion: '',
  numberTemp: 0,

  detections: {
    scoreThreshold: 0.5,
    inputSize: 320,
    boxColor: 'blue',
    textColor: 'green',
    lineWidth: 1,
    fontSize: 40,
    fontStyle: 'Georgia'
  },
  expressions: {
    minConfidence: 0.2
  },
  landmarks: {
    drawLines: true,
    lineWidth: 1
  },
  descriptors: {
    withDistance: false
  }
})

export const mutations = {
  setFacesBackend(state, faces) {
    state.facesBackend = faces
  },
  loading (state) {
    state.loading = true
  },

  load (state) {
    state.loading = false
    state.loaded = true
  },

  setFaceMatcher (state, matcher) {
    state.faceMatcher = matcher
  },

  setMatches(state, matches) {
    state.matches = matches
  }
}

export const actions = {
  load ({ commit, state }) {
    if (!state.loading && !state.loaded) {
      commit('loading')
      return Promise.all([
        faceapi.loadFaceRecognitionModel('/data/models'),
        faceapi.loadFaceLandmarkModel('/data/models'),
        faceapi.loadTinyFaceDetectorModel('/data/models'),
        faceapi.loadFaceExpressionModel('/data/models')
      ])
        .then(() => {
          commit('load')
        })
    }
  },
  editFaces({ commit }, faces) {
    commit('setFacesBackend', faces)
  },
  getFaceMatcher ({ commit, state }) {
    const labeledDescriptors = []
    state.facesBackend.forEach((face) => {
      const descriptors = face.descriptors.map((desc) => {
        if (desc.descriptor) {
          const descArray = []
          for (const i in desc.descriptor) {
            descArray.push(parseFloat(desc.descriptor[i]))
          }
          return new Float32Array(descArray)
        }
      })
      if (descriptors.length) {
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(
            face.user,
            descriptors
          ))
      }
    })
    const matcher = new faceapi.FaceMatcher(labeledDescriptors)
    commit('setFaceMatcher', matcher)
    return matcher
  },
  async getFaceDetections ({ commit, state }, { canvas, options }) {
    let detections = faceapi
      .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({
        scoreThreshold: state.detections.scoreThreshold,
        inputSize: state.detections.inputSize
      }))

    if (options && (options.landmarksEnabled || options.descriptorsEnabled)) {
      detections = detections.withFaceLandmarks(state.useTiny)
    }
    if (options && options.expressionsEnabled) {
      detections = detections.withFaceExpressions()
    }
    if (options && options.descriptorsEnabled) {
      detections = detections.withFaceDescriptors()
    }
    detections = await detections
    return detections
  },
  async recognize({ commit, state, dispatch }, { photoUnknown, descriptor, options, matchList, unknownsJson, camId }) {
    if (options.descriptorsEnabled) {
      const bestMatch = await state.faceMatcher.findBestMatch(descriptor)
      if (bestMatch._label === "unknown"){
        const unknown = {}
        unknown.descriptors = descriptor
        unknown.photo = photoUnknown
        unknown.temperature = 0
        unknownsJson.push(unknown)
      }
      else{
        //matchList.push(bestMatch._label)
        const match = {}
        match.rut = bestMatch._label
        match.camId = camId
        matchList.push(match)
      }
      return bestMatch
    }
    return null
  },

  async recognizeWithTemp({ commit, state, dispatch }, { photoUnknown, descriptor, options, matchList, unknownsJson, temperature }) {
    if (options.descriptorsEnabled) {
      const bestMatch = await state.faceMatcher.findBestMatch(descriptor)
      if (bestMatch._label === "unknown") {
        const unknown = {}
        unknown.descriptors = descriptor
        unknown.photo = photoUnknown
        unknown.temperature = temperature
        unknownsJson.push(unknown)
      }
      else {
        await dispatch('updateTemperature', { rut: bestMatch._label, temperature })
        matchList.push(bestMatch._label)
      }
      return bestMatch
    }
    return null
  },

  saveUnknowns({ state }, { unknownList }) {
    unknownList.length = 0
  },
  async updateTemperature({ state }, {rut, temperature}) {
    let formData = new FormData()
    formData.append('rut', rut)
    formData.append('temperature', temperature)
    await axios
      .post(`${state.serverURL}/persons/updateTemperature`, formData)
      .then(response => {
        console.log('temperature updated')
      })
      .catch(e => {
        console.log(e, e.response)
      })
  },

  draw ({ commit, state }, { canvasDiv, canvasCtx, detection, options }) {
    let emotions = ''
    // filter only emontions above confidence treshold and exclude 'neutral'
    if (options.expressionsEnabled && detection.expressions) {
      for (const expr in detection.expressions) {
        if (detection.expressions[expr] > state.expressions.minConfidence && expr !== 'neutral' && false) {
          emotions += ` ${expr} &`
        }
      }
      if (emotions.length) {
        emotions = emotions.substring(0, emotions.length - 2)
      }
    }
    let name = ''
    if (options.descriptorsEnabled && detection.recognition) {
      name = detection.recognition.toString(state.descriptors.withDistance)
    }
    const text = `${name}${emotions ? (name ? ' is ' : '') : ''}${emotions}`
    const box = detection.box || detection.detection.box
    this.state.finalEmotion = emotions
    if (options.detectionsEnabled && box) {
      // draw box
      canvasCtx.strokeStyle = state.detections.boxColor
      canvasCtx.lineWidth = state.detections.lineWidth
      canvasCtx.strokeRect(box.x, box.y, box.width, box.height)
    }
    if (text && detection && box) {
      // draw text
      var numTemp = (Math.random() * 2)+35.6
      var s = numTemp.toString()
      var decimalLength = s.indexOf('.') + 1
      var numStr = s.substr(0, decimalLength + 2)
      numTemp = Number(numStr)
      const padText = 2 + state.detections.lineWidth
      canvasCtx.fillStyle = state.detections.textColor
      canvasCtx.font = state.detections.fontSize + 'px ' + state.detections.fontStyle
      canvasCtx.fillText(text, box.x + padText, box.y + box.height + padText + (state.detections.fontSize * -0.2))
      canvasCtx.fillText(detection.temperature+'º', box.x + padText, box.y + padText + (state.detections.fontSize * -0.6))
    }

    if (options.landmarksEnabled && detection.landmarks) {
      faceapi.draw.drawFaceLandmarks(canvasDiv, detection.landmarks, { lineWidth: state.landmarks.lineWidth, drawLines: state.landmarks.drawLines })
    }
  },
  drawWithoutTemp({
    commit,
    state
  }, {
    canvasDiv,
    canvasCtx,
    detection,
    options
  }) {
    let emotions = ''
    // filter only emontions above confidence treshold and exclude 'neutral'
    if (options.expressionsEnabled && detection.expressions) {
      for (const expr in detection.expressions) {
        if (detection.expressions[expr] > state.expressions.minConfidence && expr !== 'neutral' && false) {
          emotions += ` ${expr} &`
        }
      }
      if (emotions.length) {
        emotions = emotions.substring(0, emotions.length - 2)
      }
    }
    let name = ''
    if (options.descriptorsEnabled && detection.recognition) {
      name = detection.recognition.toString(state.descriptors.withDistance)
    }
    const text = `${name}${emotions ? (name ? ' is ' : '') : ''}${emotions}`
    const box = detection.box || detection.detection.box
    this.state.finalEmotion = emotions
    if (options.detectionsEnabled && box) {
      // draw box
      canvasCtx.strokeStyle = state.detections.boxColor
      canvasCtx.lineWidth = state.detections.lineWidth
      canvasCtx.strokeRect(box.x, box.y, box.width, box.height)
    }
    if (text && detection && box) {
      // draw text
      var numTemp = (Math.random() * 2) + 35.6
      var s = numTemp.toString()
      var decimalLength = s.indexOf('.') + 1
      var numStr = s.substr(0, decimalLength + 2)
      numTemp = Number(numStr)
      const padText = 2 + state.detections.lineWidth
      canvasCtx.fillStyle = state.detections.textColor
      canvasCtx.font = state.detections.fontSize + 'px ' + state.detections.fontStyle
      canvasCtx.fillText(text, box.x + padText, box.y + box.height + padText + (state.detections.fontSize * -0.2))
    }

    if (options.landmarksEnabled && detection.landmarks) {
      faceapi.draw.drawFaceLandmarks(canvasDiv, detection.landmarks, {
        lineWidth: state.landmarks.lineWidth,
        drawLines: state.landmarks.drawLines
      })
    }
  },

  async createCanvas ({ commit, state }, elementId) {
    const canvas = await faceapi.createCanvasFromMedia(document.getElementById(elementId))
    return canvas
  }
}
