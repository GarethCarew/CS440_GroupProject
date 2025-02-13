const express = require("express");
const mongoose = require('mongoose');

const app = express();

app.use("/static", express.static("public"));

app.use(express.urlencoded({extended: true}));

const uri = "mongodb+srv://USER:PASS@cluster0.aufu7kz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        // Ensures that the client will close when you finish/error
        console.log(error);
    }
}
run().catch(console.dir);

const itemSchema = new mongoose.Schema({
    name: String
});

const item = mongoose.model('Task', itemSchema);

app.set("view engine", "ejs");

app.get('/', async (req, res) => {

    const data = await item.find({});

    res.render('index', {data: data});
});

app.post('/', async (req, res) => {
    console.log(req.body.content);

    let itemString = req.body.content

    await item.insertOne({name: itemString});

    res.redirect('/');
});

app.post('/update/:id', async (req, res) => {
    let id = req.params.id;

    const itemToUpdate = await item.findById(id);

    itemToUpdate.name = req.body.edit;

    await itemToUpdate.save();

    res.redirect('/');
})

app.post('/delete/:id', async (req, res) => {
    let id = req.params.id;

    await item.findOneAndDelete({_id: id});

    res.redirect('/');
})

app.listen(3000, () => console.log("Server Up and running"));