var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

var nextSequence = () => {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    playSound(randomChosenColor);
    gamePattern.push(randomChosenColor);
}

var playSound = (name) => {
    var audio = new Audio(`./sounds/${name}.mp3`)
    audio.play();
    $(`#${name}`).fadeOut(100).fadeIn(100);
}

$(".btn").on('click', function(e){
    var userChosenColor = e.target.id;
    playSound(userChosenColor);
    userClickedPattern.push(userChosenColor);
})