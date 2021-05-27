const axios = require('axios');
const axios_api = axios.create({});

module.exports.getLastVideoId = async function getLastVideoId(channel_id) { 
    const response = await axios_api.get(`https://www.youtube.com/oembed?url=www.youtube.com/playlist?list=${channel_id}&format=json`)
	const videoID = response.data.thumbnail_url.split("/")[4]
	const author = response.data.author_name

	return { videoID, author }
}