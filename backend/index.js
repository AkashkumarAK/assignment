const express=require('express')
//const mysql=require('mysql')
const mongoose =require('mongoose');
const mongoURI="mongodb://localhost:27017/merndb";
bodyParser=require('body-parser');
const connectToMongo=()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("Connected to Mongo Successfull");
    }).catch((error)=>{
        console.log("error",error)
    })
    
}
//module.exports=connectToMongo;
connectToMongo()
const cors=require('cors')
const app=express()
const router=express.Router();
const userouter=require("./routers/userRouter")

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
//1st api
// app.get("/",(req,res)=>{
//     res.send("api running suceessfully")
// })

app.listen(4000,()=>{
    console.log('Running all ok on 8000')})
//creqate operatioin
app.use(userouter); 
//app.use("/api/user",userouter)

    module.exports=router;