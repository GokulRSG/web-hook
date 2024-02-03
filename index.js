const express = require('express')
var bodyParser = require('body-parser')
require('dotenv').config()
const axios = require('axios');


const app = express().use(bodyParser.json())

const urltoken = process.env.URLTOKEN;
const mytoken = process.env.MYTOKEN;


app.listen(3000 || process.env.PORT, ()=>{
    //res.send('Hello World');
    console.log("Application Listening")
});

// console.log("API token = "+token);
// https://2bb7-103-28-246-120.ngrok-free.app/webhook

app.get('/webhook', function (req, res) {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];
    console.log("API token = "+token);
    console.log("API mode = "+mode);
    
    if(mode && token)
    {
        if(mode === "subscribe" && token === mytoken){
            res.status(200).send(challange);
        }else{
            res.send(403);
        }
    }
})


// Endpoint to handle incoming messages from Facebook Messenger
app.post('/webhook', (req, res) => {
    const body = req.body;

    console.log("Get method working")
    if (body.object === 'page') {
      body.entry.forEach(entry => {
        const webhookEvent = entry.messaging[0];
        console.log(webhookEvent);

        let phone_no_id = entry.challange[0].value.metadata.phone_number_id;
        let from = entry.challange[0].value.messages[0].from;
        let msgBody = entry.challange[0].value.messages[0].text.body;

        // Process the webhookEvent here (e.g., send response messages)
            axios({
                method : "POST",
                url : `https://graph.facebook.com/v18.0/${phone_no_id}/messages?access_token=${urltoken}`,
                data:{
                    messaging_product: "whatsapp",
                    to : from,
                    text :{
                        body : "Hi.. I'm ZeroValue"
                    }
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });
      });
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  });





app.get('/', (req, res)=>{
    res.status(200).send("WebHook Stated....");
});






// app.post('/webhook', (req, res)=>{
//     let bodyParam = req.body;

//     console.log(JSON.stringify(bodyParam,null,2));

//     if(bodyParam.object){
//        if(bodyParam.entry &&
//         bodyParam.entry[0].challange &&
//         bodyParam.entry[0].challange[0].value.messages && 
//         bodyParam.entry[0].challange[0].value.messages[0]){
//             let phone_no_id = body.entry[0].challange[0].value.metadata.phone_number_id;
//             let from = body.entry[0].challange[0].value.messages[0].from;
//             let msgBody = body.entry[0].challange[0].value.messages[0].text.body;


//             axios({
//                 method : "POST",
//                 url : `https://graph.facebook.com/v18.0/${phone_no_id}/messages?access_token=${urltoken}`,
//                 data:{
//                     messaging_product: "whatsapp",
//                     to : from,
//                     text :{
//                         body : "Hi.. I'm ZeroValue"
//                     }
//                 },
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             });
//             res.send(200);
//         } else{
//             res.send(404);
//         }
//     }
// });