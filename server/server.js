const express = require('express');
const {google} = require('googleapis');
const cors = require('cors');
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


app.get('/getApplicationPlaylistId', async (req, res) => {
    let applicationPlaylistId = "";
    let access_token = req.query.token;

    try {
        const result = await axios({
            mathod: "POST",
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
});


app.get('/itemsFromPlaylistId', async (req, res) => {
    let applicationPlaylistId = req.query.playlistid;
    let access_token = req.query.token;
    try {
        const result2 = await axios({
            mathod: "POST",
            headers: {
                authorization: "Bearer " + access_token
            },
            "Content-Type": "application/json",
            url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&playlistId=${applicationPlaylistId}&key=${API_KEY}`,

        });

        let playlistItems = [];
        //console.log(result2.data.items);
        for(result of result2.data.items) {
            let item = {
                position: result.snippet.position,
                title: result.snippet.title,
                thumbnails: result.snippet.thumbnails,
                resourceId: result.snippet.resourceId
            }
            playlistItems.push(item);
        }
        res.send(JSON.stringify(playlistItems));
        //res.send("<script>window.close();</script>");
        
    } catch (error) {
        console.log("error fetching application playlist from id....");
        console.log(error);
    }
    return;
});


app.listen(port, () => {
    console.log(`server now listening on port ${port}`);
})