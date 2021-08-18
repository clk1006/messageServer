let messages={
    i:0,
    messages:[]
}
let tokens=[];
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
        if(messages.i==req.query.i){
            res.status(200).json(messages.i);
        }else{
            res.status(200).json(messages);
        }
    }
    else if(req.query.type=="delete"){
        if(req.query.pw==process.env.admin_pw){
            if(req.query.ids=="all"){
                messages.i=0;
                messages.messages=[];
            }
            else{
                let ids=JSON.parse(req.query.ids);
                messages.i++;
                messages.messages=messages.messages.filter((x)=>{
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
        let token=createToken(tokens);
        tokens.push(token);
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
        if(tokens.includes(token)&&(filterType==""||filterType=="white"&&whiteList.includes(tokens.findIndex(tokenF))||filterType=="black"&&(!blackList.includes(tokens.findIndex(tokenF))))){
            let id=messages.i;
            const includesId=(arr,id)=>{
                arrIds=arr.map((x)=>x.id);
                return arrIds.includes(id);
            }
            while(includesId(messages.messages,id)){
                id++;
            }
            let message={
                origin:req.query.origin,
                text:req.query.text,
                id:id,
                userID:tokens.findIndex(tokenF)
            };
            messages.messages.unshift(message);
            res.status(204).send();
            messages.i++;
        }
        else{
            res.status(401).send("Request denied");
        }
    }
}