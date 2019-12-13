module.exports=(shopping,knex,jwt)=>{
    shopping.get('/generateUniqueId',(req,res)=>{
        let r = Math.random().toString(36).substring(2);
         res.send({card_id:r})
    })
 

    shopping.post("/add",(req,res)=>{
        var token=req.headers.cookie.split(" ")
        token=(token[token.length-1]).slice(0,-10)
        jwt.verify(token,'aadil',(err,maindata)=>{
            if(!err){
                knex('product')
                .select('*')
                .where('product.product_id',req.body.product_id)
                .then((data)=>{
                    knex.select('*').from('shopping_cart').havingExists(function() {
                        this.select('*').from('shopping_cart').whereRaw('shopping_cart = .id');
                      })
                    knex('shopping_cart')
                    .insert({
                        quantity:1,
                        added_on:new Date(),
                        product_id:req.body.product_id,
                        attributes:req.body.attributes,
                        cart_id:maindata.customer_id})
                    .then(()=>{
                        send_data={
                            name:data[0]['name'],
                            price:data[0]['price'],
                            image:data[0]['image']
                                                        
                        }
                        res.send(send_data)
                    }).catch((err)=>{res.send(err)}) 
              }).catch((err)=>{res.send(err)})
            }else{res.send(err)}
       })
    })

    shopping.get('/cart/:id',(req,res)=>{
        knex('shopping_cart')
        .select('*')
        .where('shopping_cart.cart_id',req.params.id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })



    shopping.put('/update/:item_id',(req,res)=>{
        var token=req.headers.cookie.split(" ")
        token=(token[token.length-1]).slice(0,-10)
        jwt.verify(token,'aadil',(err,maindata)=>{
            if(!err){
                knex('shopping_cart')
                .select('*')
                .update({
                    quantity:req.body.quantity
                })
                .where('shopping_cart.item_id',req.params.item_id)
                .then(()=>{
                    knex('shopping_cart')
                    .select('*')
                    .join('product','shopping_cart.product_id','=','product.product_id')
                    .where('shopping_cart.item_id',req.params.item_id)
                    .then((data)=>{
                        var send_data={
                            item_id:data[0]['item_id'],
                            name:data[0]['name'],
                            attributes:data[0]['attributes'],
                            product_id:data[0]['product_id'],
                            quantity:data[0]['quantity'],
                            subtotal:data[0]['price']*data[0]['quantity']
                        }
                        res.send(send_data)
                    }).catch((err)=>{
                        res.send(err)})
                })
                .catch((err)=>{
                    res.send((err))})
            }else{
                res.send(err)
            }
        })
    })

    shopping.delete('/empty/:cart_id',(req,res)=>{
        knex('shopping_cart')
        .where('shopping_cart.cart_id',req.params.cart_id)
        .del()
        .then(()=>{
            res.send([])
        })
        .catch((err)=>{
            res.send(err)
        })
    })

    shopping.get('/movecart/:item_id',(req,res)=>{
        let item_id=req.params.item_id;
        knex('save_item')
        .select('*')
        .where('save_item.item_id',item_id)
        .then((data)=>{
            // res.send(data)
            data[0].added_on = new Date();
            knex('shopping_cart')               
                .insert(data[0])
                then(()=>{
                knex('save_item')
                .where('save_item.item_id',item_id)
                .del()
                .then(()=>{
                return res.send('your data moved to cart')
                }).catch((err)=>{
                    res.send(err)
                })
       
            })
            .catch((err)=>{
                res.send(err)
            })
        }).catch((err)=>{
            res.send(err)
        })
    })
    
    shopping.get('/totalAmount/:cart_id',(req,res)=>{
        knex('shopping_cart')
        .select("*")
        .join('product',function(){
            this.on('product.product_id', 'shopping_cart.product_id')
        })
        .where('shopping_cart.cart_id',req.params.cart_id)
        
        .then((data)=>{
            var subtotal=0;
            // let totalAmount = data.map(eachItem => eachItem.subtotal = parseFloat((eachItem.price * eachItem.quantity).toFixed(2))).reduce((a, b) => a + b, 0);
            for(i in data){
                one=(data[i]['price']*data[i]['quantity'])
                subtotal+=one
            }
            res.json({subtotal:subtotal})
            
        }).catch((err)=>{
            res.send(err)
        })
    })

    shopping.get('/saveforleter/:item_id',(req,res)=>{
        knex.schema.hasTable('save_item').then(function(exists) {
            if (!exists) {
              return knex.schema.createTable('save_item', function(table) {
                table.integer('item_id').primary();
                table.string('cart_id');
                table.integer('product_id');
                table.string('attributes');
                table.string('quantity');

                knex('shopping_cart')
                .select('item_id','product_id','attributes','quantity','cart_id')
                .where('shopping_cart.item_id',req.params.item_id)
                .then((data)=>{
                    knex('save_item')
                    .insert(data[0])
                    .then(()=>{
                        knex('shopping_cart')
                        .where('shopping_cart.item_id',req.params.item_id)
                        .del()
                        .then(()=>{
                            res.send('your product has been saved for later')
                        })
                    }).catch((err)=>{
                        res.send(err)
                    })
                }).catch((err)=>{
                    res.send(err)
                })    
              });
            }else{
                knex('shopping_cart')
                .select('item_id','product_id','attributes','quantity','cart_id')
                .where('shopping_cart.item_id',req.params.item_id)
                .then((data)=>{
                    knex('save_item')
                    .insert(data[0])
                    .then(()=>{
                        knex('shopping_cart')
                        .where('shopping_cart.item_id',req.params.item_id)
                        .del()
                        .then(()=>{
                            res.send('your product has been saved for later')
                        }).catch((err)=>{
                            res.send(err)                        
                        })
                    })
                }).catch((err)=>{
                    res.send(err)
                })
            }
          });
    })

    shopping.get('/getsave/:cart_id',(req,res)=>{
        knex('save_item')
        .select('product.name','item_id','attributes','price')
        .join('product','save_item.cart_id','=','product.product_id')
        .where('save_item.cart_id',req.params.cart_id)
        .then((data)=>{
            res.send(data[0])
        }).catch((err)=>{
            res.send(err)
        })
    })

    shopping.delete('/removeProduct/:item_id', (req, res) => {
        let item_id = req.params.item_id;

        knex('shopping_cart')
            .where('shopping_cart.item_id', item_id)
            .del()
            .then(() => {
                console.log('data deleted from cart using item_id!');
                return res.json({ removeProduct: 'product removed by item_id!' });
            })
            .catch((err) => {
                console.log(err);
                return res.send(error.error500);
            })
    })

}