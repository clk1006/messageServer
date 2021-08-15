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
    }else if(req.url.includes("/getMessages")){
        messages.unshift(i);
        res.status(200).json(messages);
        messages.shift();
    }else if(req.url.includes("/postMessage")){
        req=req.url.substr(13).split("&");
        messages.unshift({
            origin:req[0].split("=")[1],
            text:req[1].split("=")[1]
        });
        messages=messages.slice(0,6);
        fs.writeFile("messages.json",JSON.stringify(messages), (err) => {
			if (err) console.log(err);
		});
        res.status(200).json(messages);
        i++;
    }else{
        res.status(404).send("404");
    }
});
app.listen(PORT,()=>{
    console.log(`"Server started on Port: ${PORT}"`);
});