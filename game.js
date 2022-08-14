var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var gameStarted = false;

$(document).keydown(function() {
    if (gameStarted === false) {
        nextSequence();
        gameStarted = true;
        console.log(gamePattern);
    }
})

var animatePress = (currentColor) => {
    $(`#${currentColor}`).addClass('pressed');
    setTimeout(function() {
        $(`#${currentColor}`).removeClass('pressed')
    }, 100);
}

var playSound = (name) => {
    var audio = new Audio(`./sounds/${name}.mp3`)
    audio.play();
    $(`#${name}`).fadeOut(100).fadeIn(100);
    animatePress(name);
}

var nextSequence = () => {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    playSound(randomChosenColor);
    gamePattern.push(randomChosenColor);
    level++;
}

$(".btn").on('click', function(e){
    var userChosenColor = e.target.id;
    playSound(userChosenColor);
    userClickedPattern.push(userChosenColor);
})