


var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

const { MongoClient } = require("mongodb");
//MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "reactdata";
const client = new MongoClient(url);
const db = client.db(dbName);


app.get("/listItems", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
        .collection("store")
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
});

app.get("/:id", async (req, res) => {
    const storeid = Number(req.params.id);
    console.log("Item to find :", storeid);
    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = {"id": storeid };
    const results = await db.collection("store")
    .findOne(query);
    console.log("Results :", results);
    if (!results) res.send("Not Found").status(404);
    else res.send(results).status(200);
});

app.post("/addItem", async (req, res) => {
    try {
        await client.connect();

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: 'Bad request: No data provided.'});
        }
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);

        const collections = await db.listCollections({name: "store"}).toArray();
        if (collections.length === 0) {
            return resizeTo.status(404).send({error: 'Not found: Collection does not exist.'});
        }

        const newDocument = {
            "id": values[0], // also "id": req.body.id,
            "title": values[1], // also "title": req.body.title,
            "price": values[2], // also "price": req.body.price,
            "description": values[3], // also "description": req.body.description,
            "image": values[4] // also "image": req.body.image
        };
        
        console.log(newDocument);

        

        const existingDoc = await db.collection("store").findOne({"id": newDocument.id});
        if (existingDoc) {
            return res.status(409).send({error: 'Conflict: An item with this ID already exists'});
        }

        const results = await db
        .collection("store")
        .insertOne(newDocument);
        res.status(200);
        res.send(results);
    }
    catch (error){
        console.log("An error occurred: ", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
});

app.delete("/deleteItem/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        await client.connect();
        const storeDeleted = await db.collection("store").findOne(query);
        res.send(storeDeleted);
        console.log("Item to delete :",id);
        const query = { id: id };
        // delete
        const results = await db.collection("store").deleteOne(query);
        res.status(200);
        res.send(results);
    }
    catch (error){
        console.error("Error deleting store:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put("/updateItem/:id", async (req, res) => {
    const id = Number(req.params.id);
    const query = { id: id };
    const storeUpdated = await db.collection("store").findOne(query);
    await client.connect();
    console.log("Item to Update :",id);
    // Data for updating the document, typically comes from the request body
    console.log(req.body);
    const updateData = {
        $set:{
            "title": req.body.title,
            "price": req.body.price,
            "description": req.body.description,
            "image": req.body.image
        }
    };
    // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
    const options = { };
    const results = await db.collection("store").updateOne(query, updateData, options);
    if (results.matchedCount === 0) {
        return res.status(404).send({ message: 'Item not found' });
    }
    res.status(200);
    res.send(storeUpdated);
    res.send(results);
});


app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});


