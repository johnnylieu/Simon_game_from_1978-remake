var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var gameStarted = false;

var listenForKey = () => {
    $(document).keydown(function() {
        if (gameStarted == false) {
            nextSequence();
            gameStarted = true;
        }
        })
    // else $(document).click(function() {
    //     if (gameStarted == false) {
    //         nextSequence();
    //         gameStarted = true;
    //     }
    // });
    }

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
    //this below replays all the colors in game pattern array @ 500ms intervals
    var interval = 1;
    gamePattern.forEach(function(el) {
        var run = setTimeout(function() {
            playSound(el);
            animatePress(el);
            clearTimeout(run);
        }, 500 * interval);
        interval++;
    });
    //this above replays all the colors in game pattern array @ 500ms intervals
    level++;
    $(`#level-title`).text(`Level ${level}`);
}

var checkAnswer = (currentLevel) => {
    if (userClickedPattern[userClickedPattern.length] === gamePattern[gamePattern.length]){
            if (userClickedPattern.join() == gamePattern.join()) {
                setTimeout(function() {
                    nextSequence();
                    userClickedPattern = [];
                }, 1000);
            } else for (i=0; i<userClickedPattern.length; i++) {
                if (userClickedPattern[i] != gamePattern[i]) {
                    $(`#level-title`).text(`Game Over, You Reached Level ${level} - Press Any Key to Restart`);
                    gameStarted = false;
                    var audio = new Audio(`./sounds/wrong.mp3`);
                    audio.play();
                    $('body').addClass('game-over');
                    setTimeout(function() {
                        $('body').removeClass('game-over');
                    }, 200, userClickedPattern = [], listenForKey());
                }
        }; console.log(`game: ${gamePattern}\nuser: ${userClickedPattern}`);
    }
}

$(".btn").on('click', function(e){
    var userChosenColor = e.target.id;
    playSound(userChosenColor);
    userClickedPattern.push(userChosenColor);
    checkAnswer(userChosenColor);
})

listenForKey();