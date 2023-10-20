const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5200;

//middleware
app.use(cors())
app.use(express.json())

//beautyandCosmetic
//k6pBwJd4397ntHQC

// const uri = "mongodb+srv://<username>:<password>@cluster0.eogwfq1.mongodb.net/?retryWrites=true&w=majority";

const uri = "mongodb+srv://beautyandCosmetic:k6pBwJd4397ntHQC@cluster0.eogwfq1.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    const productCollection = client.db('productDB').collection('product')
    
    app.get('/product', async(req, res)=>{
      const cursor  = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })


app.get('/', (req, res) => {
    res.send('cosmetic store server is running')
})

app.listen(port, () => {
    console.log(`cosmetic store is running on port: ${port}`)
})