const dbClient=require("./mongodb.js")
let storage={
    messages:{
        i:0,
        messages:[]
    },
    tokens:[],
    whiteList:[],
    blackList:[],
    filterType:""
}
const createToken=(tokens)=>{
    let token="";
    while(token.length<15){
        token+=Math.floor(Math.random()*10);
    }
    if(tokens.includes(token)){
        return createToken(tokens);
    }
    return token;
}
module.exports=async(req,res)=>{
    const client=await dbClient;
    const data=client.db().collection(data);
    if((await data.find({init:1}).toArray()).length!=1){
        data.insertOne({init:1});
    }
    else{
        storage=await data.findOne({measages:{}});
    }
    if(req.query.type=="fetch"){
        if(storage.messages.i==req.query.i){
            res.status(200).json(storage.messages.i);
        }else{
            res.status(200).json(storage.messages);
        }
    }
    else if(req.query.type=="delete"){
        if(req.query.pw==process.env.admin_pw){
            if(req.query.ids=="all"){
                storage.messages.i=0;
                storage.messages.messages=[];
            }
            else{
                let ids=JSON.parse(req.query.ids);
                storage.messages.i++;
                storage.messages.messages=storage.messages.messages.filter((x)=>{
                    return (!ids.includes(x.id));
                });
            }
            res.status(204).send();
        }
        else{
            res.status(401).send("Request denied - wrong password");
        }
    }
    else if(req.query.type=="getToken"){
        let token=createToken(storage.tokens);
        storage.tokens.push(token);
        res.status(200).send(token);
    }
    else if(req.query.type=="mod"){
        if(req.query.pw==process.env.admin_pw){
            if(req.query.whiteList!=null) storage.whiteList=req.query.whiteList;
            if(req.query.blackList!=null) storage.blackList=req.query.blackList;
            if(req.query.filterType!=null) storage.filterType=req.query.filterType;
            res.status(200).json([storage.whiteList,storage.blackList,storage.filterType]);
        }
        else{
            res.status(401).send("Request denied - wrong password");
        }
    }
    else if(req.query.type=="readFile"){
        if(req.query.pw==process.env.admin_pw){
            fs.readFile("storage.json",(err,data)=>{
                if(err){
                    return;
                }
                res.status(200).send(data);
            })
        }
        else{
            res.status(401).send("Request denied - wrong password");
        }
    }
    else{
        const token=req.query.token;
        const tokenF=(x)=>x==token;
        if(storage.tokens.includes(token)&&(storage.filterType==""||storage.filterType=="white"&&storage.whiteList.includes(storage.tokens.findIndex(tokenF))||storage.filterType=="black"&&(!storage.blackList.includes(storage.tokens.findIndex(tokenF))))){
            let id=storage.messages.i;
            const includesId=(arr,id)=>{
                arrIds=arr.map((x)=>x.id);
                return arrIds.includes(id);
            }
            while(includesId(storage.messages.messages,id)){
                id++;
            }
            let message={
                origin:req.query.origin,
                text:req.query.text,
                id:id,
                userID:storage.tokens.findIndex(tokenF)
            };
            storage.messages.messages.unshift(message);
            res.status(204).send();
            storage.messages.i++;
        }
        else{
            res.status(401).send("Request denied");
        }
    }
}