//define all requirement
const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
//creates the bcrypt algorithm path
const bcrypt=require("bcrypt");
//define Salt round
const saltRound=5;
//converting the requirement into usages
const app=express();
//taking ejs in control
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
//send static file like css or any html file
//here "public is the name of folder where all static files live"

//Now, connect with mongoDB server
mongoose.connect("mongodb://localhost:27017/userCredential",{useNewUrlParser:true,useUnifiedTopology:true});

//Create the monoDB schema
const toSchema=new mongoose.Schema({
    username:String,
    password:String,
    category:String
});

//Create the monoDB model by using the schema
const Data=new mongoose.model("user",toSchema);
//app.use(express.static("public"));

//now our first main page(main) shown on get request

/*here we use "render" function for dynamic file send not the same as "send" function what's use for 
send static block*/
app.get("/",function(req,res){
    res.render('main');
});
//render check file for checking registration process for customer or shop keeper
app.post("/main",function(req,res){
    res.render("check");
});
//now render page depend upon button chooses
app.post("/check",function(req,res){
    const choice=req.body.check;
    if(choice==="shopKeeper"){
        res.render("shopKeeperRegistration");
    }
    else{
        res.render("customerRegistration");
    }
});
//create registration & login data both for Shop Keeper & customer page also by usng "params" feature of ejs
app.post("/:get",function(req,res){
    const url=req.params.get;

   if(url==="shopKeeperRegistration"){
        var shopKeeperPhoneNumber=req.body.phoneNumber;
        var shopKeeperpassword=req.body.password;
          
        //convert number & password to string
        shopKeeperPhoneNumber=shopKeeperPhoneNumber.toString();
         shopKeeperpassword=shopKeeperpassword.toString();
           
         //creates the shop Keeper password hash by bcrypt algorithm 
         bcrypt.hash(shopKeeperpassword,saltRound,function(err,hash){
            //craetes the shop keeper table by using data model
            const user=new Data({
            username:shopKeeperPhoneNumber,
            password:hash,
            category:"shopKeeper"
         });
        
         //save the shop keeper table in monoDb successfully asynchronuslly and check the error while saving the data in database
           user.save(function(err,doc){
               if(err){
                res.render("shopKeeperRegistration");
               }
               else{
                res.render("shopKeeperlogin");
               }
           });
         });
       
        
    }
    else if(url==="customerRegistration"){
    var customerUserName=req.body.userName;
    var customerPassword=req.body.password;

     //convert number & password to string
     customerUserName=customerUserName.toString();
     customerPassword=customerPassword.toString();

     //creates the hash password for customer by using bcrypt algorithm
     bcrypt.hash(customerPassword,saltRound,function(err,hash){
        //craetes the customer table by using data model
       const user1=new Data({
        username:customerUserName,
        password:hash,
        category:"customer"
     });
    //save the customer table in monoDb successfully asynchronuslly and check the error while saving the data in database
    user1.save(function(err,doc){
        if(err){
         res.render("customerRegistration");
        }
        else{
         res.render("customerlogin");
        }
    });
     });

  
    }
    //login route for shop keeper
    else if(url==="shopKeeperlogin"){
        var shopKeeperLoginUserId=req.body.phoneNumber;
        var shopKeeperLoginPassword=req.body.password;
        
    //convert number & password to string
    shopKeeperLoginUserId=shopKeeperLoginUserId.toString();
    shopKeeperLoginPassword=shopKeeperLoginPassword.toString();

    //Verification for login of Shop Keeper by using bcrypt hash function
    Data.findOne({username:shopKeeperLoginUserId,category:req.body.shopKeeperCategory},function(err,doc){
        if(!doc){
            console.log("here");
            res.render("shopKeeperlogin");
        }
        else{
             bcrypt.compare(shopKeeperLoginPassword,doc.password,function(err,result){
                  if(result===true){
                      res.render("productList");
                  }
                  else{
                      res.render("shopKeeperlogin");
                  }
             });
        };
    });

}

//Login route for customer

else{
    var customerLoginUserId=req.body.phoneNumber;
    var customerLoginPassword=req.body.password;
    
//convert number & password to string
customerLoginUserId=customerLoginUserId.toString();
customerLoginPassword=customerLoginPassword.toString();

//Verification for login of Shop Keeper
Data.findOne({username:customerLoginUserId,category:req.body.customerCategory},function(err,doc){
    if(!doc){
        res.render("customerlogin");
    }
    else{
        //now creates the hash password by using bcrypt hashing algorithm
        bcrypt.compare(customerLoginPassword,doc.password,function(err,result){
            if(result===true){
                res.send("<h1>Success!</h1>");
            }
            else{
                res.render("customerlogin");
            }
        });
    };
});
}

});
//now on the port on 3000
app.listen("3000",function(req,res){
    console.log("app is up & running");
});
