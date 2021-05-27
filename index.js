const axios = require('axios');
const axios_api = axios.create({});
const { google } = require('googleapis');
const express = require('express')
const AuthSaveName = './google_key.json'
const AuthSave = require(AuthSaveName);
const BotData = require('./bot_config.json');
const { json } = require('express');
const app = express()
const CLIENT_ID = AuthSave.client.id;
const CLIENT_SECRET = AuthSave.client.secret;
const REDIRECT_URL = AuthSave.client.redirect
const REFRESH = BotData.refreshTime;
const CHANNEL_ID = BotData.channelId;
const TEXT_COMMENT = BotData.textComment;
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;
const youtube = google.youtube({ version: 'v3', auth: oAuth2Client })
const fs = require('fs');

/* ======== [ FUNÇÃO PARA COMENTAR UM VIDEO ] =================================================================================*/

function comment(video_id, text){
	youtube.commentThreads.insert({
		part: 'snippet',
		resource: {
			kind: "youtube#commentThread",
			snippet: {
				videoId: video_id,
				topLevelComment: {
					snippet: {
						textOriginal: text
					}
				}
			}
		}
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		var result = response.data;

		console.log(JSON.stringify({
			channelName: result.snippet.topLevelComment.snippet.authorDisplayName, 
			comment: result.snippet.topLevelComment.snippet.textDisplay, 
			createdAt: result.snippet.topLevelComment.snippet.publishedAt
		}));

	});
}

/* ======== [ BOT ] =================================================================================*/

async function startBot() {
	let lastVideo = "";

	setInterval(() => { 


		axios_api.get(`https://www.youtube.com/oembed?url=www.youtube.com/playlist?list=${CHANNEL_ID}&format=json`).then(response => {

			console.log(`[${response.data.author_name}] Getting id of latest video...`);

			var myarr = response.data.thumbnail_url.split("/");

			if(!lastVideo)
			{
				console.log(`[${response.data.author_name}] Saving id of latest video...`);
				lastVideo = myarr[4];
			}
			else if(lastVideo !== myarr[4])
			{
				console.log(`[${response.data.author_name}] Commenting video...`);
				comment(myarr[4], TEXT_COMMENT);
				lastVideo = myarr[4];
				console.log(`[${response.data.author_name}] Comment sended!`);
			}
			else if(lastVideo == myarr[4])
			{
				console.log(`[${response.data.author_name}] No new videos found or the comment already been sended!`);
			}

		});
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