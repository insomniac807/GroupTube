const express = require('express');
const {google} = require('googleapis');
const cors = require('cors');
const urlParse = require('url-parse');
const queryParse = require('query-string');
const bodyParser = require('body-parser');
const axios = require('axios');
const API_KEY = "AIzaSyCt36A-hZEEPv5pkAzUGnfmdYm-5-jVuH8";
const PLAYLIST_TITLE = "TCDJ";
const path = require('path');

const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client/public')));




app.get('/myYouTubeInfo', async (req, res) => {
    let applicationPlaylistId = "";
    let access_token = req.query.token;

    try {
        const result = await axios({
            method: "POST",
            headers: {
                authorization: "Bearer " + access_token
            },
            "Content-Type": "application/json",
            url: `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=${API_KEY}`,

        })
        //console.log(result.data.items);
        for(item of result.data.items) {
            if(item.snippet.title === PLAYLIST_TITLE) {
                applicationPlaylistId = item.id;
               res.send(JSON.stringify(applicationPlaylistId));
            }
        }
    } catch(error) {
        console.log("error fetching application playlist from user playlists....");
        console.log(error);
    }
})










// app.get('/getAuthUrl', (req,res) => {
//     const oauth2Client = new google.auth.OAuth2(
//         //client id
//         "243744873836-qdmj3f8uu3pm9k92qk6k2e7srsfpaknc.apps.googleusercontent.com",
//         //client secret
//         "kakjPJICJNAS9RYesb0U5Hpp",
//         //redirects
//         "http://localhost:5000"
//     );

//     const scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"];

//     const url = oauth2Client.generateAuthUrl({
//         access_type: "offline",
//         scope: scopes,
//         state: JSON.stringify({
//             callbackUrl: req.body.callbackUrl,
//             userID: req.body.userid
//         })
//     });

//     res.header("Access-Control-Allow-Origin", "http://localhost:5000");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.type('application/json');

//     res.send(JSON.stringify(url));
// });


// app.get('/', async (req, res) => {
//     const queryUrl = new urlParse(req.url);
//     const code = queryParse.parse(queryUrl.query).code;
//     let applicationPlaylistId = "";
//     const oauth2Client = new google.auth.OAuth2(
//         //client id
//         "243744873836-qdmj3f8uu3pm9k92qk6k2e7srsfpaknc.apps.googleusercontent.com",
//         //client secret
//         "kakjPJICJNAS9RYesb0U5Hpp",
//         //redirects
//         "http://localhost:5000/steps"
//     );
//     const tokens = await oauth2Client.getToken(code);
//     console.log(tokens.tokens.access_token);
//     res.send(tokens.tokens.access_token);
//     console.log(tokens);
//     res.send("hello...");

//     try {
//         const result = await axios({
//             mathod: "POST",
//             headers: {
//                 authorization: "Bearer " + tokens.tokens.access_token
//             },
//             "Content-Type": "application/json",
//             url: `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=${API_KEY}`,

//         })
//         //console.log(result.data.items);
//         for(item of result.data.items) {
//             if(item.snippet.title === PLAYLIST_TITLE) {
//                 applicationPlaylistId = item.id;
//                // console.log("ITEM ID: ", item.id);
//             }
//         }
//     } catch(error) {
//         console.log("error fetching application playlist from user playlists....");
//         console.log(error);
//     }

//     try {
//         const result2 = await axios({
//             mathod: "POST",
//             headers: {
//                 authorization: "Bearer " + tokens.tokens.access_token
//             },
//             "Content-Type": "application/json",
//             url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&playlistId=${applicationPlaylistId}&key=${API_KEY}`,

//         });

//         let playlistItems = [];
//         //console.log(result2.data.items);
//         for(result of result2.data.items) {
//             let item = {
//                 position: result.snippet.position,
//                 title: result.snippet.title,
//                 thumbnails: result.snippet.thumbnails,
//                 resourceId: result.snippet.resourceId
//             }
//             playlistItems.push(item);
//         }
//         //res.send(JSON.stringify(playlistItems));
//         res.send("<script>window.close();</script>");
        
//     } catch (error) {
//         console.log("error fetching application playlist from id....");
//         console.log(error);
//     }
// })



const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({server:server});

// wss.on('connection', function connection(ws){
//     console.log("new ws client connected!...");
//     ws.send("welcome new client");

//     ws.on('message', function incoming(message) {
//         console.log(`recieved ${message}`)
//         ws.send(`got your message its ${message}`);
//     });
// });



server.listen(port, () => {
    console.log(`server now listening on port ${port}`);
})