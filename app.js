const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bcrypt=require("bcrypt");
const saltRounds=10;
const dotenv =require("dotenv");
const Recruiter=require("./models/recruiterModel");
const User=require("./models/userModel");
const Jobpost=require("./models/jobpostModel");
const nodemailer=require("nodemailer");
dotenv.config();




mongoose.set('strictQuery', true);
const app=express();
app.use(express.json());

app.use(express.static('public'));

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(bodyParser.json());

                  
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
        })
        .then(()=>console.log("DB COnnection Successful"))
        .catch((err) => console.log(err));


app.get("/",function(req,res){
res.render("home");
})

app.get("/user_register",function(req,res){
  res.render("user_register");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/admin_login",function(req,res){
  res.render("admin_login");
});

app.get("/recruiter_register",function(req,res){
  res.render("recruiter_register");
});


//LOGIN FOR RECRUITER AND JOBSEEKER.

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({username:username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(password,foundUser.password, function(err,result){
          if(result === true){
          res.redirect("/apply1");
        }else{
          res.redirect("/failure");
        }
      });
      }
      else if(!foundUser){
        Recruiter.findOne({username:username},function(err, foundRecruiter){
          if(err){
            console.log(err);
          }else{
            if(foundRecruiter){
              bcrypt.compare(password,foundRecruiter.password,function(err,result){
                if(result === true){
                  res.redirect("/info1");
                }
                else{
                  res.redirect("/failure");
                }
              })
            }
          }
        })
      }
    }
  })
});


//LOGIN FOR ADMIN

app.post("/admin_login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  if(username===process.env.ADMIN_USERNAME&&password===process.env.ADMIN_PASSWORD){
      res.redirect("/admin");
    }else{
      res.redirect("/failure2")
    }
});


//SAVING JOBSEEKER INFORMATION IN DATABASE

app.post("/user_register",function(req,res){

bcrypt.hash(req.body.password,saltRounds,function(err,hash){
  const newUser=new User({
    name:req.body.name,
    username:req.body.username,
    phoneNo:req.body.phonenumber,
    password:hash,
    dob:req.body.birthday,
    skills:req.body.skills,
    select:req.body.select,
    source:req.body.filename
  });
  newUser.save(function(err){
    if(err){
      console.log(err);

    } else {

      res.redirect("/success");
    }
  });
});
});


//SAVING RECRUITER INFORMATION IN DATABASE

app.post("/recruiter_register",function(req,res){

bcrypt.hash(req.body.psw,saltRounds,function(err,hash){
  const newRecruiter=new Recruiter({
    company:req.body.company,
    username:req.body.email,
    phoneno:req.body.phone,
    password:hash,
    state:req.body.state,
    city:req.body.city,
    zip:req.body.zip
  });
  newRecruiter.save(function(err){
    if(err){
      console.log(err);

    } else {

      res.redirect("/success");
    }
  });
})
});




// RECRUITER FUNCTIONS


app.get("/info1",function(req,res){

  res.render("info1");
});





let items=[];
let items1=[];
let items2=[];
let items3=[];
let items4=[];


app.post("/info",function(req,res){
  let item=req.body.newcompanyItem;
  let item1=req.body.newpostItem;
  let item2=req.body.newqualificationItem;
  let item3=req.body.newskillItem;
  let item4=req.body.newcityItem;


  const newJobpost=new Jobpost({
    company:item,
    post:item1,
    qualification:item2,
    skill:item3,
    city:item4,
  });
  newJobpost.save(function(err){
    if(err){
      console.log(err);
    } else {
      if(item&&item1&&item2&&item3&&item4){
      items.push(item);
      items1.push(item1);
      items2.push(item2);
      items3.push(item3);
      items4.push(item4);
    }
    res.redirect("/info");

    }
  });
});

app.get("/info",function (req,res){

  Jobpost.find({})
  .then((x)=>{
    res.render('info',{x})

  })

});


app.get("/apply2",function(req,res){
  User.find({})
  .then((x)=>{
    res.render('apply2',{x})

  })

});




//JOBSEEKER FUNCTIONS

app.get("/apply",function(req,res){
  Jobpost.find({})
  .then((x)=>{
    res.render('apply',{x})

  })

});



app.get("/apply_a",function(req,res){
  Jobpost.find({})
  .then((x)=>{
    res.render('apply_a',{x})

  })

});



app.get("/apply_b",function(req,res){
  Jobpost.find({})
  .then((x)=>{
    res.render('apply_b',{x})

  })

});

app.get("/apply1",function(req,res){

  res.render("apply1");
});

app.get("/applied",function(req,res){

  res.render("applied");
});




//HOME PAGE

app.get("/home",function(req,res){

  res.render("home");
});





//ADMIN FUNCTIONS

app.get("/admin1",function(req,res){

  res.render("admin1");
});




app.get("/admin",function(req,res){
  Jobpost.find({})
  .then((x)=>{
    res.render('admin',{x})
    console.log(x);
  })

});

app.post("/delete",function(req,res){
  const itemId=req.body.checkbox;
  Jobpost.findByIdAndRemove(itemId, function(err){
    if(!err){
      res.redirect("/admin");
    }
  })
})

app.get("/admin2",function(req,res){
  Recruiter.find({})
  .then((x)=>{
    res.render('admin2',{x})

  })

});

app.post("/delete2",function(req,res){
  const itemId=req.body.checkbox;
  Recruiter.findByIdAndRemove(itemId, function(err){
    if(!err){
      res.redirect("/admin2");
    }
  })
})

app.get("/admin3",function(req,res){
  User.find({})
  .then((x)=>{
    res.render('admin3',{x})

  })

});



app.post("/delete3",function(req,res){
  const itemId=req.body.checkbox;
  User.findByIdAndRemove(itemId, function(err){
    if(!err){
      res.redirect("/admin3");
    }
  })
})


//SUCCESS AND FAILURE PAGES.

app.get("/success",function(req,res){
  res.render("success");
});
app.get("/failure",function(req,res){
  res.render("failure");
});


app.get("/failure2",function(req,res){
  res.render("failure2");
});



app.listen(3300,function(){
  console.log("Server started successfully");
})
