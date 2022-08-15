var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var gameStarted = false;

$(document).keydown(function() {
    if (gameStarted == false) {
        nextSequence();
        console.log('1');
        gameStarted = true;
    }
})

var animatePress = (currentColor) => {
    $(`#${currentColor}`).addClass('pressed').delay(100).removeClass('pressed');
}

var playSound = (name) => {
    var audio = new Audio(`./sounds/${name}.mp3`)
    audio.play();
    $(`#${name}`).fadeOut(100).fadeIn(100);
}

var nextSequence = () => {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
    playSound(randomChosenColor);
    animatePress(randomChosenColor);
    level++;
    $(`#level-title`).text(`Level ${level}`);
}

var checkAnswer = (currentLevel) => {
    console.log(`user: ${userClickedPattern}\ngame: ${gamePattern}`);
    if (userClickedPattern.join() == gamePattern.join()) {
        setTimeout(function() {
            nextSequence();
            userClickedPattern = [];
        }, 500);
    }
}

$(".btn").on('click', function(e){
    var userChosenColor = e.target.id;
    playSound(userChosenColor);
    userClickedPattern.push(userChosenColor);
    checkAnswer(userChosenColor);
})