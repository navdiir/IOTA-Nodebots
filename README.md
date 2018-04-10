# IOTA-Nodebots

Testing Nodebots to publish stream data with MAM in Tangle

> This example is made in NodeJS, be sure to install it before used

## Installation 

Clone this repository and then execute
```
npm install
```

## Getting Started

After you've successfully installed you need to edit `index.js` for your own experience.

* **Port:** Ln. 19 - > Edit with the port that you are using
* **Function Start():** Ln. 25 -> Edit with the sensors that you are using
* **Json object:** Ln. 80 -> Edit according your sensor data

In `lib\attachData.js` and `fetchData.js` you can edit this.

* **IOTA provider:** Ln. 5 -> Edit according your own node or keep using this public node

# How to run

After you edit `index.js` for your own experience you can run 

```
node index.js [TimeLoop] 
```

Where [TimeLoop] is the frequency in seconds to sending a new stream to Tangle (Default: 60s). 
Ej. `node index.js 30` this will send the data each 30s.

To fetch te data after you execute `index.js` run

```
node fetchData.js [Root]
```

Where [Root] is the root that you want to start fetching the data (Also you can edit the code in Ln. 7 if you want a diferent experience)
Ej. `node fetchData.js SYOPTX9ZZLHTMRSTAJGTJYNAMOURRCYYPAWQCF9FVOZRXCTIBXHVLJW9LFHIIDXKTCZURABCB9TJSCAFF`

Feel free to edit and play around this :)
