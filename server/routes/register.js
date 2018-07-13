const userSchema = require('../models/userModel');

module.exports = (app,cluster,clients)  => {
    // app.post('/register',(req,res,next) => {
    //     console.log('got POST request to /register hadlding by worker',cluster.worker.id);
    //         if(req.body.username && req.body.email){
    //             userSchema.findOne({'email': req.body.email}, (err,user) => {
    //                 if(err){
    //                     console.log('error occurred',err);
    //                 }
    //                 if(user){
    //                     res.status(200).send({succes: true, message: 'logging you in...'});
    //                 }
    //                 else{
    //                     const userObj = {
    //                         username : req.body.username,
    //                         email: req.body.email,
    //                     }
        
    //                     var userschema = new userSchema(userObj);
    //                     userschema.save((err,data) => {
    //                         if(err){
    //                             console.log('error occured while saving');
    //                         }
    //                         else{
    //                             res.status(200).send({success:true,message:'welcome to chat room'});
    //                         }
    //                     })
    //                 }
    //             })
    //         }
    //         else{
    //             console.log('details empty in body');
    //             res.status(400).send({succes:false,message:'invalid credentails'});
    //         }
             
    // });

    // app.get('/register',(req,res,next) => {
        
    // })

    app.post('/enterroom',(req,res,next) => {
        if(clients[req.body.email]){
            res.status(200).send({status:'',message:'already session available',
                address:clients[req.body.email].hadshake.address})
        }
        else{
             
             const users = Object.keys(clients);
             console.log('userss',users);
            res.status(200).send({status:'success',message:'new login',address:null,});
        }
    })
}
