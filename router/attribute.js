module.exports=(attribute,knex)=>{
    attribute.get('/',(req,res)=>{
        knex('attribute')
        .select('*')
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })


    attribute.get('/:attribute_id',(req,res)=>{
        knex('attribute')
        .select('*')
        .where('attribute_id',req.params.attribute_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })

    attribute.get('/values/:attribute_id',(req,res)=>{
        knex('attribute_value')
        .select('attribute_value.attribute_value_id',
                'attribute_value.value')
        .join('attribute', 'attribute_value.attribute_id' ,'=','attribute.attribute_id')
        .where('attribute.attribute_id',req.params.attribute_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
        
    })

    attribute.get('/inproduct/:product_id',(req,res)=>{
        knex('attribute')
        .select('attribute.name',
        'product_attribute.attribute_value_id',
        'attribute_value.value')
        .join('attribute_value', 'attribute.attribute_id' ,'=','attribute_value.attribute_id')
        .join('product_attribute', 'attribute_value.attribute_value_id' ,'=', 'product_attribute.attribute_value_id')
        .where('product_attribute.product_id',req.params.product_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })



}