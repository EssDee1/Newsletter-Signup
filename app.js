const { json } = require('express')
const express = require('express')
const https = require('https')

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(express.static('publc'))

app.get('/', function(req, res){
    res.sendFile(__dirname  + "/signup.html")
})

app.post('/', function(req, res){
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var email = req.body.email

    var data = {
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }

            } 
        ]
    }

    var jsonData = JSON.stringify(data)
    
    const url = "https://us17.api.mailchimp.com/3.0/lists/8e8bc2dc01"
    const options = {
        method : "POST",
        auth : "Shivansh1:b7d75d21cb78e693c322862e162592a0-us17"

    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })

        if (response.statusCode === 200){
            res.sendFile(__dirname + '/success.html')
        } else{
            res.sendFile(__dirname + '/failure.html')
        }

    })

    request.write(jsonData)
    request.end()
})

app.post('/failure', function(req, res){
    res.redirect('/')
})

app.listen(process.env.PORT || 3000, function(){
    console.log('Server Setup at Port 3000')
})
