const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000

app.get('/' , (req , res) => {
    res.send("Hello heroku app.Successfully deploy ema john server on heroku app")
})

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvdk4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
// client.connect(err => {
//   const products = client.db("emaJohnStore").collection("products");

//   app.post('/addProduct' , (req , res) => {
//       const product = req.body;
//       console.log(product);
//       products.insertOne(product)
//       .then(result => {
//           console.log(result);
//       })
//   })
// });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvdk4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");


    app.post('/addProduct' , (req , res) => {
        const products = req.body;
        productsCollection.insertMany(products)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })

    app.get('/products' , (req , res) => {
        productsCollection.find({})
        .toArray((err , documents) => {
            res.send(documents)
        })
    })

    app.get('/products/:key' , (req , res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err , documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys' , (req , res) => {
        const productKeys = req.body;
        productsCollection.find({keys: { $in: productKeys }})
        .toArray((err , documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder' , (req , res) => {
        const order = req.body;
        ordersCollection.insertMany(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
});

app.listen(process.env.PORT || port);