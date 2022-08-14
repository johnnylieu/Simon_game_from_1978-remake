var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];

var nextSequence = () => {
    randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
}

$(".btn").on('click', function(e){
    $(`#${e.target.id}`).fadeOut(100).fadeIn(100);
})