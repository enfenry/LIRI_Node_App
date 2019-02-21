require("dotenv").config();

// import keys from 'keys.js';
// const keys = require('keys.js');
// const {keys} = require('keys.js');

var axios = require('axios');
var fs = require("fs");
var Spotify = require('node-spotify-api');

let omdbAPIKey = '12902f82';

// var spotify = new Spotify(keys.spotify);

doAThing(process.argv);


function doAThing(nodeArgs) {
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
            let queryURL = "https://rest.bandsintown.com/artists/" + objectName + "?app_id=codingbootcamp";
            axios.get(queryUrl).then(
                function (response) {


                    // * Name of the venue

                    // * Venue location
               
                    // * Date of the Event (use moment to format this as "MM/DD/YYYY")
                }
            );

            break;
        case 'spotify-this-song':
            console.log(objectName);
            break;
        case 'movie-this':
            let queryUrl = 'http://www.omdbapi.com/?t=' + objectName + '&y=&plot=short&apikey=' + omdbAPIKey;

            axios.get(queryUrl).then(
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
                    doAThing(dataArr);
                }
            });
            break;
    }
}