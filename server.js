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
    }else if(req.url=="/postMessage"){
        messages.push({
            origin:req.params.origin,
            text:req.params.text
        });
    }else{
        res.status(404).send("404")
    }
});
app.listen(PORT,()=>{
    console.log(`"Server started on Port: ${PORT}"`);
});