$(function() {
    'use strict';

    var currentUser = 'anonymous';
    var firebaseUrl = 'https://backbone-demonstration.firebaseio.com/scores';
    var Score = Backbone.Model.extend({
        defaults: {
            score: 0,
            username: 'anonymous'
        }
    });

    // firebase collection of top scores
    var Scores = Backbone.Firebase.Collection.extend({
        model: Score,
        url: firebaseUrl
    });

    var scores = new Scores();

    var NavigatorView = Backbone.View.extend({
        events: {
            'click #wrongUser' : 'reset',
            'click #home' : 'navigate',
            'click #play' : 'navigate',
            'click #account' : 'navigate',
            'click #score' : 'navigate'
        },
        initialize: function() {
            $('header').html(this.el);
            this.render();
        },
        render: function() {
            this.$el.html(_.template($('#nav-template').html()));
        },
        reset: function() {
            localStorage.removeItem('clickerCurrentUser');
            currentUser = 'anonymous';
            $('#account').show();
            $('#userInfo').hide();
            window.location.reload();
        },
        navigate: function(option) {
            router.navigate('#/' + option.currentTarget.id);
        }
    });

    var HomeView = Backbone.View.extend({
        initialize: function() {
            $('main').html(this.el);
            this.render();
        },
        render: function() {
            this.$el.html(_.template($('#home-template').html()));
        }
    });

    var LoginView = Backbone.View.extend({
        events: {
            'submit #login' : 'setUser',
            'keyup #username' : 'check'
        },
        initialize: function() {
            $('main').html(this.el);
            this.render();
        },
        render: function() {
            this.$el.html(_.template($('#login-template').html()));
        },
        setUser: function() {
            currentUser = $('#username').val();
            $('#userInfo').show().html('Hi ' + currentUser + '! <p id=\'wrongUser\'>(Not you?)</p>').addClass('inline-block');
            $('#account').hide();
            $('#changeAccount').show();
            localStorage.setItem('clickerCurrentUser', currentUser);
            router.navigate('#/play');
            return false;
        },
        check: function() {
            $('#btnLogin').attr('disabled', $('#username').val().length == 0);
        }
    });

    var GameView = Backbone.View.extend({
        initialize: function() {
            $('main').html(this.el);
            this.render();
        },
        render: function() {
            this.$el.html(_.template($('#game-template').html()));
            var stage = new createjs.Stage("game-canvas");
            var canvas = document.getElementById('game-canvas');
            var balls = [
                {color: "Red", size: 50, points: 1, duration: 5000, penalty: 3, velocity: 2},
                {color: "Purple", size: 40, points: 2, duration: 4000, penalty: 2, velocity: 3},
                {color: "Green", size: 30, points: 5, duration: 3000, penalty: 3, velocity: 4},
                {color: "Blue", size: 20, points: 10, duration: 2000, penalty: 0, velocity: 5}
            ];
            stage.set({height: 500, width: 800});
            var gameState;

            var newGameState = function() {
                return {
                    balls: [],
                    score: 0,
                    lives: 10,
                    lastTimestamp: performance.now(),
                    lastBall: performance.now(),
                    changeDifficulty: performance.now(),
                    difficulty: 0.5
                }
            };

            var newBall = function() {
                var random = Math.round(Math.random() * 13);
                var ball = balls[0];
                if (random >= 8 && random <= 10)
                    ball = balls[1];
                else if (random == 11 || random == 12)
                    ball = balls[2];
                else if (random == 13)
                    ball = balls[3];
                gameState.balls.push({
                    id: gameState.balls.length + Math.random() * 100,
                    left: Math.random() * (stage.width - ball.size * 2) + ball.size,
                    top: Math.random() * (stage.height - ball.size * 2) + ball.size,
                    size: ball.size,
                    color: ball.color,
                    points: ball.points,
                    duration: ball.duration,
                    penalty: ball.penalty,
                    velocity: ball.velocity,
                    vectorX: Math.random() * 3 + 1,
                    vectorY: Math.random() * 3 + 1
                });
            };

            var step = function() {
                gameState.balls.forEach(function(ball) {
                    ball.left += ball.vectorX * ball.velocity;
                    ball.top += ball.vectorY * ball.velocity;

                    if (ball.left + ball.size >= stage.width || ball.left - ball.size * 2 <= 0) {
                        if (ball.left - ball.size * 2 <= 0)
                            ball.left = ball.size * 2 + 1;
                        ball.vectorX = -ball.vectorX;
                    }
                    if (ball.top - ball.size * 2 <= 0 || ball.top + ball.size >= stage.height) {
                        if (ball.top - ball.size * 2 <= 0)
                            ball.top = ball.size * 2 + 1;
                        ball.vectorY = -ball.vectorY;
                    }
                });
            };

            var renderGame = function() {
                stage.removeAllChildren();
                stage.addChild(new createjs.Shape()).graphics.f("DeepSkyBlue").drawRoundRect(0, 0, stage.width, stage.height, 30);
                stage.addChild(new createjs.Text("Score: " + gameState.score, "20px 'Berlin Sans FB', Times", "#000")
                    .set({x: 20, y: 20}));
                stage.addChild(new createjs.Text("Lives: " + gameState.lives, "20px 'Berlin Sans FB', Times", "#000")
                    .set({x: 20, y: 40}));
                if (currentUser != 'anonymous')
                    stage.addChild(new createjs.Text("User: " + currentUser, "20px 'Berlin Sans FB', Times", "#000").set({x: 20, y: 60}));
                gameState.balls.forEach(function(ball) {
                    if (ball.duration > 0) {
                        stage.addChild(new createjs.Shape()).graphics.f(ball.color).drawCircle(ball.left - ball.size, ball.top - ball.size, ball.size);
                        ball.duration -= 16;
                    } else {
                        gameState.balls.splice(gameState.balls.indexOf(ball), 1);
                        gameState.lives -= ball.penalty;
                    }
                });
            };

            var animate = function() {
                renderGame();
                step();
                if (performance.now() - gameState.lastBall > gameState.difficulty * 3000) {
                    newBall();
                    gameState.lastBall = performance.now();
                }

                if (performance.now() - gameState.changeDifficulty > 10000 && gameState.difficulty > 0.025) {
                    gameState.difficulty -= 0.025;
                    gameState.changeDifficulty = performance.now();
                }

                if (gameState.lives <= 0) {
                    stage.removeAllChildren();
                    stage.addChild(new createjs.Shape()).graphics.f("DeepSkyBlue").drawRoundRect(0, 0, stage.width, stage.height, 50);
                    stage.addChild(new createjs.Text("Game Over!", "50px 'Berlin Sans FB', Times", "#000")
                        .set({x: stage.width / 2 - 125, y: stage.height / 2 - 50}));
                    stage.addChild(new createjs.Text("Score: " + gameState.score, "30px 'Berlin Sans FB', Times", "#000")
                        .set({x: stage.width / 2 - 50, y: stage.height / 2 - 90}));
                    stage.addChild(new createjs.Text("Click anywhere to play again!", "20px 'Berlin Sans FB', Times", "#000")
                        .set({x: stage.width / 2 - 125, y: stage.height / 2 + 50}));
                    if (gameState.score > 0) {
                        console.log(scores);
                        scores.add({
                            score: gameState.score,
                            username: currentUser
                        });
                        console.log(scores)
                    }
                    createjs.Ticker.removeEventListener('tick', animate);
                    canvas.removeEventListener('click', checkClick);
                    canvas.addEventListener('click', startGame);
                }
                stage.update();
            };

            var startGame = function() {
                if (gameState != null)
                    canvas.removeEventListener('click', startGame);
                gameState = newGameState();
                newBall();
                createjs.Ticker.setFPS(60);
                createjs.Ticker.addEventListener('tick', animate);
                canvas.addEventListener('click', checkClick);
            };

            var checkClick = function(e) {
                gameState.balls.forEach(function(ball) {
                    if (Math.abs(ball.left - (e.clientX - canvas.offsetLeft)) < ball.size * 2 &&
                        Math.abs(ball.top - (e.clientY - canvas.offsetTop)) < ball.size * 2) {
                        gameState.score += ball.points;
                        gameState.balls.splice(gameState.balls.indexOf(ball), 1);
                    }
                });
            };
            startGame();
        }
    });

    var ScoresView = Backbone.View.extend({
        className: 'scoresTable',
        initialize: function() {
            $('main').html(this.el);
            this.render();
        },
        render: function() {
            this.$el.html(_.template($('#scores-template').html()));
            scores.fetch({
                success: function() {
                    var rank = 1;
                    var sorted = [];
                    scores.forEach(function(score) {
                        sorted.push({username : score.get('username'), score : score.get('score')});
                    });
                    sorted.splice(Math.min(sorted.length, 99));
                    sorted.sort(function(a, b) {
                        return b.score - a.score;
                    }).forEach(function(score) {
                        $('<tr/>', {
                            class: 'scores',
                            html: '<td>' + rank + '</td><td>' + score.username + '</td><td class="scoreLabel">' + score.score
                        }).appendTo('#scores');
                        rank++;
                    })
                }
            });
        }
    });

    var Router = Backbone.Router.extend({
        routes: {
            '': 'login',
            'account': 'login',
            'home': 'home',
            'play': 'play',
            'score' : 'score',
            '*path' : 'default'
        },
        home: function() {
            this.loadView(new HomeView());
        },
        play: function() {
            this.loadView(new GameView());
        },
        login: function() {
            if (currentUser == 'anonymous')
                this.loadView(new LoginView());
            else
                this.loadView(new GameView());
        },
        score: function() {
            this.loadView(new ScoresView());
        },
        default: function() {
            this.loadView(new HomeView());
        },
        loadView: function(view) {
            this.view && this.view.remove();
            this.view = view;
        }
    });

    var nav = new NavigatorView();
    var router = new Router();
    Backbone.history.start();

    if (localStorage.getItem('clickerCurrentUser')) {
        currentUser = localStorage.getItem('clickerCurrentUser');
        $('#userInfo').show().html('Hi ' + currentUser + '! <p id=\'wrongUser\'>(Not you?)</p>')
            .addClass('inline-block');
        $('#account').hide();
        $('#changeAccount').show();
    }
});