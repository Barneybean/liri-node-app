require("dotenv").config();

var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
// console.log(keys.twitter.consumer_key);

var source = process.argv[2];
var input = process.argv;
var search=[];
var fromRandom="";

for (var i=3; i<input.length; i++) {
    // search += input[i];  add letter to the empty string
    search.push(input[i]);
}; // add loop
search = search.join(" ");

console.log(search);
function getTweets(){
         
      var params = {screen_name: 'williamgao07'};
      client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
        //   console.log(tweets);
            for (var i = 0; i < tweets.length; i++) {
                console.log(i+1 + " " + JSON.stringify(tweets[i].text,null,4));
                console.log("-------")
            }
        }
      });
};

// using default function search "the sign" if no name is provided !!! LIT AF by V 
function getSpotify(musicName = "The Sign by Ace of Base") {
    spotify.search({ type: 'track', query: musicName}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        //  console.log(JSON.stringify(data.tracks.items[0],null,4));
      console.log("Artists: " + data.tracks.items[0].album.artists[0].name ); 
      console.log("---------");
      console.log("Musinc Name: " + data.tracks.items[0].name); 
      console.log("---------");
      if (data.tracks.items[0].preview_url) {
          console.log("Preview URL: " + data.tracks.items[0].preview_url);
          console.log("---------");
      }
      else {
        console.log("Sorry There is no preview available");
        console.log("---------");
      };

      if (data.tracks.items[0].album.name) {
        console.log("Album Name: " + data.tracks.items[0].album.name); 
        console.log("---------");
      }
      else {
        console.log("Sorry There is no album name available");
        console.log("---------");
      };
      });
};

//get OMDB movie
function getMovie(search = "Mr. Nobody") {
    console.log(search);
    request('http://www.omdbapi.com/?t='+search+'&apikey=9a1ad367&limit=5', function (error, response, body) {
     // Print the error if one occurred
        if (response && response.statusCode==200) {
            // Print the response status code if a response was received
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("---------");
            console.log("Year: " + JSON.parse(body).Year);
            console.log("---------");
            console.log("imdbRating: " + JSON.parse(body).imdbRating);
            console.log("---------");
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("---------");
            console.log("Country Produced: " + JSON.parse(body).Country);
            console.log("---------");
            console.log("Language: " + JSON.parse(body).Language);
            console.log("---------");
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("---------");
            console.log("Actors: " + JSON.parse(body).Actors);
        }
        else {
            console.log('error:', error);
        }
    });
};

//read file content and assign to search
function readFile() {
    fs.readFile("random.txt", "utf-8", function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            fromRandom = data.split(",");
            source = fromRandom[0];
            search = fromRandom[1];
            checkInput();
            console.log (source);
        }
    })
};

function checkInput() {
    //get tweets
    if (source === "my-tweets" || source === "my-tweets,") {
        getTweets();
    }

    // get spotify 
    if (source === "spotify-this-song"|| source === "spotify-this-song,") {
        if (search) {
            getSpotify(search);
        }
        else {
            getSpotify();
        }
        
    }

    //get movie
    if (source === "movie-this"||source === "movie-this,") {
        if (search) {
            getMovie(search);
        }
        else {
            getMovie();
        }
    }

    if (source === "do-what-it-says") {
        readFile();
    };
};

checkInput();