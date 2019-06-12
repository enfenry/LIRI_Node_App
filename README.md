# LIRI_Node_App
Language Interpretation and Recognition Interface (LIRI) is a command line node app that takes in parameters and gives you back data using various API calls.

### [Watch the Demo Video](https://streamable.com/gnr1p)
* (Video also available for download within the repository)

## Installing Locally
Git clone the repository to your local machine: 

HTTPS:
```
$ git clone https://github.com/enfenry/LIRI_Node_App.git
```
SSH:
````
$ git clone git@github.com:enfenry/LIRI_Node_App.git
````

Next, within the repository, install necessary dependencies by running:
````
$ npm install
````

You should now be able to use LIRI by runnning:
````
$ node liri.js PARAMETERS_HERE
````

## Using LIRI
Please see the demo video linked above or the following list of features/commands:
* Get information on upcoming concerts of a band/artist
````
E.g.: 
$ node liri.js concert-this The Black Keys
````
* Get information on a song
````
E.g.: 
$ node liri.js spotify-this-song Tighten Up
````
* Get information on a movie
````
E.g.: 
$ node liri.js movie-this Shaun of the Dead
````

* Read the command listed in the random.txt file
````
E.g.: 
$ node liri.js do-what-it-says
````

## Built With
   * [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)
   * [Axios](https://www.npmjs.com/package/axios)
   * [OMDB API](http://www.omdbapi.com)
   * [Bands In Town API](http://www.artists.bandsintown.com/bandsintown-api)
   * [Moment](https://www.npmjs.com/package/moment)
   * [DotEnv](https://www.npmjs.com/package/dotenv)
