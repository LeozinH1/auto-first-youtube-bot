# Auto First Youtube Bot

[**DEMO**](https://youtu.be/IRIcIMC1bMQ "DEMO")

This bot checks if a predefined YouTube channel has uploaded a new video, if a recent upload is detected, a comment is created on the uploaded video.

# Requirements

[Node.js](https://nodejs.org/ "Node.js") installed on the computer

# Usage

1. Get your credentials (**client id** and **client secret key**) from the [Google API](https://console.developers.google.com "Google API") website
2. Put this information in the file **src/config/google_key.json**
3. Setup bot_config.json (Read before **How to get the Channel ID**)
4. Open folder with cmd and run `npm i`, after this, run `npm start`
5. Access http://localhost:3000 and login
6. After login, the bot will start to work!

# How to get the Channel ID
1. Access the channel you want to comment on
2. Click on **Videos** section and after that **Play All**
3. Copy the id (in url) that is in **&list=**
4. **Example**: https://www.youtube.com/watch?v=IRIcIMC1bMQ&list=UUrfluf17A1AsyOEZWpFzK2w&index=2. The ID is **UUrfluf17A1AsyOEZWpFzK2w**
