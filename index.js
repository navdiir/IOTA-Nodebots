'use strict'

const five = require('johnny-five')
const MAM = require('./lib/attachData.js')             
const IOTA = require('iota.lib.js')
const iota = new IOTA()
let timeLoop

if( process.argv[2] == undefined){          //Getting the time in seconds for the loop
  timeLoop = 60                       //default 1 minute
} else {
  timeLoop = process.argv[2] 
}

let i = 1                           //Counting for count the numbers of data publishing

//Creating a object Board in the port 'COM6'
const board = new five.Board({
  port: 'COM6',
  repl: false,
  debug: false
})


const start = function(){

  let temp1Data, temp2Data, soundSensorData, ldrData, date    //We are gonna saved each data in these var.
  
  //Start getting data from the board
  board.on('ready',getData)

  function getData(){

    //If we dont getting errors creating the object Board means that it found a Board
    console.log('\n\nBOARD FOUNDED!!!')
    console.log('Getting data ...\n\n')

    //Creating objects for the sensors        
    let temp1 = new five.Thermometer({          
      controller: 'LM35',
      pin: 'A0',
      freq: timeLoop*1000
    })

    let temp2 = new five.Thermometer({
      controller: 'LM35',
      pin: 'A2',
      freq: timeLoop*1000
    })

    let soundSensor = new five.Sensor({
      pin: 'A3',
      freq: timeLoop*1000
    })

    let ldr = new five.Sensor({
      pin: 'A1',
      freq: timeLoop*1000
    })

    //Start getting data from them and saving on the var. that we create before
    temp1.on('data', function() {
      temp1Data = this.C
    })

    temp2.on('data', function() {
      temp2Data = this.C
    })

    soundSensor.on('data', function(){
      soundSensorData = this.value
    })

    //In this last one we are gonna including some extra code
    ldr.on('data', function(){
      ldrData = this.value

      //Saving the actual date and create a Json object with the data
      date = new Date().toISOString().replace('T', ' ').substr(0, 19)
      let streamData = { 'LM35_1':temp1Data, 'LM35_2': temp2Data, 'Noise': soundSensorData, 'LDR': ldrData, 'Date':date, 'Counter':i}
      
      /* Some custom log for the console first showing that Json object, then showing
      the same object but in Trytes and at the end we publish that stream in trytes
      on the tangle and show the root for feetch later, also increment the counter. */
      console.log(' ____________________')
      console.log('|Data from the board|')
      console.log(' ────────────────────\n')
      console.log(streamData)
      console.log('\n _____________________________________________')
      console.log('|Data converted on Trytes to publish in Tangle|')
      console.log(' ─────────────────────────────────────────────\n')
      let dataS = JSON.stringify(streamData)        //convert that Json to String
      let dataT = iota.utils.toTrytes(dataS)        //convert string to trytes
      console.log(dataT)
      console.log('\n _______________________')
      console.log('|Root for fetch the data|')
      console.log(' ───────────────────────\n')
      MAM.attach(streamData)                        //calling a module for attach data in tangle
      console.log('--------------------------------------------------------------------------------------------------------------------')
      i++
    })
  }
}

start()