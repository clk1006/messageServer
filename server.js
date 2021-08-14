let express=require('express');
let fs=require('fs');
const PORT=8080;
let app=express();
let messages=[];
app.use((req,res)=>{
    if(req.url=="/"){
        fs.readFile("index.html","utf8",(err,data)=>{
            if(err){
                console.error(err);
                return;
            }
            res.status(200).send(data);
        });
    }else if(req.url=="/getMessages"){
        res.json(messages);
    }else if(req.url.includes("/postMessage")){
        req=req.url.substr(13).split("&");
        messages.push({
            origin:req[0].split("=")[1],
            text:req[1].split("=")[1]
        });
        console.log(messages);
    }else{
        res.status(404).send("404");
    }
});
app.listen(PORT,()=>{
    console.log(`"Server started on Port: ${PORT}"`);
});