let messages={
    i:0,
    messages:[]
}
module.exports=(req,res)=>{
    if(req.query.type=="get"){
        console.log(messages);
        res.status(200).json(messages);
    }
    else{
        let message={
            origin:req.query.origin,
            text:req.query.text
        }
        messages.messages.unshift(message);
        messages.messages=messages.messages.slice(0,6);
        res.status(200).json(messages);
        messages.i++;
    }
}