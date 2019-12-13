module.exports=(order,knex,jwt)=>{
    order.post('/',(req,res)=>{
        var token=req.headers.cookie.split(" ")
        token=(token[token.length-1]).slice(0,-10)
        jwt.verify(token,"aadil",(err,data)=>{
            if(!err){
                knex('customer')
                .select('*')
                .where('customer.customer_id',data.customer_id)
                .then((customer_data)=>{
                    knex('shopping_cart')
                    .select('*')
                    .join('product','shopping_cart.product_id','=','product.product_id')
                    .where('shopping_cart.cart_id',data.customer_id)
                    .then((shopping_cart_data)=>{
                        // res.send(product)
                        var total=0;
                        for(i in shopping_cart_data){
                            need=shopping_cart_data[i]['quantity']*shopping_cart_data[i]['price'];
                            total+=need
                        }
                        if(total==0){
                            res.send('something add in your shoppin cart')
                        }
                        else{
                            knex('orders')
                            .insert({
                                total_amount:total,
                                created_on: new Date(),
                                comments:req.body.comments,
                                customer_id:data.customer_id,
                                shipping_id:req.body.shipping_id,
                                tax_id:req.body.tax_id 
                            })
                            .then(()=>{
                                knex('shopping_cart')
                                .where('shopping_cart.cart_id', data.customer_id)
                                .del()
                                .then(()=>{
                                    knex('orders')
                                    .then((orders_data) => {
    
                                        shopping_cart_data.map(eachItem => {
                                            return (
                                                knex('order_detail')
                                                .insert({
                                                    'order_id': orders_data[orders_data.length - 1].order_id,
                                                    'product_id': eachItem.product_id,
                                                    'attributes': eachItem.attributes,
                                                    'product_name': eachItem.name,
                                                    'quantity': eachItem.quantity,
                                                    'unit_cost': eachItem.price
                                                })
                                                .then(() => {
                                                    console.log();
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                })
                                        )
                                        })
                                        
                                        return res.json({ order_id: orders_data[orders_data.length - 1].order_id });
                                   
                                }).catch((err)=>{
                                    res.send(err)
                                })
                                }).catch((err)=>{
                                    res.send(err)
                                })
                              
                        
                        }).catch((err)=>{
                            res.send(err)
                        })
                    }
                    }).catch((err)=>{
                        res.send(err)
                    })
                }).catch((err)=>{
                    res.send(err)
                })

            }else{
                res.send(err)
            }
     })
        
    })

        order.get('/:order_id',(req,res)=>{
            var token=req.headers.cookie.split(" ")
        token=(token[token.length-1]).slice(0,-10)
        jwt.verify(token,"aadil",(err,data)=>{
            if(!err){
                knex('order_detail')
                .select('*')
                .where('order_detail.order_id',req.params.order_id)
                .then((data)=>{
                    res.send(data)
                }).catch((err)=>{
                    res.send(err)
                })
            }else{
                res.send({message:err})
            }
        })

        })

        order.get('/incustomer/by',(req,res)=>{
            var token=req.headers.cookie.split(" ")
            token=(token[token.length-1]).slice(0,-10)
            jwt.verify(token,"aadil",(err,data)=>{
                if(!err){
                    knex('orders')
                    .select(
                        'order_id',
                        'total_amount',
                        'created_on',
                        'shipped_on',
                        'status',
                        'name'
                    )
                    .join('customer','orders.customer_id','=','customer.customer_id')
                    .where('orders.customer_id',data.customer_id)
                    .then((data)=>{
                        res.send(data)
                    }).catch((err)=>{
                        res.send(err)
                    })
                }else{
                    res.send(err)
                }
            })

        })

        order.get('/shortdetail/:order_id',(req,res)=>{
            var token=req.headers.cookie.split(" ")
            token=(token[token.length-1]).slice(0,-10)
            jwt.verify(token,"aadil",(err,data)=>{
                if(!err){
                    knex('orders')
                    .select(
                        'order_id',
                        'total_amount',
                        'created_on',
                        'shipped_on',
                        'status',
                        'name'
                    )
                    .join('customer','orders.customer_id','=','customer.customer_id')
                    .where('orders.order_id',req.params.order_id)
                    .then((data)=>{
                        res.send(data)
                    }).catch((err)=>{
                        res.send(err)
                    })
                }else{
                    res.send(err)
                }
            })

        })
            
}



                
                   