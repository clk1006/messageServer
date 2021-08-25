const dbClient=require('./mongodb.js')
module.exports=async(req,res)=>{
    const client=await dbClient;
    res.status(200).json(client);
}