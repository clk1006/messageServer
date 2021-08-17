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
        messages.i=0;
        messages.messages=[];
        res.status(200).send("done");
    }
    else{
        let message={
            origin:req.query.origin,
            text:req.query.text
        }
        messages.messages.unshift(message);
        res.status(200).json(messages);
        messages.i++;
    }
}