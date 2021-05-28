# Auto First Youtube Bot

This bot checks if a predefined YouTube channel has uploaded a new video, if a recent upload is detected, a comment is created on the uploaded video.

# Requirements

[Node.js](https://nodejs.org/ "Node.js") installed on the computer

# Usage

1. Get your **client id** and **client secret** key from the **Google API website**
2. Put this information in the file **google_key.json**
3. Setup bot_config.json (Read before **How to get the Channel ID**) 
4. Open folder with cmd and run **npm i**, after this, run **node index**
5. Access http://localhost:3000 and login
6. After login, the bot will start to work!

# How to get the Channel ID
1. Access the channel you want to comment on
2. Click on **Videos** section and after that **Play All**
3. Copy the id that is in **&list=**
4. **Example**: https://www.youtube.com/watch?v=IRIcIMC1bMQ&list=UUrfluf17A1AsyOEZWpFzK2w&index=2. The ID is **UUrfluf17A1AsyOEZWpFzK2w**
