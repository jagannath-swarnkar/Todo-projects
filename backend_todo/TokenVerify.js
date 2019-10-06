var jwt = require('jsonwebtoken');
let checkToken = (req,res,next)=>{    
    var token = req.query.token || req.body.token
    if(typeof(token) !== undefined){ 
         jwt.verify(req.body.token,process.env.SECRET,(err,tokenData)=>{
            if(!err){
                // console.log(tokenData)
                req.tokenData = JSON.parse(tokenData.data);
            }else{
                console.log('err in verifying toke in TokenVerify.js',err)
            }
         })
    }else{
        console.log('token is indefined',token)
    }
    next()
}
module.exports = checkToken;