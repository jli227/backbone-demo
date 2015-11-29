# Clicker
Clicker utilizes CreateJS and Backbone.js in order to provide a simple clicking game experience. 

## What is it?

Clicker is a single-page application that permits a user to specify a desired username, if desired, for the scoreboard that will be implemented in later updates, and play a simple canvas-designed game. The user must click on the different colored circles to gain points, and survive for as long as possible. Initially, the player will have 10 lives, and upon losing all his/her lives, the game uploads the score (associated with the username if specified) to Firebase. The smaller the circle, the faster it'll be and it'll be worth more points too! The top 100 scores can be viewed by going to the "Top Scores" page.

## What are the technologies used?

Backbone.js is a JavaScript framework known for its lightweight nature. It's essentially MVC (optional controller) for the client and enables modular development. Event-binding can occur with the individual views associated and managed through a router for convenient navigation through a single-page application. It enables developers to avoid storing data in the DOM; rather, the data should be stored in models. Additionally, in conjunction with the Underscore.js utility library, Backbone.js permits easy template-view swapping. Backbone.js can also work well with Firebase, in order to maintain automatically synchronized data for three-way data binding. 

CreateJS is a collection of modular libraries that work together in order to create and manage interactive content via HTML5. These libraries are capable of working independently or collaboratively. This application specifically uses EaselJS, which focuses on interactions with the canvas element in order to build a rich and interactive experience. This enables users to easily construct simple canvas games.

## What limitations/weaknesses/drawbacks does this technology have?

Backbone.js has numerous online communities and forums where users participate on a daily basis in order to assist newcomers and/or veterans in optimizing their implementation with Backbone.js. The latest commit on the GitHub repo was one day ago; there are 22 open issues and 2152 closed issues. Backbone.js is a web framework best used for single-page applications with numerous view-states that are navigated through via hash-routes. It differs from traditional MVC frameworks in that the view class acts as its own controller. Functions and event-handling are defined within each respective view.

EaselJS is capable of drawing the fundamental components (i.e. shapes) and handling animation as well. On the GitHub repo, the latest commit was two days ago; there are 72 open issues and 472 closed issues. In order to handle animation, the developer must utilize the built-in Ticker. Additionally, in order to upload images or incorporate sounds, the developer must add in the PreloadJS and SoundJS. 

## How to play the game

All a user has to do in order to play the game is navigate to the URL ([Play here!](http://students.washington.edu/jli227/info343/backbone-demo/)) or download the files onto their local machine. There is no required additional download of tools or frameworks. However, in order for the scores to be successfully uploaded to Firebase, the player must have an active Internet connection.

The user also has the option of swapping out the predefined designated Firebase URL if he/she would like access to his/her own set of scores. Users can do so by registering for an account at Firebase's [registration page](https://www.firebase.com/signup/)

## Where to learn more?

CreateJS:
* [EaselJS](http://www.createjs.com/getting-started/easeljs)
* [CreateJS](http://www.createjs.com)

BackboneFire: 
* [BackboneFire](https://www.firebase.com/docs/web/libraries/backbone/quickstart.html)

Backbone.js:
* [Backbone.js](http://backbonejs.org/)