let messages={
    i:0,
    messages:[]
}
module.exports=(req,res)=>{
    if(req.query.type=="get"){
        res.status(200).json(messages);
    }
    else{
        let message={
            origin:req.query.origin,
            text:req.qery.text
        }
        messages.messages.unshift(message);
        message.messages=messages.messages.slice(0,6);
        res.status(200).json(messages);
        messages.i++;
    }
}