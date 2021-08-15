let express=require('express');
let fs=require('fs');
const PORT=8080;
let app=express();
let messages=require('./messages.json');
let i=0;
app.use((req,res)=>{
    if(req.url=="/"){
        fs.readFile("index.html","utf8",(err,data)=>{
            if(err){
                console.error(err);
                return;
            }
            res.status(200).send(data);
        });
    }
});
app.listen(PORT,()=>{
    console.log(`"Server started on Port: ${PORT}"`);
});