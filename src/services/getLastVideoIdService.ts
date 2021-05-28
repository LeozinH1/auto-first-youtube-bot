const axios = require('axios');

const axios_api = axios.create({});

interface Response {
    videoID: string;
    author: string;
}

class getLatestVideoIdService {
    public async execute(channelId: string): Promise<Response> {
        const response = await axios_api.get(
            `https://www.youtube.com/oembed?url=www.youtube.com/playlist?list=${channelId}&format=json`,
        );
        const videoID = response.data.thumbnail_url.split('/')[4];
        const author = response.data.author_name;
        return { videoID, author };
    }
}

export default getLatestVideoIdService;
