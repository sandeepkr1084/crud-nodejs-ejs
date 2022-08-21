const express = require('express');
const {MongoClient} = require('mongodb');
const {ObjectId} = require('mongodb');
const app = express();
var bodyParser = require('body-parser');


const url = 'mongodb://localhost:27017';
const mongodb = new MongoClient(url)

async function connect() {
    let conn = await mongodb.connect();
    let db = conn.db('Employee');
    return db;
}

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.get('/employees', (req, res) => {
    let db = connect();
    db.then(dbConn => {
        dbConn.collection('employees').find().toArray().then(data => {
            res.render('employees', {data: data} );
        })
    })
});

app.get('/add-employee', (req, res) => {
    res.render('add-employee');
})

app.post('/add-employee', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;

    let db = connect();
    db.then(dbConn => {
        dbConn.collection('employees').insertOne({name: name, email: email}).then(data => {
            res.redirect('employees');
        })
    })
})

app.get('/delete', (req, res) => {
    var id = req.query.id;
    let db = connect();
    db.then(dbConn => {
        dbConn.collection('employees').deleteOne({_id: ObjectId(id)}).then(data => {
            res.redirect('employees');
        })
    })
})

app.get('/employee', (req, res) => {
    var id = req.query.id;

    let db = connect();
    db.then(dbConn => {
        dbConn.collection('employees').findOne({_id: ObjectId(id)}).then(employee => {
            res.render('employee-details', {employee});
        })
    })
})

app.get('/update-employee', (req, res) => {
    let id = req.query.id;
    let db = connect();

    db.then(dbConn => {
        dbConn.collection('employees').findOne({_id: ObjectId(id)}).then(employee => {
            res.render('update-employee', {employee});
        })
    })
});

app.post('/update-employee', (req, res) => {
    let employee = {
        name: req.body.name,
        email: req.body.email
    }
    let db = connect();
    db.then(dbConn => {
        dbConn.collection('employees').updateOne({_id: ObjectId(req.body.id)}, {$set: employee}).then(data =>{
            res.redirect('employees')
        })
    })
})

app.get('*', (req, res) => {
    res.redirect('employees')
})


app.listen(5000);
