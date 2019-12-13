module.exports=(product,knex)=>{

    product.get('/',(req,res)=>{
        knex('product')
        .select('product_id',
        'name',
        'description',
        'price',
        "discounted_price",
        'thumbnail')
        .then((data)=>{
        var wholedata={
                count:data.length,
                rows:data
        }
        res.send(wholedata)
        }).catch((err)=>{
            res.send(err)
        })
    })
    product.get('/search',(req,res)=>{
        let sql = req.query.pro;
        // console.log(sql)   
        knex('product')
        .select('product_id',
        'name',
        'description',
        'price',
        "discounted_price",
        'thumbnail')
        .where('name', 'like', '% ' + sql)
        .orWhere('name',sql)
        .then((data)=>{
            res.json(data)
        }).catch((err)=>{
            res.send(err)
        })
        
    })
    product.get('/:id',(req,res)=>{
        knex('product')
        .select('product_id',
        'name',
        'description',
        'price',
        "discounted_price",
        'thumbnail')
        .where('product_id',req.params.id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })
    product.get('/incategory/:category_id',(req,res)=>{
        knex('product')
        .select('product.product_id',
        'product.name',
        'product.description',
        'product.price',
        "product.discounted_price",
        'product.thumbnail')
        .join('product_category',function(){
            this.on('product_category.product_id','=','product.product_id')
        })
        .where('product_category.category_id',req.params.category_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })

    })
    product.get('/indepartment/:department_id',(req,res)=>{
        knex('product')
        .select('product.product_id',
        'product.name',
        'product.description',
        'product.price',
        "product.discounted_price",
        'product.thumbnail')
        .join('product_category', 'product.product_id','=','product_category.product_id')
        .join('category', 'product_category.category_id','=','category.category_id')
        .where('category.department_id',req.params.department_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })
    product.get('/indepartment/:product_id/detail',(req,res)=>{
        knex('product')
        .select('product_id',
        'name',
        'description',
        'price',
        "discounted_price",
        'image',
        'image_2')
        .where('product.product_id',req.params.product_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })
    product.get('/:product_id/location',(req,res)=>{
        knex('product')
        .select('category.category_id',
        'category.name as category_name',
        'department.department_id',
        'department.name'
        )
        .join('product_category', 'product.product_id','=','product_category.product_id')
        .join('category', 'product_category.category_id','=','category.category_id')
        .join('department', 'category.department_id','=','department.department_id')
        .where('product.product_id',req.params.product_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })
    product.get('/:product_id/review',(req,res)=>{
        knex('review')
        .select('product.name',
                'review.review',
                'review.rating',
                'review.created_on')
        .join('product','review.product_id','=','product.product_id')
        .where('product.product_id',req.params.product_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })




    
    product.post('/:inproductid/review',(req,res)=>{
        knex('review')
        .insert({
            review: req.body.review,
            rating: req.body.rating,
            created_on: new Date(),
            customer_id: '1',
            product_id: req.params.inproductid
        })
        .where('product.product_id',req.params.inproductid)
        .then(()=>{
            res.send('done')
        }).catch((err)=>{
            res.send(err)
        })

    })

    


}