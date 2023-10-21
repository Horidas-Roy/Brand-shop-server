const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId,  } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// brand-shop
// Fe1seg4E8JG1QUxx

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.wcearye.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db("brandDB").collection("brand");
    const cardProductCollection=client.db("brandDB").collection("cardProduct");


    app.get("/", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/brandCollection/:brandName',async(req,res)=>{
       const brandName=req.params.brandName;
       const query={ brandName : brandName}
       const brand=await brandCollection.find(query).toArray();
       res.send(brand)
    })

     app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      console.log("new brand: ", id);
      const query={_id:new ObjectId(id)}
      const brand=await brandCollection.findOne(query);
      res.send(brand);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      console.log("new brand: ", id);
      const query={_id:new ObjectId(id)}
      const brand=await brandCollection.findOne(query);
      res.send(brand);
    });

    app.post("/brandCollection", async (req, res) => {
      const brand = req.body;
      console.log(brand);
      const result=await brandCollection.insertOne(brand);
      res.send(result)

    });


    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBrand=req.body;
      console.log(id,updatedBrand)
      const filter={_id:new ObjectId(id)}
      const options={upsert:true}

      const brand={
        $set:{
          productName:updatedBrand.productName,
          brandName:updatedBrand.brandName,
          productType:updatedBrand.productType,
          price:updatedBrand.price,
          rating:updatedBrand.rating,
          img:updatedBrand.img,
          description:updatedBrand.description
        }
      }
      const result=await brandCollection.updateOne(filter,brand,options)
      res.send(result);
    });

    
    // card related api

    app.get('/cardCollection',async(req,res)=>{
      const cursor=cardProductCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })

    
    app.get('/cardCollection/:email',async(req,res)=>{
      const email=req.params.email;
      const query={email:email}
      console.log(email,query);
      const result=await cardProductCollection.find(query).toArray()
      res.send(result);
    })
    app.get('/card/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:id}
      console.log(id,query);
      const result=await cardProductCollection.findOne(query)
      res.send(result);
    })

    app.post("/cardCollection",async(req,res)=>{
      const addedBrand=req.body;
      console.log(addedBrand)
      const result=await cardProductCollection.insertOne(addedBrand);
      res.send(result);
    })

    app.delete('/card/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:id};
      const result=await cardProductCollection.deleteOne(query)
      res.send(result);
    })

   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port:${port}`);
});
