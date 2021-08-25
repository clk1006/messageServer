const dbClient=require('./mongodb.js')
module.exports=(req,res)=>{
    const client=await dbClient;
    res.status(200).json(client);
}