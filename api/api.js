let storage=require('storage.json');
let whiteList=[];
let blackList=[];
let filterType="";
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
module.exports=(req,res)=>{
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
            if(req.query.whiteList!=null) whiteList=req.query.whiteList;
            if(req.query.blackList!=null) blackList=req.query.blackList;
            if(req.query.filterType!=null) filterType=req.query.filterType
            res.status(200).json([whiteList,blackList,filterType]);
        }
        else{
            res.status(401).send("Request denied - wrong password");
        }
    }
    else{
        const token=req.query.token;
        const tokenF=(x)=>x==token;
        if(storage.tokens.includes(token)&&(filterType==""||filterType=="white"&&whiteList.includes(storage.tokens.findIndex(tokenF))||filterType=="black"&&(!blackList.includes(storage.tokens.findIndex(tokenF))))){
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