const express = require('express')
const app = express()

const { google } = require('googleapis');
const AuthSaveName = './google_key.json'
const AuthSave = require(AuthSaveName);
const CLIENT_ID = AuthSave.client.id;
const CLIENT_SECRET = AuthSave.client.secret;
const REDIRECT_URL = AuthSave.client.redirect
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
let authed = false;

const fs = require('fs');

const { runBot } = require('./services/botService')

async function getUserInfo(){
    const googleuser = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const res = await googleuser.userinfo.get({});
    return res.data
}

/* ======== [ REDIRECIONA PARA O LOGIN OU INICIA O BOT ] =================================================================================*/


app.get('/', (req, res) => {
    
    if (!authed) 
    {
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/youtube.force-ssl',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ]
        });
        
        res.send(`<a href='${url}'><button>login</button></a>`)
    } 
    else 
    {
        
        getUserInfo().then(response => {
            res.send(response.email + " <a href='/auth/google/logout'><button>logout</button></a>")   
        })
        
     
    } 
    
})

/* ======== [ LOGOUT ] =================================================================================*/

app.get('/auth/google/logout', (req, res) => {
    if(authed)
	{
        const AuthSave = require('./google_key.json')
        const access_token = AuthSave.credentials.access_token
        let oAuth2Client = new  google.auth.OAuth2();
        oAuth2Client.setCredentials({access_token: access_token})

        oAuth2Client.revokeCredentials((err, body) => {
            if(err){
                console.log(err.message)
            }
            
            authed = false;
            runBot(false)

            res.redirect('/');

		});
	}
})

/* ======== [ CALLBACK LOGIN ] =================================================================================*/

app.get('/auth/google/callback', (req, res) => {
    const code = req.query.code
    if (code) {

        oAuth2Client.getToken(code, (err, tokens) => {
            if (err) {
                console.log('[ BOT ] Error authenticating')
                console.log(err);
            } else {
            	console.log('[ BOT ] Successfully authenticated');
                oAuth2Client.setCredentials(tokens);

                authed = true;

                AuthSave.credentials = tokens

                fs.writeFile(AuthSaveName, JSON.stringify(AuthSave, null, 4), (err) => {
                	if (err) { 
						return console.log(err) 
					}

					console.log("[ BOT ] Tokens salvos em: " + AuthSaveName)
                });

                runBot(true)
        
                res.redirect('/')
        	}
        });
    }
});

/* ======== [ SERVER ] =================================================================================*/

const port = 3000
app.listen(port, () => {
	console.log(`🟢 Server running! Access in http://localhost:${port}`)
})