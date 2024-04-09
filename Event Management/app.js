const express = require('express')
const app = express()
const bp = require("body-parser");
const path = require("path")
const mysql = require("mysql");
const ejs = require("ejs");
const bcrypt = require('bcrypt');
const models = require("./models")
const sequelize = require("sequelize")
const jwt = require("jsonwebtoken")
const secretkey = "cmod"
var cookieParser = require("cookie-parser");
const cors = require('cors')
const moment = require('moment');
let date = moment().format("YYYY-MM-DD");
let time = moment().format('HH:mm')


var Queue = require("better-queue");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public"))); // create a public folder(i.e-: static folder) where you want to save the files
app.use(cookieParser(secretkey));
app.use(cors())


var invQueue = new Queue(function (msg, cb) {
 //console.log(msg.msg)
 
  client.messages.create("domain.com", msg.msg)
    .then(async (res) => {
    console.log(res)
      cb()
    })
    .catch((err) => {
      console.log(err)
      console.log(msg.msg)
      cb()
    })
 
});

var table = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'practics'
})

table.connect(function(err) {
  if (err) throw err 
  console.log('You are now connected...')
});

const verifyuser = (req,res,next) => {
  const token = req.cookies.token
  if(!token){
    return(res.json({Message:"UnAuthorised User"}))
  }
  else{
    jwt.verify(token,secretkey,(err,decoded) => {
      if(err){
        return res.json({Message:"Authentication Error"})
      }
      else{
        console.log(decoded,"geygfyugrfvrbvrbvberv")
        req.name = decoded.name
        next()
      }
    })
  }
}

app.post("/register",async (req,res) => {
  let userdata = req.body
    await models.sequelize.query(`select * from Users where email = "${userdata.email}"`,{
        type: models.sequelize.QueryTypes.SELECT
    })
    .then(async function (user){
        // console.log(user)
        if(user.length > 0){
            res.send('found')
        }
        else{
            async function insertuser(hash){
                await models.sequelize.query(`Insert into Users (Name,email,password) values("${userdata.username}","${userdata.email}","${hash}")`,{
                    type: models.sequelize.QueryTypes.INSERT
                })
            }
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    if(hash){
                        insertuser(hash)
                    }
                })
            })
            res.send("success")
            
        }
    })
    
    // res.send("success")
})

app.post("/login",async(req,res) => {
    console.log(req.body)
    await models.sequelize.query(`select * from Users where email = "${req.body.email}"`,{
        type: models.sequelize.QueryTypes.SELECT
    })
    .then(async function(user){
        console.log(user)
        if (user && (await bcrypt.compare(req.body.password, user[0].password))) {
            // Create token
            const token = jwt.sign({id:user[0].id},secretkey,{expiresIn: '2hr'},(err,token) =>{
                if(err){
                  res.send("Error in Token Generation")
                }
                else{
                  res.cookie("token",token)
                  res.send({
                    token:token,
                    status:"success"
                  })
                }
            });      
          }
        else{
          res.send({
            status:"failure",
            message:"Incorrect Password"
          })
        }  
    })

     
})

