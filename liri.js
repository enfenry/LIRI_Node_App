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

function addLogObject(object) {
    console.log(JSON.stringify(object,null,4));
    fs.appendFile("log.txt",'\n' + JSON.stringify(object,null,4), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function LIRI(args) {
    let inputString = args.join(' ');;
    let logObject = {
        Input: inputString,
        Output: {}
    }

    let thisArg = '';
    for (let i = 1; i < args.length; i++) {

        if (i > 1 && i < args.length) {
            thisArg = thisArg + "+" + args[i];
        }
        else {
            thisArg += args[i];
        }
    }

    switch (args[0]) {
        case 'concert-this':
            let bandsURL = "https://rest.bandsintown.com/artists/" + thisArg + "/events?app_id=codingbootcamp";
            axios.get(bandsURL).then(
                function (response) {
                    logObject.Output.Venues = [];
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i].venue.region === "") {
                            var venueLocation = response.data[i].venue.city + ', ' + response.data[i].venue.country;
                        }
                        else {
                            var venueLocation = response.data[i].venue.city + ', ' + response.data[i].venue.region + ', ' + response.data[i].venue.country;
                        }

                        let dateTime = response.data[i].datetime;
                        let format = "YYYY-MM-DD";
                        let convertedDate = moment(dateTime, format);

                        logObject.Output.Venues[i] = {
                            VenueName: response.data[i].venue.name,
                            Location: venueLocation,
                            Date: convertedDate.format("MM/DD/YYYY")
                        }
                    }
                    addLogObject(logObject);
                }
            );
            break;
        case 'spotify-this-song':
            if (thisArg === "") {
                thisArg = 'Take+On+Me';
            }

            spotify.search({ type: 'track', query: thisArg }, function (err, data) {
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

                logObject.Output.Song = result.name;
                logObject.Output.Artist = artists;
                logObject.Output.Album = result.album.name;
                logObject.Output.Preview = result.preview_url;
                addLogObject(logObject);
            });
            break;
        case 'movie-this':
            if (thisArg === "") {
                thisArg = 'Mr.+Nobody';
            }
            let movieURL = 'http://www.omdbapi.com/?t=' + thisArg + '&y=&plot=short&apikey=' + omdbAPIKey;

            axios.get(movieURL).then(
                function (response) {
                    logObject.Output.Title = response.data.Title;
                    logObject.Output.Year = response.data.Year ;
                    logObject.Output.IMDB = response.data.imdbRating

                    let ratings = response.data.Ratings;
                    loop:
                    for (let i = 0; i < ratings.length; i++) {
                        if (ratings[i].Source === "Rotten Tomatoes") {
                            logObject.Output.RottenTomatoes = ratings[i].Value;
                            break loop;
                        }
                    }

                    logObject.Output.Country = response.data.Country;
                    logObject.Output.Language = response.data.Language;
                    logObject.Output.Synopsis = response.data.Plot;
                    logObject.Output.Stars = response.data.Actors;

                    addLogObject(logObject);
                }
            );
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