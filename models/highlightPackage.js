/*
 This schema is used to flag level level two items in documentPackage.js.
 A flagged item will be inserted into the phone script and highlighted
 on the Vetting Agent view page.

 This schema will create a mongoDB 'document'.
 The document will have values, like '_id', and sub-documents,
 like 'applications'.
 A sub-document can have sub-documents or values.

 Items on the left of the colon are database ID values.
 Items on the right of the colon are the data types allowed.

 Allowable types are:
 String      Number
 Date        Buffer
 { type: Boolean, default: false }     Mixed
 ObjectId    Array

 ObjectId is similar to a primary key in a relationship based database.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var HighlightPackageSchema = new Schema({
    documentPackage:      { type: ObjectId },
    created:        { type: Date, default: Date.now},
    updated:        { type: Date, default: Date.now},

    advocate:       {
        is_advocate:        { type: Boolean, default: false },
        individual:         { type: Boolean, default: false },
        npo:                { type: Boolean, default: false },
        gov:                { type: Boolean, default: false },
        name:               { type: Boolean, default: false },
        organization_name:  { type: Boolean, default: false },
        relationship:       { type: Boolean, default: false },
        phone:              { type: Boolean, default: false }
    },

    application:    {
        owns_home:          { type: Boolean, default: false },
        name:               { type: Boolean, default: false },
        dob:                { type: Boolean, default: false },
        driver_license:     { type: Boolean, default: false },
        marital:            { type: Boolean, default: false },
        spouse:             { type: Boolean, default: false },
        phone:              { type: Boolean, default: false },
        email:              { type: Boolean, default: false },
        address:            { type: Boolean, default: false },
        emergency_contact:  { type: Boolean, default: false },
        other_residents:    { type: Boolean, default: false },
        veteran:            { type: Boolean, default: false },
        language:           { type: Boolean, default: false },
        heard_about:        { type: Boolean, default: false },
        special_circumstances:  { type: Boolean, default: false }
    },

    finance:    {
        mortgage:   { type: Boolean, default: false },
        income:     { type: Boolean, default: false },
        assets:     { type: Boolean, default: false },
        client_can_contribute:      { type: Boolean, default: false },
        associates_can_contribute:  { type: Boolean, default: false },
        requested_other_help:       { type: Boolean, default: false }
    },

    property:   {
        home_type:              { type: Boolean, default: false },
        ownership_length:       { type: Boolean, default: false },
        year_constructed:       { type: Boolean, default: false },
        requested_repairs:      { type: Boolean, default: false },
        client_can_contribute:  { type: Boolean, default: false },
        associates_can_contribute:  { type: Boolean, default: false },
    },

    recruitment:    { type: Boolean, default: false },
});

var HighlightPackage = mongoose.model('HighlightPackage', HighlightPackageSchema);
module.exports = HighlightPackage;