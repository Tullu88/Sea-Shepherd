require('dotenv').config();
const request = require('request');
const app = require('express');


    const getCall = (theRes) => {
        theRes.send('This is the SECOND new endpoint');
        //console.log(theRes);
    }

    module.exports = getCall;