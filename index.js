const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5200;

//middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eogwfq1.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)


const client = new MongoClient(uri, {

  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    
    const productCollection = client.db('productDB').collection('product')
    const cartCollection = client.db('productDB').collection('cart');

    app.get('/product', async (req, res) => {
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);
    })


    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateProduct = req.body;

      const product = {
        $set: {
          image: updateProduct.image,
          name: updateProduct.name,
          brandName: updateProduct.brandName,
          price: updateProduct.price,
          type: updateProduct.type,
          rating: updateProduct.rating,
          description: updateProduct.description
        }
      }

      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
    })


    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })

    app.post('/cart', async (req, res) => {
      
      const cartItem = req.body;
      console.log(cartItem)
      const result = await cartCollection.insertOne(cartItem);
    
      res.send(result);
    });

    app.get('/cart', async (req, res) => {
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    });
    

    app.delete('/cart/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;

   
    const result = await cartCollection.deleteOne({ _id: new ObjectId(itemId) });

    if (result.deletedCount === 1) {
     
      res.status(204).send(); 
    } else {
    
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.delete('/cart/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const result = await cartCollection.deleteOne({ _id: new ObjectId(itemId) });

    if (result.deletedCount === 1) {
    
      res.status(204).send(); 
    } else {
     
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('cosmetic store server is running')
})

app.listen(port, () => {
  console.log(`cosmetic store is running on port: ${port}`)
})