require("dotenv").config();

var keys = require('./keys');

var axios = require('axios');
var moment = require('moment');
var fs = require("fs");
var Spotify = require('node-spotify-api');

let omdbAPIKey = '12902f82';
let spotify = new Spotify(keys.spotify);

let commandArgs = process.argv.slice(2);

LIRI(commandArgs);

function addToLog(text) {
    fs.appendFile("log.txt",'\n' + text, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function addLogArray(array) {
    array.forEach(function(element) {
        console.log(element);
        addToLog(element);
    })
}

async function LIRI(args) {
    let logArray = [];
    let inputString = args.join(' ');;
    logArray.push(inputString);
    logArray.push('');

    let objectName = '';
    for (let i = 1; i < args.length; i++) {

        if (i > 1 && i < args.length) {
            objectName = objectName + "+" + args[i];
        }
        else {
            objectName += args[i];
        }
    }

    switch (args[0]) {
        case 'concert-this':
            let bandsURL = "https://rest.bandsintown.com/artists/" + objectName + "/events?app_id=codingbootcamp";
            await axios.get(bandsURL).then(
                function (response) {
                    for (let i = 0; i < response.data.length; i++) {
                        logArray.push(response.data[i].venue.name);
                        if (response.data[i].venue.region === "") {
                            var venueLocation = response.data[i].venue.city + ', ' + response.data[i].venue.country;
                        }
                        else {
                            var venueLocation = response.data[i].venue.city + ', ' + response.data[i].venue.region + ', ' + response.data[i].venue.country;
                        }

                        let dateTime = response.data[i].datetime;
                        let format = "YYYY-MM-DD";
                        let convertedDate = moment(dateTime, format);

                        logArray.push(venueLocation);
                        logArray.push(convertedDate.format("MM/DD/YYYY"));
                        logArray.push('');
                    }
                }
            );
            addLogArray(logArray);
            break;
        case 'spotify-this-song':
            if (objectName === "") {
                objectName = 'Take+On+Me';
            }

            spotify.search({ type: 'track', query: objectName }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                let result = data.tracks.items[0];
                let numArtists = result.album.artists.length;
                let artists = result.album.artists[0].name

                if (numArtists !== 1) {
                    for (let i = 1; i < numArtists; i++) {
                        artists += ',' + result.album.artists[i].name;
                    }
                }

                logArray.push('Song: ' + result.name);
                logArray.push('Artist: ' + artists);
                logArray.push('Album: ' + result.album.name);
                logArray.push('Preview: ' + result.preview_url);
                logArray.push('');
                addLogArray(logArray);
            });

            break;
        case 'movie-this':
            if (objectName === "") {
                objectName = 'Mr.+Nobody';
            }
            let movieURL = 'http://www.omdbapi.com/?t=' + objectName + '&y=&plot=short&apikey=' + omdbAPIKey;

            await axios.get(movieURL).then(
                function (response) {
                    logArray.push(response.data.Title + ' (' + response.data.Year + ')')
                    logArray.push('IMDB: ' + response.data.imdbRating);

                    let ratings = response.data.Ratings;
                    loop:
                    for (let i = 0; i < ratings.length; i++) {
                        if (ratings[i].Source === "Rotten Tomatoes") {
                            logArray.push(ratings[i].Source + ': ' + ratings[i].Value);
                            break loop;
                        }
                    }
                    logArray.push('Country: ' + response.data.Country)
                    logArray.push('Language: ' + response.data.Language);
                    logArray.push('Synopsis: ' + response.data.Plot);
                    logArray.push('Starring: ' + response.data.Actors);
                    logArray.push('');
                }
            );
            addLogArray(logArray);
            break;
        case 'do-what-it-says':
            fs.readFile('random.txt', 'utf8', function (error, data) {
                if (error) {
                    console.log(error)
                }
                else {
                    let dataArr = data.split(',');
                    LIRI(dataArr);
                }
            });
            break;
    }
}