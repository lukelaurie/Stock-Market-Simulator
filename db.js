const { MongoClient } = require('mongodb');

// Connection URI for your MongoDB database
const uri = "mongodb://localhost:80";

// Create a new MongoClient instance
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * Connect to the MongoDB database using the MongoClient instance
 */
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to database");
    } catch (err) {
        console.error(err);
    }
}

/**
 * Get a collection from the database
 * @param {String} collectionName - The name of the collection to retrieve
 * @return {Collection} - The MongoDB collection object
 */
async function getCollection(collectionName) {
    try {
        const db = client.db("your_database_name");
        const collection = db.collection(collectionName);
        return collection;
    } catch (err) {
        console.error(err);
    }
}

// Export the connectDB and getCollection functions
module.exports = {
    connectDB,
    getCollection,
};
