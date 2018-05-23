require("dotenv").config();

var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var keys = require("./keys.js"); ///////

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
          console.log(tweets);
            for (var i = 0; i < tweets.length; i++) { //"\n" line break
                fs.appendFile("log.txt",
                    i+1 + " " + JSON.stringify(tweets[i].text,null,4) + "\n" + 
                    "-------" + "\n" + "\n", 
                    
                    function (err) {
                    if (err) {
                        console.log(err);
                    }
                });   
            }
            console.log("Content Added!");
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
        var musicString="";
            //make a string to store all formatted results 
            musicString += 
                "\n" +
                "Artists: " + data.tracks.items[0].album.artists[0].name + "\n"+"---------"+"\n"+
                "Musinc Name: " + data.tracks.items[0].name+"\n"+"---------"+"\n"
                if (data.tracks.items[0].preview_url) {
                    musicString +=  "Preview URL: " + data.tracks.items[0].preview_url+"\n"+"---------"+"\n"
                }
                else {
                    musicString += "Sorry There is no preview available"+"\n"+"---------"+"\n"
                }

                if (data.tracks.items[0].album.name) {
                    musicString += "Album Name: " + data.tracks.items[0].album.name + "\n" + "\n"
                }
                else {
                    musicString += "Sorry There is no album name available" + "\n" + "\n"
                }
        // log results to log.txt
        fs.appendFile("log.txt", musicString, function (err) {
            if (err) {
                console.log(err);
            }
        });
        console.log("Content Added!");
    });
};



//get OMDB movie
function getMovie(search = "Mr. Nobody") {
    request('http://www.omdbapi.com/?t='+search+'&apikey=9a1ad367&limit=5', function (error, response, body) {
     // Print the error if one occurred
        if (response && response.statusCode==200) {
            // Print the response status code if a response was received
            var movieString = "";
            movieString +=  
                "Movie Title: " + JSON.parse(body).Title + "\n" + 
                "---------" + "\n" + 
                "Year: " + JSON.parse(body).Year + "\n" + 
                "---------" + "\n" + 
                "imdbRating: " + JSON.parse(body).imdbRating + "\n" + 
                "---------" + "\n" +
                "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n" + 
                "---------" + "\n" + 
                "Country Produced: " + JSON.parse(body).Country + "\n" + 
                "---------" + "\n" + 
                "Language: " + JSON.parse(body).Language + "\n" + 
                "---------" + "\n" + 
                "Plot: " + JSON.parse(body).Plot + "\n" + 
                "---------" + "\n" + 
                "Actors: " + JSON.parse(body).Actors + "\n" + "\n"

            fs.appendFile("log.txt", movieString, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            console.log("Content Added!");
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
        else if (data.split(",") == "do-what-it-says") {
            console.log("that's a bad idea, try movie-this, my tweets, or spotify-this-song");
        }
        else {
            fromRandom = data.split(",");
            source = fromRandom[0];
            search = fromRandom[1];
            checkInput();
            console.log (fromRandom);
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