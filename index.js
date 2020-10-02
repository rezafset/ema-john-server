const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y5kfv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

    app.post('/addOrder', (req, res)=>{
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result =>{
            // console.log(result);
            res.send(result.insertedCount > 0);
        })
    })

    app.post('/addProduct', (req, res)=>{
        const product = req.body;
        productsCollection.insertOne(product)
        .then(result =>{
            // console.log(result);
            res.send(result.insertedCount);
        })
    })
    
    // Load all product
    app.get('/products', (req, res)=>{
        productsCollection.find({})
        .toArray((err, document)=>{
            res.send(document);
        })
    })
    // Read a single product details
    app.get('/product/:key', (req, res)=>{
        productsCollection.find({key: req.params.key})
        .toArray((err, document)=>{
            res.send(document[0]);
        })
    })

    app.post('/productReview', (req, res)=>{
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, document)=>{
            res.send(document);
        })        
    })
});


app.listen(port);