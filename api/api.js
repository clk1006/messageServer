let fs=require ('fs');
let messages={
    i:0,
    messages:[]
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
            res.status(401).send("Request denied - wrong password")
        }
    }
    else{
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
            id:id
        };
        messages.messages.unshift(message);
        res.status(204).send();
        messages.i++;
    }
}