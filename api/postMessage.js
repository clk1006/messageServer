const fs=require('fs');
module.exports=(req,res)=>{
    let message=req.query;
    let messages={};
    fs.readFile("../messages.json","utf8",(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        messages=JSON.parse(data);
    });
    messages.messages.unshift(message);
    messages.messages=messages.messages.slice(0,6);
    messages.i++;
    res.status(200).json(messages.messages);
    fs.writeFile("../messages.json",JSON.stringify(messages),(err)=>{
        if(err){
            console.log(err);
            return;
        }
    });
}