app.get('/events',verifyuser,async (req,res) => {
  let id;
  const token = req.cookies.token
    jwt.verify(token,secretkey,async (err,decoded) => {
    id = decoded.id   
  })

  await models.sequelize.query(`select * from events where date >= "${date}" and time >= "${time}"`,{
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(data => {
    data.forEach(object => {
      object.loggedin = id;
    });
    res.send({
      status:"success",
      events:data,
    })
  })
  // res.send({
  //   status:"success",
  //   events:[{
  //     id:"1",
  //     user_id:"3",
  //     Name:"sunil",
  //     Location:"Mumai",
  //     Time:"11:30pm",
  //     Date:"2023-07-19",
  //     Description:"Singning"
  //   },
  //   {
  //     id:"2",
  //     user_id:"3",
  //     Name:"sunil",
  //     Location:"Mumai",
  //     Time:"11:30pm",
  //     Date:"2023-07-19",
  //     Description:"Singning"
  //   },
  //   {
  //     id:"3",
  //     user_id:"3",
  //     Name:"sunil",
  //     Location:"Mumai",
  //     Time:"11:30pm",
  //     Date:"2023-07-19",
  //     Description:"Singning"
  //   }
  // ]
  // })
})

app.post('/addevents',async (req,res) => {
  let details = req.body
  details.user_id 
  let id;
  const token = req.cookies.token
    jwt.verify(token,secretkey,async (err,decoded) => {
    id = decoded.id 
    details.user_id = id  
  })
  await models.sequelize.query(`Insert into events (user_id,eventname,location,date,time,description) values("${id}","${details.eventname}","${details.location}","${details.date}","${details.time}","${details.description}")`,{
    type: models.sequelize.QueryTypes.INSERT
  })
  res.send({
    status:"success",
    events:details,
    id:id
  })  
})

app.post('/edit',async(req,res) => {
  let eventdata = req.body.eventdata
  console.log(eventdata)
  let id = req.body.id
  await models.sequelize.query(`UPDATE events SET eventname="${eventdata.eventname}",location="${eventdata.location}",date="${eventdata.date}",time="${eventdata.time}",description="${eventdata.description}" WHERE id = '${id}'`,{
    type: models.sequelize.QueryTypes.UPDATE
  })
  res.send({
    status:"success",
    updatedevent:eventdata,
  })  
})

app.post('/delete',async(req,res) => {
  console.log(req.body,"iiiiii")
  await models.sequelize.query(`DELETE FROM events WHERE id = '${req.body.id}'`,{
    type: models.sequelize.QueryTypes.DELETE
  })
  res.send({
    status:"success",
    id:req.body.id,
  }) 
})

app.post('/captureresponse',async(req,res) => {
  let data = req.body
  console.log(req.body,"Civibibv")
          await models.sequelize.query(`Insert into EventInvitations (user_id,event_id,inviteuser) values("${data.user_id}","${data.event_id}","${data.email}")`,{
            type: models.sequelize.QueryTypes.INSERT
          })
          .then((data) => {
            let inviteid = data[0];
            let str = `<p>
                        <div>
                         <a href="http://localhost:3001/userresponse/${0}-${inviteid}">
                           <button class="GFG">
                               YES
                           </button>
                         </a>
                         <a href='http://localhost:3001/userresponse/${1}-${inviteid}'>
                           <button class="GFG">
                               no
                           </button>
                         </a>
                         </div>            
                       <p>` 
          
                       var msg = {
                        to: req.body.email,
                        bcc: "sunil.panigrahi@finlatics.com",
                        from:"Finlatics - Information Centre <mails@finlatics.live>",
                        "h:Reply-To": "care@finlatics.com",
                        subject: "Event Conformation",
                        html: str
                      };
                      invQueue.push({ msg })
                      res.send("success")
          })          
})

app.post('/yes/:id',(req,res) => {
  console.log(req.params.id)
  res.redirect("/login")
})

app.post('/no/:id',(req,res) => {
  console.log(req.params.id)
  res.send("success")
})

app.post('/feedback/:id',(req,res) => {
  console.log(req.params.id)
  res.send("success")
})

app.post('/userfeedback',async (req,res) => {
  console.log(req.body)
  await models.sequelize.query(`UPDATE EventInvitations SET ${req.body.response == 0 ? 'yes' : 'no' } = ${1},isread = ${1},feedback='${req.body.feedback}' WHERE id = '${req.body.eventid}'`,{
    type: models.sequelize.QueryTypes.UPDATE
  })
  .then((data) => {
    res.send('success')
  })  
})

app.get('/getnotification',async(req,res) => {
  await models.sequelize.query(`select * from EventInvitations where isread = ${1}`,{
    type: models.sequelize.QueryTypes.SELECT
  })
  .then((data) => {
    console.log(data)
    res.send(
      {
        status:'success',
        notification:data
      })
  })
})

app.post('/clearnotification',async(req,res) => {
  await models.sequelize.query(`UPDATE EventInvitations SET isread=${0} WHERE isread = ${1}`,{
    type: models.sequelize.QueryTypes.UPDATE
  })
  res.send("success")
})

app.post('/logout',async(req,res) => {
  res.clearCookie("token")
  res.send("success")
})

app.listen(3000)
