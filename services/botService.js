const { getLastVideoId } = require('./getLastVideoIdService');
const { commentVideo } = require('./commentVideoService')

const BotData = require('./../bot_config.json');
const CHANNEL_ID = BotData.channelId;
const TEXT_COMMENT = BotData.textComment;
const REFRESH = BotData.refreshTime;

let lastVideo = "";
let loop = null;

module.exports.runBot = (status) => { 

    if(status){
        console.log("🟢 Bot is running now!")
        loop = setInterval(() => { 

            getLastVideoId(CHANNEL_ID).then(response => {
                
                console.log(`[ ${response.author} ] Getting id of latest video...`);
    
                if(lastVideo == "")
                {
                    console.log(`[ ${response.author} ] Saving id of latest video...`);
                    lastVideo = response.videoID;
                }
                else if(lastVideo !== response.videoID)
                {
                    console.log(`[ ${response.author} ] Commenting video...`);
                    commentVideo(response.videoID, TEXT_COMMENT);
                    lastVideo = response.videoID;
                    console.log(`[ ${response.author} ] Comment sended!`);
                }
                else if(lastVideo == response.videoID)
                {
                    console.log(`[ ${response.author} ] No new videos found or the comment already been sended!`);
                }
                
            })
    
        }, REFRESH);

    }else{
        console.log("🔴 Bot stopped!")
        clearInterval(loop)
    }
}