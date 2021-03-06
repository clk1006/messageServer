const dbClient=require("./mongodb.js")
let storage={
    id:"storage",
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
    const data=client.db().collection("data");
    if((await data.find({init:1}).toArray()).length!=1){
        data.insertOne(storage);
        data.insertOne({init:1});
    }
    else{
        storage=await data.findOne({id:"storage"});
        console.log(JSON.stringify(storage));
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
            let selected=[];
            if(req.query.ids=="all"){
                selected=storage.messages.messages;
            }
            else{
                let ids=JSON.parse(req.query.ids);
                selected=storage.messages.messages.filter(x=>{
                    let isSelected=false;
                    ids.forEach(id => {
                        if(Array.isArray(id)&&id[0]<=x.id&&id[1]>=x.id||id==x.id) isSelected=true;
                    });
                    return isSelected;
                });
            }
            if(req.query.delType=="save") storage.messages.messages=storage.messages.messages.filter(x=>selected.includes(x));
            else storage.messages.messages=storage.messages.messages.filter(x=>!selected.includes(x));
            storage.messages.i++;
            if(storage.messages.messages.length==0){
                storage.messages.i=0
            }
            res.status(200).json(storage.messages.messages);
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
            let message={
                origin:req.query.origin,
                text:req.query.text,
                id:storage.messages.i,
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
    data.updateOne({id:"storage"},{$set:storage});
}