module.exports=(department,knex)=>{
    department.get("/",(req,res)=>{
        knex.select("*")
        .from("department")
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
    })


    department.get("/:department_id",(req,res)=>{
        knex.select("*")
        .from("department")
        .where("department_id",req.params.department_id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err)
        })
        
    })





}