var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var gameStarted = false;

$("#scoreName").hide();

function listenForKey() {
    $(document).on("keydown", function (e) {
        var tag = (e.target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        if (e.key === " " || e.code === "Space" || e.keyCode === 32) {
            e.preventDefault(); // stops the page from scrolling
            if (!gameStarted) startGame();
        }
    });
}

function startGame() {
    $("#scoreName").hide();
    gamePattern = [];
    userClickedPattern = [];
    level = 0;
    gameStarted = true;
    nextSequence();
}

function animatePress(currentColor) {
    $("#" + currentColor)
        .addClass("pressed")
        .delay(100)
        .queue(function (next) {
            $(this).removeClass("pressed");
            next();
        });
}

function playSound(name) {
    var audio = new Audio("public/sounds/" + name + ".mp3");
    audio.play().catch(function () {});
    $("#" + name)
        .fadeOut(100)
        .fadeIn(100);
}

function nextSequence() {
    userClickedPattern = [];
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
    gamePattern.forEach(function (color, index) {
        setTimeout(
            function () {
                playSound(color);
                animatePress(color);
            },
            500 * (index + 1),
        );
    });
    level++;
    $("#level-title").text("Level " + level);
}

function checkAnswer(currentIndex) {
    if (userClickedPattern[currentIndex] === gamePattern[currentIndex]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(nextSequence, 1000);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    var reached = level;
    $("#level-title").text("Game Over, You Reached Level " + reached);
    var audio = new Audio("public/sounds/wrong.mp3");
    audio.play().catch(function () {});
    $("body").addClass("game-over");
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 200);
    gameStarted = false;
    gamePattern = [];
    userClickedPattern = [];
    if (reached > 0) promptForName(reached);
    level = 0;
}

function promptForName(reached) {
    $("#final-score").text(reached);
    $("#scoreName").show();
    $("#nameInput").val("").focus();
}

function renderScores(scores) {
    var list = $("#high-scores");
    list.empty();
    if (!scores || scores.length === 0) {
        list.append("<li>No scores yet — be the first!</li>");
        return;
    }
    scores.forEach(function (s, i) {
        var topClass = i === 0 ? ' class="top-score"' : "";
        list.append(
            "<li" +
                topClass +
                "><span>" +
                (i + 1) +
                ". " +
                escapeHtml(s.name) +
                "</span><span>" +
                s.score +
                "</span></li>",
        );
    });
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        }[c];
    });
}

$(".btn").on("click", function () {
    if (!gameStarted) return;
    var userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
});

$("#scoreForm").on("submit", function (e) {
    e.preventDefault();
    var name = $("#nameInput").val().trim() || "Anonymous";
    var score = parseInt($("#final-score").text(), 10) || 0;
    window.SimonScores.add(name, score);
    $("#scoreName").hide();
    $("#level-title").text("Press Space Bar Key to Start");
});

$("#level-title").on("click", function () {
    if (!gameStarted) startGame();
});
listenForKey();
