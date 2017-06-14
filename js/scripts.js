//business logic

// [return int 1..6] simulate die roll
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}
function go() {
  clean();
  num = Math.ceil(Math.random()*6);
  console.log(num);
  switch(num) {
    case 1: {
      tbl.rows[1].cells[1].innerHTML = "<div class='circle'></div>";
      break;
    }
    case 2: {
      tbl.rows[2].cells[0].innerHTML = "<div class='circle'></div>";
      tbl.rows[0].cells[2].innerHTML = "<div class='circle'></div>";
      break;
    }
    case 3: {
      tbl.rows[2].cells[0].innerHTML = "<div class='circle'></div>";
      tbl.rows[1].cells[1].innerHTML = "<div class='circle'></div>";
      tbl.rows[0].cells[2].innerHTML = "<div class='circle'></div>";
      break;
    }
    case 4: {
      tbl.rows[0].cells[0].innerHTML = "<div class='circle'></div>";
      tbl.rows[0].cells[2].innerHTML = "<div class='circle'></div>";
      tbl.rows[2].cells[0].innerHTML = "<div class='circle'></div>";
      tbl.rows[2].cells[2].innerHTML = "<div class='circle'></div>";
      break;
    }
    case 5: {
      tbl.rows[0].cells[0].innerHTML = "<div class='circle'></div>";
      tbl.rows[0].cells[2].innerHTML = "<div class='circle'></div>";
      tbl.rows[1].cells[1].innerHTML = "<div class='circle'></div>";
      tbl.rows[2].cells[0].innerHTML = "<div class='circle'></div>";
      tbl.rows[2].cells[2].innerHTML = "<div class='circle'></div>";
      break;
    }
    case 6: {
      tbl.rows[0].cells[0].innerHTML = "<div class='circle'></div>";
      tbl.rows[0].cells[2].innerHTML = "<div class='circle'></div>";
      tbl.rows[1].cells[0].innerHTML = "<div class='circle'></div>";
      tbl.rows[1].cells[2].innerHTML = "<div class='circle'></div>";
      tbl.rows[2].cells[0].innerHTML = "<div class='circle'></div>";
      tbl.rows[2].cells[2].innerHTML = "<div class='circle'></div>";
      break;
    }
  }
}
function clean() {
  tbl.classList.toggle("twist");
  tbl.rows[0].cells[0].innerHTML = "<div class='circle hide'>";
  tbl.rows[0].cells[1].innerHTML = "<div class='circle hide'>";
  tbl.rows[0].cells[2].innerHTML = "<div class='circle hide'>";
  tbl.rows[1].cells[0].innerHTML = "<div class='circle hide'>";
  tbl.rows[1].cells[1].innerHTML = "<div class='circle hide'>";
  tbl.rows[1].cells[2].innerHTML = "<div class='circle hide'>";
  tbl.rows[2].cells[0].innerHTML = "<div class='circle hide'>";
  tbl.rows[2].cells[1].innerHTML = "<div class='circle hide'>";
  tbl.rows[2].cells[2].innerHTML = "<div class='circle hide'>";
  setTimeout(function() { tbl.classList.toggle("twist");},200);
}
// JavaScript classes introduced in ECMAScript 2015 are primarily syntactical sugar over JavaScript's existing prototype-based inheritance
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

// Turn class
class Turn {
    constructor() {
        this.canRoll = true;
        this.canHold = false;
        this.rolls = [];
        this.score = 0;
    }

    // [no return value] simulate roll, add roll to rolls array, calculate turn score and ability to roll/hold again
    roll() {
        if (!this.canRoll) {
            alert("unexpected Turn.roll!");
            return;
        }
        var roll = rollDie();
        this.rolls.push(roll);
        if (roll === 1) {
            this.canRoll = false;
            this.canHold = false;
            this.score = 0;
        } else {
            this.canRoll = true;
            this.canHold = true;
            this.score += roll;
        }
    }

    // [no return value] simulate hold, disable ability to roll/hold again
    hold() {
        if (!this.canHold) {
            alert("unexpected Turn.hold!");
            return;
        }
        this.canRoll = false;
        this.canHold = false;
    }

    // [return true/false] determine if turn is ended because of neither roll nor hold are available
    isEnded() {
        return !this.canRoll && !this.canHold;
    }
}

// Game class
class Game {
    constructor() {
        // player indexes can be 0 (1st), 1 (2nd), 2 (3rd), ...
        this.maxPlayers = 2;
        // create array of N zeroes
        this.scores = new Array(this.maxPlayers).fill(0);
        this.currentPlayer = 0;
        this.maxScore = 100;
        this.currentTurn = new Turn();
    }

    // [return true/false] determine if current turn score is enough to win - to enable "auto-hold"
    isCurrentTurnScoreEnough() {
        return this.scores[this.currentPlayer] + this.currentTurn.score >= this.maxScore;
    }

    // [no return value] add turn score to total player score and initialize new opponent turn
    completeTurn() {
        if (!this.currentTurn.isEnded() && !this.isCurrentTurnScoreEnough()) {
            alert("unexpected Game.completeTurn!");
            return;
        }

        this.scores[this.currentPlayer] += this.currentTurn.score;
        if (!this.isGameEnded()) {
            this.currentTurn = new Turn();
            // this formula makes shift 0 -> 1 -> ... -> N -> 0 -> 1 -> ...
            this.currentPlayer = (this.currentPlayer + 1) % this.maxPlayers;
        }
    }

    // [return true/false] determine if any player has total score above winning level, so game has to end
    isGameEnded() {
        return this.scores.some(score => score >= this.maxScore);
    }
}

function UI_updatePlayerTotal() {
    // combine text info about turn in form "NEW_TOTAL (+TURN_SCORE) ... ROLL1, ROLL2, ,ROLLN"
    $(`#score${game.currentPlayer + 1}`).append(`<li>${game.scores[game.currentPlayer] + game.currentTurn.score} (+${game.currentTurn.score}) ... ${game.currentTurn.rolls.join(", ")}</li>`);
}

function UI_updateTurn() {
    $("#turn_title").text(`Player ${game.currentPlayer + 1} Turn`);

    $("#turn").empty();
    if (game.currentTurn.rolls.length > 0)
        $("#turn").append(`<li>${game.currentTurn.rolls.join("</li><li>")}</li>`);

    if (game.currentTurn.canRoll)
        $("#roll").show();
    else
        $("#roll").hide();

    if (game.currentTurn.canHold)
        $("#hold").show();
    else
        $("#hold").hide();
}

function UI_finishGame() {
    $("#turn_title").text(`Player ${game.currentPlayer + 1} Win!`);
    $("#turn").empty();
    $("#roll").hide();
    $("#hold").hide();
}

function postTurn() {
    // if current turn is ended or current turn score is enough to win
    if (game.currentTurn.isEnded() || game.isCurrentTurnScoreEnough()) {
        UI_updatePlayerTotal();
        game.completeTurn();
    }
    if (game.isGameEnded()) {
        UI_finishGame();
    } else {
        UI_updateTurn();
    }
}

var game = new Game();

// user interface logic
$(document).ready(function () {
    $("#tbl").click(function () {
        go();
        game.currentTurn.roll();
        postTurn();
    });

    $("#hold").click(function () {
        game.currentTurn.hold();
        postTurn();
    });
});
