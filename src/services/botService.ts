import GetLatestVideoIdService from './getLastVideoIdService';
import CommentVideoService from './commentVideoService';

const BotData = require('../config/bot_config.json');

const CHANNEL_ID = BotData.channelId;
const TEXT_COMMENT = BotData.textComment;
const REFRESH = BotData.refreshTime;

let lastVideo = '';
let loop: NodeJS.Timer;

class BotService {
    public async execute(stat: boolean): Promise<void> {
        if (stat) {
            console.log('🟢 Bot is running now!');
            loop = setInterval(() => {
                const getLatestVideoId = new GetLatestVideoIdService();

                getLatestVideoId.execute(CHANNEL_ID).then(response => {
                    console.log(
                        `[ ${response.author} ] Getting id of latest video...`,
                    );
                    if (lastVideo == '') {
                        console.log(
                            `[ ${response.author} ] Saving id of latest video...`,
                        );
                        lastVideo = response.videoID;
                    } else if (lastVideo !== response.videoID) {
                        console.log(
                            `[ ${response.author} ] Commenting video...`,
                        );

                        const commentVideo = new CommentVideoService();
                        commentVideo.execute({
                            videoID: response.videoID,
                            text: TEXT_COMMENT,
                        });

                        lastVideo = response.videoID;
                        console.log(`[ ${response.author} ] Comment sended!`);
                    } else if (lastVideo == response.videoID) {
                        console.log(
                            `[ ${response.author} ] No new videos found or the comment already been sended!`,
                        );
                    }
                });
            }, REFRESH);
        } else {
            console.log('🔴 Bot stopped!');
            clearInterval(loop);
        }
    }
}

export default BotService;
