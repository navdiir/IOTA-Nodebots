'use strict'

const five = require('johnny-five')
const MAM = require('./lib/attachDataR.js')             
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

  let tempData, ldrData, date    //We are gonna saved each data in these var.
  
  //Start getting data from the board
  board.on('ready',getData)

  function getData(){

    //If we dont getting errors creating the object Board means that it found a Board
    console.log('\n\nBOARD FOUNDED!!!')
    console.log('Getting data ...\n\n')

    //Creating objects for the sensors        
    let temp = new five.Thermometer({          
      controller: 'LM35',
      pin: 'A0',
      freq: timeLoop*1000
    })

    let ldr = new five.Sensor({
      pin: 'A1',
      freq: timeLoop*1000
    })

    //Start getting data from them and saving on the var. that we create before
    temp.on('data', function() {
      tempData = this.C
    })

    //In this last one we are gonna including some extra code
    ldr.on('data', function(){
      ldrData = this.value

      //Saving the actual date and create a Json object with the data
      date = new Date(Date.now()).toLocaleString()
      let streamData = { 'LM35':tempData, 'LDR': ldrData, 'Date':date, 'Counter':i}
      
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