module.exports=(cat,knex)=>{
    categories.get('/',(req,res)=>{
        knex.select('*')
        .from('category')
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })



    cat.get("/:category_id",(req,res)=>{
        knex.select("*")
        .from("category")
        .where("category_id",req.params.category_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
        
    })

    cat.get('/inproduct/:product_id',(req,res)=>{
        knex('product_category')
        .select('category.category_id',
                "category.department_id",
                "category.name")
        .join('category', 'product_category.category_id' ,'=', 'category.category_id')
        .where('product_category.product_id',req.params.product_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })
    cat.get('/inDepartment/:department_id',(req,res)=>{
        knex('category')
        .select('category.category_id',
        "category.department_id",
        "category.name",
        "category.description")
        .join('department', 'category.department_id ','=',"department.department_id")
        .where('department.department_id',req.params.department_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })


}