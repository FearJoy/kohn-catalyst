var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var DocumentPackage = require('../models/documentPackage');
var api = require('../controllers/api');

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

//Need ObjectID to search by ObjectID
var ObjectId = require('mongodb').ObjectID;

//the default route, which will never be used
//TODO: Report 404 instead by ultimately not including this and creating a 404 page
router.post('/', function(req, res) {
    console.log("POST to page without ID parameter");
});

/**
    edit highlight features
 **/
router.post('/highlight/:id', api.toggleHighlight, function(req, res) {

    if(res.locals.status != '200'){
        res.status(500).send("Could not update field");
    }
    else{
        res.status(200).send({ status: 'success' });
    }

})

/**
 * Get Updated Data
 * Most fields can now be updated using the API
 **/
router.post('/:id', api.putUpdateDocument, function(req, res) {

    if(res.locals.status != '200'){
        res.status(500).send("Could not update field");
    }
    else{
        res.status(200).send({ status: 'success' });
    }

});

router.post('/array/:id', api.putUpdateArray, function(req, res) {

    if(res.locals.status != '200'){
        res.status(500).send("Could not update field");
    }
    else{
        res.status(200).send({ status: 'success' });
    }

});

/**
 * The Following routes don't conform to the api function to update fields
 */

/**
 * EDIT ADDRESS
 **/
router.post('/address/:id', function(req, res) {

    console.log("Updating: ");
    console.log("Line 1: " + req.body["value[line_1]"]);
    console.log("Line 2: " + req.body["value[line_2]"]);
    console.log("City: " + req.body["value[city]"]);
    console.log("State: " + req.body["value[state]"]);
    console.log("Zip: " + req.body["value[zip]"]);

    DocumentPackage.update(
        {_id: ObjectId(req.params.id)},
        { $set:
            {
                "application.address.line_1": req.body["value[line_1]"],
                "application.address.line_2": req.body["value[line_2]"],
                "application.address.city": req.body["value[city]"],
                "application.address.state": req.body["value[state]"],
                "application.address.zip": req.body["value[zip]"]
            }
        },
        function(err)
        {
            if(err)
            {   res.status(500).send({ status: 'Could not update field' });}
            else
            {   res.status(200).send({ status: 'success' });}
        }
    );
});

/**
 * EDIT FULL NAME
 **/
router.post('/name/:id', function(req, res) {
    //Checking what's in params
    console.log("Updating: ");
    console.log("First Name: " + req.body["value[first]"]);
    console.log("Middle Name: " + req.body["value[middle]"]);
    console.log("Last Name: " + req.body["value[last]"]);

    DocumentPackage.update(
        {_id: ObjectId(req.params.id)},
        { $set:
            {
                "application.name.first": req.body["value[first]"],
                "application.name.middle": req.body["value[middle]"],
                "application.name.last": req.body["value[last]"]
            }
        },
        function(err)
        {
            if(err)
            {   res.status(500).send({ status: 'error' });}
            else
            {   res.status(200).send({ status: 'success' });}
        }
    );
});
module.exports = router;