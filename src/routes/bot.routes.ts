import { Router } from 'express';

const botRouter = Router();

const AuthSave = require('../config/google_key.json');

const CLIENT_ID = AuthSave.client.id;
const CLIENT_SECRET = AuthSave.client.secret;
const REDIRECT_URL = AuthSave.client.redirect;

const { google } = require('googleapis');

const localStorage = require('localStorage');

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
);

async function getUserInfo() {
    const googleuser = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const res = await googleuser.userinfo.get({});
    return res.data;
}

botRouter.get('/', (req, res) => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
        oAuth2Client.setCredentials({ access_token: accessToken });
        getUserInfo().then(response => {
            if (response) {
                res.send(
                    `${response.email} <a href='auth/google/logout'><button>logout</button></a>`,
                );
            } else {
                res.send(
                    "<a href='auth/google/login'><button>login</button></a>",
                );
            }
        });
    } else {
        res.send("<a href='auth/google/login'><button>login</button></a>");
    }
});

export default botRouter;
