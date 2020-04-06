const cors = require("cors")
const express = require("express")
// TODO: Add Stripe Key
const stripe = require("stripe")("sk_test_JoNFg1abkiryks6iBY7MoEvY00FqRBvfHe")
const { v4: uuid } = require('uuid');


const app = express()

// middleware
app.use(express.json())
app.use(cors())

//routes

app.get("/", (req, res) => {
    res.send("Hello! World")
})

app.post("/payment", (req, res) =>{
    const {product, token} = req.body
    console.log("PRODUCT ", product)
    console.log("Price ", product.price)
    const idempotencyKey = uuid() 

    return stripe.customers.create({
        email: token.email ,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
        }, {idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))

})


//listen
app.listen(8282, ()=> console.log("Listing at 8282"))