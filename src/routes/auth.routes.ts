import { Router } from 'express';

import BotService from '../services/botService';

const authRouter = Router();

const localStorage = require('localStorage');

const { google } = require('googleapis');
const AuthSave = require('../config/google_key.json');

const CLIENT_ID = AuthSave.client.id;
const CLIENT_SECRET = AuthSave.client.secret;
const REDIRECT_URL = AuthSave.client.redirect;
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
);

const bot = new BotService();

/* ======== [ LOGOUT ] ========================================================================== */

authRouter.get('/logout', (req, res) => {
    const accessToken = localStorage.getItem('access_token');
    oAuth2Client.setCredentials({ access_token : accessToken });
    oAuth2Client.revokeCredentials((err, body) => {
        if (err) {
            console.log(err.message);
        }

        bot.execute(false);

        localStorage.clear();

        res.redirect('/');
    });
});

/* ======== [ CALLBACK LOGIN ] ================================================================== */

authRouter.get('/callback', (req, res) => {
    const { code } = req.query;
    if (code) {
        oAuth2Client.getToken(code, (err, tokens) => {
            if (err) {
                console.log('[ BOT ] Error authenticating');
                console.log(err);
            } else {
                console.log('[ BOT ] Successfully authenticated');
                oAuth2Client.setCredentials(tokens);

                localStorage.setItem('access_token', tokens.access_token);

                bot.execute(true);

                res.redirect('/');
            }
        });
    }
});

authRouter.get('/login', (req, res) => {
    if (!localStorage.getItem('access_token')) {
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/youtube.force-ssl',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ],
        });

        res.redirect(url);
    } else {
        res.redirect('/');
    }
});

export default authRouter;
