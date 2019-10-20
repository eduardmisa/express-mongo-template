var db
const MongoClient = require('mongodb').MongoClient
const dbConnection = 'mongodb://localhost:27017'
const dbName = 'testtransaction'

const ObjectId = require('mongodb').ObjectID;

class CollectionContext {

    constructor (tblName) {
        this.tblName = tblName
    }

    listRecord({callback}) {
        MongoClient.connect(dbConnection, async (err, client) => {
            if (err) throw err
            db = client.db(dbName)
        
            let result = await db.collection(this.tblName)
                                 .find()
                                 .toArray()

            callback(result)
        })
    }

    paginateRecord({pageNumber = 0, pageSize = 10, callback}) {

        pageNumber = Number(pageNumber)
        pageSize = Number(pageSize)

        if (isNaN(pageNumber) || isNaN(pageSize)) {
            callback('Invalid parameters')
        }

        pageNumber = pageNumber > 0 ? pageNumber - 1 : pageNumber;

        MongoClient.connect(dbConnection, async (err, client) => {
            if (err) throw err
            db = client.db(dbName)

            let total = await db.collection(this.tblName).count()
        
            let result = await db.collection(this.tblName)
                                 .find()
                                 .skip(pageSize * pageNumber)
                                 .limit(pageSize)
                                 .toArray()

            var paginatedResult = {
                total: total,
                pageNumber: pageNumber + 1,
                pageSize: pageSize,
                results: result,
            }

            callback(paginatedResult)
        })
    }

    getRecord({recordId, callback}) {
        recordId = ObjectId(recordId)
        MongoClient.connect(dbConnection, async (err, client) => {
          if (err) throw console.log(err)
          db = client.db(dbName)

          let result = await db.collection(this.tblName)
                               .findOne({_id: recordId})
            
          callback(result)
        })
    }

    addRecord({record, callback}) {
        MongoClient.connect(dbConnection, async (err, client) => {
            if (err) throw console.log(err)
            db = client.db(dbName)
        
            let result = await db.collection(this.tblName)
                                 .insertOne(record)
            
            console.log(`Updated record: ${result._id}`)
    
            callback(result)
        })
    }

    deleteRecord({recordId, callback}) {
        recordId = ObjectId(recordId)
        MongoClient.connect(dbConnection, async (err, client) => {
            if (err) throw console.log(err)
            db = client.db(dbName)
        
            let result = await db.collection(this.tblName)
                                 .findOneAndDelete({_id: recordId})

            console.log(`Deleted record: ${recordId}`)

            callback(result)
        })
    }

    editRecord({recordId, record, callback}) {
        recordId = ObjectId(recordId)
        try { delete record._id } catch {}
        MongoClient.connect(dbConnection, async (err, client) => {
            if (err) throw console.log(err)
            db = client.db(dbName)
        
            let result = await db.collection(this.tblName)
                                 .findOneAndUpdate(
                                    {_id: recordId},
                                    { $set: record })

            console.log(`Updated record: ${recordId}`)

            callback(result)
        })
    }

    raw(callback) {
        MongoClient.connect(dbConnection, (err, client) => {
          if (err) throw console.log(err)
          db = client.db(dbName)

          callback(db.collection(this.tblName))
        })
    }
}

var context = new class DataContext  {
    constructor () {
        this.users = new CollectionContext('users')
        this.products = new CollectionContext('products')
    }
}

module.exports = context