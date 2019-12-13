module.exports=(tax,knex)=>{
    tax.get('/',(req,res)=>{
        knex('tax').select('*').then((data)=>{res.send(data)}).catch((err)=>{res.send(err)})})

    tax.get('/:tax_id',(req,res)=>{
        knex('tax')
        .select('*')
        .where('tax.tax_id',req.params.tax_id)
        .then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
    })
}