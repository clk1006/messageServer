const fs=require('fs');
module.exports=(req,res)=>{
    let messages={};
    fs.readFile("../messages.json","utf-8",(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        messages=JSON.parse(data);
    });
    res.status(200).json(messages);
}