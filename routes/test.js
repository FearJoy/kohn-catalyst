var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var DocumentPackage = require('./../models/documentPackage');

// Import promise engine
var Promise = require('bluebird');
// Tell mongoose we are using the Bluebird promise library
mongoose.Promise = require('bluebird');
// Convert mongoose API to always return promises using Bluebird's promisifyAll
Promise.promisifyAll(mongoose);

// Helper query functions
var api = require("../controllers/api");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// This is an example of a post route with the API middleware that adds a Document
// Package to the database. Validation for the req.body is done against the schema in
// documentPackage.js.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.post('/add', api.postDocument, function(req, res) {
    res.json(res.locals.doc);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// The example here fetches all documents from the database and send them back to the
// user as JSON
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/show', api.getAllDocuments, function(req, res) {
    res.json(res.locals.results);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// This example fetches all documents from the database and returns them in JSON
// where each document is added to an array depending on its status code
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/status', api.getDocumentByStatus, function(req, res) {
    res.json(res.locals.results);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Get a document by its MongoDB _id
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.route('/:id')
    .get(api.getDocumentById, function(req, res) {
        res.json(res.locals.results);
    })
    .put(api.putUpdateDocument, function(req, res) {
        res.json(res.locals);
    })

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Update a single item in a document. The update is sent in the req.body from the
// client and then passed to api.putUpdateDocument
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.put('update-:id', api.putUpdateDocument, function(req, res) {

})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Example of using the API to do more than simply send JSON to the client
//
// We use the route like normal
// router.<HTTP-VERB>(<LOCAL URI>, <API MIDDLEWARE>, <CONTINUE LIKE NORMAL>)
// Use the returned material in res.locals.result.<things here>
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/all', api.getAllDocuments, function(req, res) {
    // We receive req and res from <api.getAllDocuments>
    // Local variables are stored in res.locals
    var context = res.locals.results; // Keep our sanity
    console.log('[ TEST / ALL ] context.count:', context.count);
    // Just like normal, 'context' provided by the API <3
    res.render('application-list', context);
});

router.route('/highlight/:id')
    .get(api.getHighlightsById, function(req, res) {
        res.json(res.locals.results);
    })
    .put(api.toggleHighlight, function(req, res) {
        res.json(res.locals.results);
    })


module.exports = router;