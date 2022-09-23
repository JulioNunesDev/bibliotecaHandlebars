
 require('dotenv').config()
 const mongoose = require('mongoose')

 
 const user = process.env.USER_MONGODB
 const pass = process.env.PASSWORD_MONGODB


    mongoose.connect(`mongodb+srv://${user}:${pass}@clusterbiblioteca.ztz5qun.mongodb.net/?retryWrites=true&w=majority`,{
     useNewUrlParser: true, useUnifiedTopology: true
    }).then(()=>{
        console.log('servidor rodando');
    }).catch((err)=>{
        console.log('erro interno', err);
    })


