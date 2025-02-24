const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');


const app = express();

app.use("/static", express.static("./public/"));
app.use("/", express.static("./node_modules/bootstrap/dist/"));

app.use(express.json())
app.use(express.urlencoded({extended: true}));

const uri = process.env.MONGO_URI;

const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        // Ensures that the client will close when you finish/error
        console.log(error);
    }
}

run().catch(console.dir);

const itemSchema = new mongoose.Schema({
    name: String,
    list_id: String,
    complete: Boolean,
});

const task = mongoose.model('Task', itemSchema);

app.set("view engine", "ejs");

app.get('/', async (req, res) => {

    res.redirect('/tasks')
});

app.get('/:list_id', async (req, res) => {

    let listID = req.params.list_id;

    const data = await task.find({list_id: listID});

    res.status(200);
    res.render('index', {data: data});
});

app.post('/add/:list_id', async (req, res) => {
    let name = req.body.name;
    let listID = req.params.list_id;
    if (!name) return;

    try {
        await task.insertOne({name: name, list_id: listID, complete: false});
    } catch (error) {
        console.log("Insert failed: " + error);
    }

    res.redirect('/' + listID);
});

app.post('/update/:list_id/:id', async (req, res) => {
    let id = req.params.id;
    let listID = req.params.list_id;
    if (!id) return;

    const itemToUpdate = await task.findById(id);
    if (!itemToUpdate) return;

    let name = req.body.name;
    if (!name) return;


    itemToUpdate.name = name;
    itemToUpdate.complete = req.body.complete;

    try {
        await itemToUpdate.save();
    } catch (error) {
        console.log("Update failed: " + error);
    }

    const data = await task.find({list_id: listID});

    res.status(200);
    //res.render('index', {data: data});
    //res.redirect('/' + listID);
});

app.post('/delete/:list_id/:id', async (req, res) => {
    let id = req.params.id;
    let listID = req.params.list_id;

    try {
        await task.findOneAndDelete({_id: id});
    } catch (error) {
        console.log("Delete failed: " + error);
    }

    res.redirect('/' + listID);
})

const port = 3000;
app.listen(port, () => console.log("Server Up and running on " + port));