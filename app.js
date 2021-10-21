const express = require('express'); //módulo express
const https = require('https'); //módulo protocolo https (substitui o antigo 'request')
const bodyParser = require ("body-parser"); // módulo body-parser

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data ={
        members: [ //array
            {
                email_address:email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://{TRÊS ÚLTIMOS CARACTERES DA API}.api.mailchimp.com/3.0/lists/{SEU ID MAILCHIMP}";

    const options ={
        method:"POST",
        auth:"something:{SUA API}" //modelo de autenticação segundo a documentação
    }

    const request = https.request(url, options, function(response){
        
        if (response.statusCode = 200){
            res.sendFile(__dirname + "/success.html")
        } else{
            res.sendFile(__dirname + "/failure.html")
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res){
    res.redirect("/")
})




app.listen(process.env.PORT || 3000, function(){
    console.log("o servidor está funcionando na porta 3000.");
    })
