let fs=require ('fs');
let messages={
    state:0,
    messages:[]
}
module.exports=(req,res)=>{
    if(req.query.type=="fetch"){
        if(messages.state==req.query.i){
            res.status(200).json(messages.i);
        }else{
            res.status(200).json(messages);
        }
    }
    else if(req.query.type=="delete"&req.query.pw==process.env.admin_pw){
        messages.i=0;
        messages.messages=[];
        res.status(200).send("done");
    }
    else{
        let id=messages.state;
        while(messages.messages.reduce((pre,x)=>{
            if(pre===x.id){
                return true;
            }
            return pre;
        },id)){
            id++;
        }
        let message={
            origin:req.query.origin,
            text:req.query.text,
            id:id
        };
        messages.messages.unshift(message);
        res.status(200).json(messages);
        messages.i++;
    }
}