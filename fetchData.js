'use strict'

const Mam = require('./lib/mam.node.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ 'provider': 'http://node02.iotatoken.nl:14265' })

let root = process.argv[2]
let mamState = Mam.init(iota)

//callback for each fetch
const logData = data => {
	console.log('-------------------------------------------------')
	console.log(JSON.parse(iota.utils.fromTrytes(data)))
}

//Fetching async
const execute = async () => {
	let resp = await Mam.fetch(root, 'public',null,logData)
	console.log(resp)
}

console.log('\n\nFETCHING DATA!!\n\n')
execute()