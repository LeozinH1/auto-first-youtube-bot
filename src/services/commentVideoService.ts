// ------ access the api using the existing access token --------------------
const { google } = require('googleapis');
const localStorage = require('localStorage');

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
        const oAuth2Client = new google.auth.OAuth2();
        const accessToken = localStorage.getItem('access_token');
        oAuth2Client.setCredentials({ access_token: accessToken });
        const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });

        const response = await youtube.commentThreads.insert({
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

        const resData = response.data;

        const result = {
            channelName:
                resData.snippet.topLevelComment.snippet.authorDisplayName,
            comment: resData.snippet.topLevelComment.snippet.textDisplay,
            createdAt: resData.snippet.topLevelComment.snippet.publishedAt,
        };

        console.log(
            `✅ Comment posted! You commented "${result.comment}" with the account "${result.channelName}" at ${result.createdAt}`,
        );

        return result;
    }
}

export default commentVideoService;
