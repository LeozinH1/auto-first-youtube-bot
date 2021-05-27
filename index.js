
const { google } = require('googleapis');
const express = require('express')
const AuthSaveName = './google_key.json'
const AuthSave = require(AuthSaveName);
const BotData = require('./bot_config.json');
const app = express()
const CLIENT_ID = AuthSave.client.id;
const CLIENT_SECRET = AuthSave.client.secret;
const REDIRECT_URL = AuthSave.client.redirect
const REFRESH = BotData.refreshTime;
const CHANNEL_ID = BotData.channelId;
const TEXT_COMMENT = BotData.textComment;
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;
const fs = require('fs');


/* ======== [ BOT ] =================================================================================*/

const { getLastVideoId } = require('./services/getLastVideoIdService');
const { commentVideo } = require('./services/commentVideoService')

function startBot() {

	let lastVideo = "";

	setInterval(() => { 

		getLastVideoId(CHANNEL_ID).then(response => {
		
			console.log(`[${response.author}] Getting id of latest video...`);

			if(lastVideo == "")
			{
				console.log(`[${response.author}] Saving id of latest video...`);
				lastVideo = response.videoID;
			}
			else if(lastVideo !== response.videoID)
			{
				console.log(`[${response.author}] Commenting video...`);
				commentVideo(response.videoID, TEXT_COMMENT);
				lastVideo = response.videoID;
				console.log(`[${response.author}] Comment sended!`);
			}
			else if(lastVideo == response.videoID)
			{
				console.log(`[${response.author}] No new videos found or the comment already been sended!`);
			}
			
		})
	}, REFRESH);
	
}

/* ======== [ REDIRECIONA PARA O LOGIN OU INICIA O BOT ] =================================================================================*/

app.get('/', (req, res) => {

    if (!authed) 
    {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/youtube.force-ssl'
        });
        console.log(url)
        res.redirect(url)
    } 
    else 
    {
      startBot() 
      res.send("Logged! <a href='/auth/google/logout'>logout</a>")         
    } 

})

/* ======== [ LOGOUT ] =================================================================================*/

app.get('/auth/google/logout', function (req, res) {
	if(authed)
	{
		oAuth2Client.revokeCredentials(function(err, body) {
			console.log(body);
			authed = false;
		});
	}

	res.redirect('/');

})

/* ======== [ CALLBACK LOGIN ] =================================================================================*/

app.get('/auth/google/callback', function (req, res) {
    const code = req.query.code
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
            	console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);

                authed = true;

                AuthSave.credentials = tokens

                fs.writeFile(AuthSaveName, JSON.stringify(AuthSave, null, 4), function writeJSON(err) {
                	if (err) { 
						return console.log(err) 
					}

					console.log("Tokens salvos em: " + AuthSaveName)
                });
            
                res.redirect('/')
        	}
        });
    }
});

/* ======== [ SERVER ] =================================================================================*/

const port = 3000
app.listen(port, () => {
	console.log(`Server running at ${port}`)
	console.log(`Access dashboard in http://localhost:${port}/`)
})