var db
const MongoClient = require('mongodb').MongoClient
const dbConnection = 'mongodb://localhost:27017'
const dbName = 'testtransaction'

const ObjectId = require('mongodb').ObjectID;

class CollectionContext {

    constructor (tblName) {
        this.tblName = tblName
    }

    listRecord() {
        const context = this
        return new Promise(async function(resolve, reject) {
            try {
                let client = await MongoClient.connect(dbConnection)

                if (client) {

                    db = client.db(dbName)
                
                    let result = await db.collection(context.tblName)
                                            .find()
                                            .toArray()
                    resolve(result)
                }
                else {
                    reject("Failed to connect to server")    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    paginateRecord(pageNumber = 0, pageSize = 10) {
        const context = this
        return new Promise(async function(resolve, reject) {
            try {

                pageNumber = Number(pageNumber)
                pageSize = Number(pageSize)
        
                if (isNaN(pageNumber) || isNaN(pageSize)) {
                    callback('Invalid parameters')
                }
        
                pageNumber = pageNumber > 0 ? pageNumber - 1 : pageNumber;
        
                let client = await MongoClient.connect(dbConnection)

                if (client) {

                    db = client.db(dbName)
        
                    let total = await db.collection(context.tblName).count()
                
                    let result = await db.collection(context.tblName)
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
                         
                    resolve(paginatedResult)
                }
                else {
                    reject("Failed to connect to server")    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    getRecord(recordId) {
        const context = this
        return new Promise(async function(resolve, reject) {
            try {
                recordId = ObjectId(recordId)

                let client = await MongoClient.connect(dbConnection)

                if (client) {

                    db = client.db(dbName)

                    let result = await db.collection(context.tblName)
                                         .findOne({_id: recordId})
                      
                                         resolve(result)
                }
                else {
                    reject("Failed to connect to server")    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    addRecord(record) {
        const context = this
        return new Promise(async function(resolve, reject) {
            try {
                let client = await MongoClient.connect(dbConnection)

                if (client) {

                    db = client.db(dbName)
        
                    let result = await db.collection(context.tblName)
                                         .insertOne(record)
                    
                    console.log(`Added record: ${result.ops[0]._id}`)
            
                    resolve(result.ops[0])
                }
                else {
                    reject("Failed to connect to server")    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    editRecord(recordId, record) {
        const context = this
        return new Promise(async function(resolve, reject) {
            try { delete record._id } catch {}
            try {

                recordId = ObjectId(recordId)

                let client = await MongoClient.connect(dbConnection)

                if (client) {

                    db = client.db(dbName)

                    let result = await db.collection(context.tblName)
                                         .findOneAndUpdate(
                                            {_id: recordId},
                                            { $set: record })

                    console.log(`Updated record: ${recordId}`)

                    resolve(Object.assign(result.value, record))
                }
                else {
                    reject("Failed to connect to server")    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    deleteRecord(recordId) {
        const context = this
        return new Promise(async function(resolve, reject) {
            try {
                recordId = ObjectId(recordId)

                let client = await MongoClient.connect(dbConnection)

                if (client) {

                    db = client.db(dbName)
        
                    let result = await db.collection(context.tblName)
                                         .findOneAndDelete({_id: recordId})
        
                    console.log(`Deleted record: ${recordId}`)
        
                    resolve(result.value)
                }
                else {
                    reject("Failed to connect to server")    
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    raw() {
        const context = this
        return new Promise(async function(resolve, reject) {
            try {
                let client = await MongoClient.connect(dbConnection)

                if (client) {

                    db = client.db(dbName)

                    resolve(db.collection(context.tblName))
                }
                else {
                    reject("Failed to connect to server")    
                }
            } catch (error) {
                reject(error)
            }
        })
    }
}

var context = new class DataContext  {
    constructor () {
        this.users = new CollectionContext('users')
    }
}

module.exports = context