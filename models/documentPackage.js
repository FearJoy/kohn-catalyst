/*
 This file represents the document schema for the entire DOCUMENT PACKAGE
 This is the master file for a client. Imagine it as a section in a filing
 cabinet that holds the application, financial, property, handle-it and
 project information. A 'folder' to hold a bunch of forms.

 This schema will create a mongoDB 'document'.
 The document will have values, like '_id', and sub-documents,
 like 'applications'.
 A sub-document can have sub-documents or values.

 Items on the left of the colon are database ID values.
 Items on the right of the colon are the data types allowed.

 Allowable types are:
     String      Number
     Date        Buffer
     Boolean     Mixed
     ObjectId    Array

 ObjectId is similar to a primary key in a relationship based database.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

// TODO: Research 'index'ing a value in mongoose
// TODO: Research 'trim'ing a value in mongoose
// TODO: Add access tags as needed - docs = https://docs.mongodb.com/manual/reference/operator/aggregation/redact/
var DocumentPackageSchema = new Schema({
    status:         String,
    created:        Date,
    updated:        { type: Date, default: Date.now},
    highlightPackage: { type: ObjectId },
    // Codes needed are:
    // Code - description
    // new - new document package, has yet to be reviewed
    // phone - document package has been seen, internal agent needs to contact client and verify document package information
    // documents - additional documents are needed from the client before document package can proceed
    // discuss - internal discussion needs to take place to determine if the document package is approved, denied, handle-it, or other
    // visit - a member of catalyst must visit the property to determine the extent of repairs needed
    // handle - the document package is forwarded to the handle-it team to be completed
    // declined - the document package was declined for various reasons
    // project - the project has been approved and the document package will be converted to a project package

    advocate:       {
        is_advocate:        Boolean,
        individual:         Boolean,
        npo:                Boolean,
        gov:                Boolean,
        name:               String,
        organization_name:  String,
        relationship:       String,
        phone:              Number
    },

    application:    {
        owns_home:      Boolean,
        name:       {
            first:     String,
            middle:    String,
            last:      String,
            preferred: String
		},
        dob:            {
            tags:       ["VA", "EX"],
            date:       Date
        },
        driver_license: {
            tags:       ["VA", "EX"],
            number:     String
        },
        // status can return 3 values:
        // single - a person who has never married
        // divorced -  a person who has a legally terminated marriage
        // window - a person who has a deceased spouse
        marital:        {
            status:     String,
            spouse:     String,
        },
        spouse:         String,
        phone:          {
            preferred:  String,         // TODO: Validate max length = 10 integers
            other:      String          // TODO: Validate max length = 10 integers
        },
        email:          String,
        address:        {
            line_1:     String,
            line_2:     String,
            city:       String,
            state:      String,         // TODO: Validate it is a state or it is in Oregon
            zip:        Number          // TODO: Confirm max length = 5 integers
        },
        emergency_contact:  {
            name:           String,
            relationship:   String,
            phone:          String      // TODO: Validate max length = 10 integers
        },
        other_residents:{
            count:      Number,         // other_residents.names[index], other_residents.ages[index] where index < other_residents.count
            name:      [String],        // This is an array of strings
            age:       [Number],        // This is an array of numbers
			relationship: [String]      // This is an array of strings
        },
        veteran:        Boolean,
        language:       String,
        heard_about:    String,
        special_circumstances:  {
            tags:       ["VA", "EX"],
            note:       String
        }
    },

    finance:    {
        mortgage:               {
            tags:               ["VA", "EX"],
            payment:            Number,
            up_to_date:         Boolean
        },
        income:                 {
            tags:               ["VA", "EX"],
            amount:             Number
        },
        assets:                 {
            tags:               ["VA", "EX"],
            count:              Number,
            name:               [String],
            value:              [Number]
        },
        client_can_contribute:  {
            value:              Boolean,
            amount:             Number
        },
        associates_can_contribute:  {
            value:              Boolean,
            description:        String
        },
        requested_other_help:   {
            value:              Boolean,
            description:        String
        }
    },

    property:   {
        home_type:                   String,
        ownership_length:       Number,
        year_constructed:       Number,     // TODO: Validate as exact length = 4
        requested_repairs:      String,
        client_can_contribute:  {
            value:              Boolean,
            description:        String
        },
        associates_can_contribute:  {
            value:              Boolean,
            description:        String
        }
    },

    recruitment:    {
        fbo_help: Boolean,
        fbo_name: String
    },

    project:    {
        // TODO: Complete after application, status, vetting notes, etc -- THIS IS LAST
    }
});

var DocumentPackage = mongoose.model('DocumentPackage', DocumentPackageSchema);
module.exports = DocumentPackage;