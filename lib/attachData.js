'use strict'

const Mam = require('./mam.node.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ 'provider': 'http://node02.iotatoken.nl:14265' })

let mamState = Mam.init(iota)

const publish = async packet => {
  let message = Mam.create(mamState, packet)
  mamState = message.state
  console.log('Root: ', message.root)
  await Mam.attach(message.payload, message.address)
}

const publishTangle = function(jsonObject){
	let dataT = iota.utils.toTrytes(JSON.stringify(jsonObject))
	publish(dataT)
}

module.exports={attach:publishTangle}