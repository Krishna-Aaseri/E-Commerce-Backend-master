module.exports=(customer,knex,jwt)=>{
    customer.post('/',(req,res)=>{
            knex('customer')
            .insert({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            }).then(()=>{
                res.send('register done')
            }).catch((err)=>{
                res.send(err)
            }) 
       })

       customer.post('/loing',(req,res)=>{
           knex
           .select('email').from('customer').havingIn('customer.email',req.body.email)
           .then((data)=>{
               if(data.length==0){
                   res.send('worng email')
               }else{
                knex
                .select('customer_id','password').from('customer').where('customer.email',req.body.email).havingIn('customer.password',req.body.password)
                .then((data)=>{
                    if(data.length==0){
                        res.send('wrong password ')
                    }else{
                        data=JSON.parse(JSON.stringify(data))
                        let id=(data[0]['customer_id']).toString() 
                        // res.send(data)
                       const token =jwt.sign({"customer_id":id}, "aadil")
                        res.cookie(token)
                        res.send('loing successful')
                        }
                })

               }
           }).catch((err)=>{
               res.send(err)
           })
       })


       customer.put('/',(req,res)=>{
            var token=req.headers.cookie.split(" ")
            token=(token[token.length-1]).slice(0,-10)
            jwt.verify(token, 'aadil', (err,data)=>{
                if(!err){
                    knex('customer')
                    .where("customer_id",data.customer_id)
                    .update({
                        password:req.body.password,
                        email:req.body.email,
                        name:req.body.name,
                        credit_card:req.body.credit_card,
                        address_1:req.body.address_1,
                        address_2:req.body.address_2,
                        city:req.body.city,
                        region:req.body.region,
                        postal_code:req.body.postal_code,
                        country:req.body.country,
                        shipping_region_id:req.body.shipping_region_id,
                        day_phone:req.body.day_phone,
                        eve_phone:req.body.eve_phone,
                        mob_phone:req.body.mob_phone
                    })
                    .then(()=>{
                        res.send('updated')
                    }).catch((err)=>{
                        res.send(err)
                    })
                }else{
                    res.send(err.message)
                }
            })

           
       })

       customer.get('/',(req,res)=>{
        var token=req.headers.cookie.split(" ")
        token=(token[token.length-1]).slice(0,-10)
        jwt.verify(token , 'aadil', (err,data)=>{
            if(!err){
            knex('customer')
            .select('*')
            .where('customer.customer_id',data.customer_id)
            .then((data)=>{
                        delete data[0].password
                res.send(data)
            }).catch((err)=>{
                res.send(err)
            })
            }else{
                res.send(err)
            }
            
       
        })
       })

       customer.put('/',(req,res)=>{
        var token=req.headers.cookie.split(" ")
        token=(token[token.length-1]).slice(0,-10)
        jwt.verify(token, 'aadil', (err,data)=>{
            if(!err){
                knex('customer')
                .where("customer_id",data.customer_id)
                .update({
                    password:req.body.password,
                    email:req.body.email,
                    name:req.body.name,
                    credit_card:req.body.credit_card,
                    address_1:req.body.address_1,
                    address_2:req.body.address_2,
                    city:req.body.city,
                    region:req.body.region,
                    postal_code:req.body.postal_code,
                    country:req.body.country,
                    shipping_region_id:req.body.shipping_region_id,
                    day_phone:req.body.day_phone,
                    eve_phone:req.body.eve_phone,
                    mob_phone:req.body.mob_phone
                })
                .then(()=>{
                    res.send('updated')
                }).catch((err)=>{
                    res.send(err)
                })
            }else{
                res.send(err.message)
            }
        })

       
   })



   customer.put('/address',(req,res)=>{
    var token=req.headers.cookie.split(" ")
    token=(token[token.length-1]).slice(0,-10)
    jwt.verify(token, 'aadil', (err,data)=>{
        if(!err){
            knex('customer')
            .where("customer_id",data.customer_id)
            .update({
                address_1:req.body.address_1,
                address_2:req.body.address_2,
                
            })
            .then(()=>{
                res.send('updated')
            }).catch((err)=>{
                res.send(err)
            })
        }else{
            res.send(err.message)
        }
    })

   
})

customer.put('/creditcard',(req,res)=>{
    var token=req.headers.cookie.split(" ")
    token=(token[token.length-1]).slice(0,-10)
    jwt.verify(token, 'aadil', (err,data)=>{
        if(!err){
            knex('customer')
            .where("customer_id",data.customer_id)
            .update({
                credit_card:req.body.credit_card
                
            })
            .then(()=>{
                res.send('updated')
            }).catch((err)=>{
                res.send(err)
            })
        }else{
            res.send(err.message)
        }
    })

   
})


    }


