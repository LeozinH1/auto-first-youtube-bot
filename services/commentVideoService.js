
//------ access the api using the existing access token --------------------
const { google } = require('googleapis')
const AuthSave = require('./../google_key.json')
const access_token = AuthSave.credentials.access_token
let oAuth2Client = new  google.auth.OAuth2();
oAuth2Client.setCredentials({access_token: access_token})
//--------------------------------------------------------------------------

const youtube = google.youtube({ version: 'v3', auth: oAuth2Client })

module.exports.commentVideo = function comment(video_id, text){
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
	}, (err, response) => {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}

		var data = response.data;

		const result = {
			channelName: data.snippet.topLevelComment.snippet.authorDisplayName, 
			comment: data.snippet.topLevelComment.snippet.textDisplay, 
			createdAt: data.snippet.topLevelComment.snippet.publishedAt
		}

		console.log(result)

        return result;

	});
}