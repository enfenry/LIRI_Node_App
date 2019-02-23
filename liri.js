require("dotenv").config();

var keys = require('./keys');

var axios = require('axios');
var moment = require('moment');
var fs = require("fs");
var Spotify = require('node-spotify-api');

let omdbAPIKey = '12902f82';

var spotify = new Spotify(keys.spotify);

LIRI(process.argv);

function LIRI(nodeArgs) {
    let objectName = '';
    for (let i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            objectName = objectName + "+" + nodeArgs[i];
        }
        else {
            objectName += nodeArgs[i];
        }
    }

    switch (nodeArgs[2]) {
        case 'concert-this':
            let bandsURL = "https://rest.bandsintown.com/artists/" + objectName + "/events?app_id=codingbootcamp";
            axios.get(bandsURL).then(
                function (response) {
                    for (let i = 0; i < response.data.length; i++) {
                        console.log(response.data[i].venue.name);
                        if (response.data[i].venue.region === "") {
                            var venueLocation = response.data[i].venue.city + ', ' + response.data[i].venue.country;
                        }
                        else {
                            var venueLocation = response.data[i].venue.city + ', ' + response.data[i].venue.region + ', ' + response.data[i].venue.country;
                        }

                        console.log(venueLocation);

                        let dateTime = response.data[i].datetime;
                        let format = "YYYY-MM-DD";
                        let convertedDate = moment(dateTime, format);
                        console.log(convertedDate.format("MM/DD/YYYY"));

                        console.log('');
                    }
                }
            );
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
                console.log('Song: ' + result.name);
                console.log('Artist: ' + artists);
                console.log('Album: ' + result.album.name);
                console.log('Preview: ' + result.preview_url);
            });

            break;
        case 'movie-this':
            if (objectName === "") {
                objectName = 'Mr.+Nobody';
            }
            let movieURL = 'http://www.omdbapi.com/?t=' + objectName + '&y=&plot=short&apikey=' + omdbAPIKey;

            axios.get(movieURL).then(
                function (response) {
                    console.log(response.data.Title + ' (' + response.data.Year + ')')
                    console.log('IMDB: ' + response.data.imdbRating);
                    let ratings = response.data.Ratings;
                    loop:
                    for (let i = 0; i < ratings.length; i++) {
                        if (ratings[i].Source === "Rotten Tomatoes") {
                            console.log(ratings[i].Source + ': ' + ratings[i].Value);
                            break loop;
                        }
                    }
                    console.log('Country: ' + response.data.Country)
                    console.log('Language: ' + response.data.Language);
                    console.log('Synopsis: ' + response.data.Plot);
                    console.log('Starring: ' + response.data.Actors);
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
                    dataArr.unshift(null, null)
                    LIRI(dataArr);
                }
            });
            break;
    }
}