var express = require('express');
var app = express()
app.use(express.json())
const jwt=require("jsonwebtoken")   

var knex = require('knex')({
    client:"mysql",
    connection:{
        user:"root",
        host:"localhost",
        password:"'",
        database:"turing"
    }
})

app.use('/department',department=express.Router());
require('./department')(department,knex);

app.use('/categories', categories=express.Router());
require('./category')(categories,knex);

app.use('/attribute',attribute=express.Router());
require('./attribute')(attribute,knex)

app.use('/product',product=express.Router());
require('./product')(product,knex)

app.use('/customer',customer=express.Router());
require('./customer')(customer,knex,jwt)


app.use('/shopping',shopping=express.Router());
require('./shopping')(shopping,knex,jwt)

app.use('/order',order=express.Router());
require('./order')(order,knex,jwt)

app.use('/tax',tax=express.Router());
require('./tax')(tax,knex,jwt)

app.use('/shipping',shipping=express.Router());
require('./shipping')(shipping,knex)



app.listen(8000,()=>{
    console.log("working in port 8000")
})