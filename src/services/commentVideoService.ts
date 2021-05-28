// ------ access the api using the existing access token --------------------
const { google } = require('googleapis');
const localStorage = require('localStorage');

const accessToken = localStorage.getItem('access_token');
const oAuth2Client = new google.auth.OAuth2();
oAuth2Client.setCredentials({ access_token : accessToken });
//--------------------------------------------------------------------------
const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });

interface Request {
    videoID: string;
    text: string;
}

interface Response {
    channelName: string;
    comment: string;
    createdAt: string;
}

class commentVideoService {
    public async execute({ videoID, text }: Request): Promise<Response> {
        const response = youtube.commentThreads.insert({
            part: 'snippet',
            resource: {
                kind: 'youtube#commentThread',
                snippet: {
                    videoId: videoID,
                    topLevelComment: {
                        snippet: {
                            textOriginal: text,
                        },
                    },
                },
            },
        });

        const { data } = response;

        const result = {
            channelName: data.snippet.topLevelComment.snippet.authorDisplayName,
            comment: data.snippet.topLevelComment.snippet.textDisplay,
            createdAt: data.snippet.topLevelComment.snippet.publishedAt,
        };

        console.log(`[ BOT ] ${JSON.stringify(result)}`);

        return result;
    }
}

export default commentVideoService;
