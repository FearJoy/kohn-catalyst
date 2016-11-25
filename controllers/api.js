// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Import node modules and node exports
// mongoose - schemas, templates, queries
// db       - connection to the database server
// DocumentPackage - schema and model for DocumentPackage writes
// bluebird - converts mongoose API calls to ES6 promises
// Import any required modules
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var DocumentPackage = require('../models/documentPackage');
var HighlightPackage = require('../models/highlightPackage');
var bluebird = require('bluebird');
var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose to use bluebird
Promise.promisifyAll(mongoose); // Convert all of mongoose to promises with bluebird

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Global database value
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Template the document each API call
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Retrieve a list of all applications and their count
// Type: GET
// Address: /api/find/allapplications
// Returns: list[application]
// Response:
//      200 - OK
//      400 - Bad Request
//      500 - Internal server error
//      503 - Service unavailable
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// We don't want any of this to run until we tell it to run, so we immediately export it
//
// Currently all functions are MIDDLEWARE in the Express app
//      Middleware Docs: https://expressjs.com/en/guide/using-middleware.html
//      Inspiration: https://medium.com/@jeffandersen/building-a-node-js-rest-api-with-express-46b0901f29b6#.6ttj8e6rs
//
// Basically, these function take this:
//      router.get('/all', function(req, res) { .. }
// And transform it into:
//      router.get('/all', api.getAllDocuments, function(req, res) { .. }
//
// They keep req, res, err, and next intact as they are passed around the route
// It is best practice to store new variable in res.local.<your variable>
module.exports = {
    getAllDocuments: function (req, res, next) {
        // Log what we are calling to the console
        console.log('[ API ] getAllDocuments :: Call invoked');

        // Create an object to be filled with promises. The object will look like:
        // .then(function (<name of object here>) {...})
        // If the name is results, use results.DocumentPackage[index].<what you need>
        // Obviously it will be an array of DocumentPackages in this example
        Promise.props({
            application: DocumentPackage.find().lean().execAsync(),
            count: DocumentPackage.find().count().execAsync()
        })
            .then(function (results) {
                // Save the results into res.locals
                res.locals.results = results;

                for (var i = 0, len = results.count; i < len; i++) {
                    console.log('[ API ] getAllDocuments :: Found document package with _id: ' + results.application[i]._id);
                }
                console.log('[ API ] getAllDocuments :: Document package count:', results.count);

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },

    getDocumentById: function (req, res, next) {
        // Log the api call we make along with the _id used by it
        console.log('[ API ] getDocumentById :: Call invoked with id: ' + req.params.id);

        // Use results.DocumentPackage.<whatever you need> to access the information
        Promise.props({
            document: DocumentPackage.findById(req.params.id).lean().execAsync()
        })
            .then(function(results) {
                if (!results) {
                    console.log('[ API ] getDocumentById :: Documents package found: FALSE');
                }
                else {
                    console.log('[ API ] getDocumentById :: Documents package found: TRUE');
                }

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

    getDocumentByStatus: function(req, res, next) {
        // Log the api call made to the console
        console.log('[ API ] getDocumentByStatus :: Call invoked');

        // Access the returned items as results.<status code>[array index].<what you need>
        // Example: results.visit[3].address.line_1 = a string
        Promise.props({
            new: DocumentPackage.find({status: "new"}).sort({'updated':-1}).lean().execAsync(),
            phone: DocumentPackage.find({status: "phone"}).lean().execAsync(),
            documents: DocumentPackage.find({status: "documents"}).lean().execAsync(),
            discuss: DocumentPackage.find({status: "discuss"}).lean().execAsync(),
            visit: DocumentPackage.find({status: "visit"}).lean().execAsync(),
            handle: DocumentPackage.find({status: "handle"}).lean().execAsync(),
            declined: DocumentPackage.find({status: "declined"}).sort({'updated':-1}).lean().execAsync(),
            project: DocumentPackage.find({status: "project"}).lean().execAsync()
        })
            .then(function (results) {
                if (!results) {
                    console.log('[ API ] getDocumentByStatus :: Documents package found: FALSE');
                }
                else {
                    console.log('[ API ] getDocumentByStatus :: Documents package found: TRUE');
                }
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

    postDocument: function(req, res, next) {
        // Data will be submitted using req.body
        console.log('[ API ] postDocument :: Call invoked');

        // For debugging
        var debug = 0;
        if (debug == 1) {
            console.log(req.body);
        }

        // Normally we would create a new mongoose object to be instantiated
        // var doc = new DocumentPackage();
        // And then add data to it
        // doc.status = 'a string here';
        // doc.application.name.first = 'name here'

        // Instead we will do it in one line
        var doc = new DocumentPackage(req.body);

        // Create a corresponding highlight package
        var highlight = new HighlightPackage();

        // Make each reference the others ObectId
        // TODO: Add support for work items and site assessment
        doc.highlightPackage = highlight._id;
        highlight.documentPackage = doc._id;

        // Save the document package to the database with a callback to handle flow control
        doc.saveAsync(function (err, doc, numAffected) {
            if (err) {
                console.error(err);
            }
            else if (numAffected == 1) {
                console.log('[ API ] postDocument :: Document created with _id: ' + doc._id);
            }
        });

        // Save the highlight package to the database with a callback to handle flow control
        highlight.saveAsync(function (err, highlight, numAffected) {
            if (err) {
                console.error(err);
            }
            else if (numAffected == 1) {
                console.log('[ API ] postDocument :: highlightPackage created with _id: ' + highlight._id);
                console.log('[ API ] postDocument :: highlightPackage references document package _id: ' + highlight.reference);
                res.send( { status : 200 } );
            }
        });
    },

    putUpdateDocument: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc

        // Log the _id, name, and value that are passed to the function
        console.log('[ API ] putUpdateDocument :: Call invoked with _id: ' + req.params.id
            + ' | key: ' + req.body.name + ' | value: ' + req.body.value);
        console.log(req.body.name + ' + ' + req.body.value);

        // Build the name:value pairs to be updated
        // Since there is only one name and one value, we can use the method below
        var updates = {};
        updates[req.body.name] = req.body.value;
        // Record Update time
        //filters
        var conditions = {};
        conditions['_id'] = mongoose.Types.ObjectId(req.params.id);
        console.log("Search Filter:");
        console.log(conditions);
        console.log("Update:");
        updates['updated'] = Date.now();
        console.log(updates);

        Promise.props({
            doc: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                // TODO: Confirm true/false is correct
                if (results) {
                    console.log('[ API ] putUpdateDocument :: Documents package found: TRUE');
                }
                else {
                    console.log('[ API ] putUpdateDocument :: Documents package found: FALSE');
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },

    /**
     * This will handle updates for elements in arrays
     */
    putUpdateArray: function(req, res, next) {
        // Log the _id, name, and value that are passed to the function
        console.log('[ API ] putUpdateArray :: Call invoked with _id: ' + req.params.id
            + ' | key: ' + req.body.name + ' | value: ' + req.body.value + ' | current value: ' + req.body.pk);
        //the $ holds the index of the element
        var updateField = req.body.name + ".$";
        var updates = {};
        updates[updateField] = req.body.value;
        // Record Update time
        updates['updated'] = Date.now();
        //filters
        var conditions = {};
        conditions['_id'] = req.params.id;
        conditions[req.body.name] = req.body.pk;
        console.log("Search Filter:");
        console.log(conditions);
        console.log("Update:");
        console.log(updates);

        Promise.props({
            doc: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                // TODO: Confirm true/false is correct
                console.log(results);
                if (results.doc != null) {
                    console.log('[ API ] putUpdateDocument :: Documents package found: TRUE');
                    res.locals.status = '200';
                }
                else {
                    console.log('[ API ] putUpdateDocument :: Documents package found: FALSE');
                    res.locals.status = '500';
                }
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },

    getHighlightsById: function(req, res, next) {
        console.log('[ API ] getHighlightsById :: Call invoked with highlight package _id: ' + req.params.id);
        Promise.props({
            highlight: HighlightPackage.findById(req.params.id).lean().execAsync()
        })
            .then(function(results) {
                if (!results) {
                    console.log('[ API ] getHighlightsById :: Highlight package found: FALSE');
                }
                else {
                    console.log('[ API ] getHighlightsById :: Highlight package found: TRUE');
                }

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

    toggleHighlight: function(req, res, next) {
        console.log('[ API ] toggleHighlight :: Call invoked with highlightPackage _id: %s | name: %s | value: %s',
            req.params.id, req.body.name, req.body.value);
        // Confirm a JSON {key:value} pair was sent
        if (req.accepts('application/json')) {
            var fetchDocument = Promise.props({
                highlight: HighlightPackage.findById(req.params.id).lean().execAsync()
            })
                .then(function (results) {
                    if (!results) {
                        console.log('[ API ] toggleHighlight :: Highlight package found: FALSE');
                    }
                    else {
                        console.log('[ API ] toggleHighlight :: Highlight package found: TRUE');
                    }

                    // Build the name:value pairs to be updated
                    // Since there is only one name and one value, we can use the method below
                    var updates = {};
                    updates[req.body.name] = req.body.value;

                    // Record Update time
                    updates['updated'] = Date.now();
                    console.log(updates);

                    // Build variables and attach to the returned query results
                    results.id = req.params.id;
                    results.name = req.body.name;
                    results.value = req.body.value;
                    results.updates = updates;

                    return results;
                })
                .catch(function (err) {
                    console.error(err);
                })
                .catch(next);

            fetchDocument.then(function(results) {
                Promise.props({
                    highlight: HighlightPackage.findOneAndUpdate(
                        // Condition
                        {_id: results.id},
                        // Updates
                        {
                            $set: results.updates
                        },
                        // Options
                        {
                            // new - defaults to false, returns the modified document when true, or the original when false
                            new: true,
                            // runValidators - defaults to false, make sure the data fits the model before applying the update
                            runValidators: true
                        }
                    ).execAsync()

                })
                    .then(function(results){
                        if (!results) {
                            console.log('[ API ] toggleHighlight :: Highlight package updated: FALSE');

                        }
                        else {
                            console.log('[ API ] toggleHighlight :: Highlight package updated: TRUE');
                            res.locals.results = results;
                            //sending a status of 200 for now
                            res.locals.status = '200';
                        }
                    })
                    .catch(function (err) {
                        console.error(err);
                    })
                    .catch(next);
            })
        }
    },
    },

    /**
     * This will handle updates for elements in arrays
     */
    putUpdateArray: function(req, res, next) {
        // Log the _id, name, and value that are passed to the function
        console.log('[ API ] putUpdateArray :: Call invoked with _id: ' + req.params.id
            + ' | key: ' + req.body.name + ' | value: ' + req.body.value + ' | current value: ' + req.body.pk);
        //the $ holds the index of the element
        var updateField = req.body.name + ".$";
        var updates = {};
        updates[updateField] = req.body.value;
        // Record Update time
        updates['updated'] = Date.now();
        //filters
        var conditions = {};
        conditions['_id'] = req.params.id;
        conditions[req.body.name] = req.body.pk;
        console.log("Search Filter:");
        console.log(conditions);
        console.log("Update:");
        console.log(updates);

        Promise.props({
            doc: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                // TODO: Confirm true/false is correct
                console.log(results);
                if (results.doc != null) {
                    console.log('[ API ] putUpdateDocument :: Documents package found: TRUE');
                    res.locals.status = '200';
                }
                else {
                    console.log('[ API ] putUpdateDocument :: Documents package found: FALSE');
                    res.locals.status = '500';
                }
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },
};