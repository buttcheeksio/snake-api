document.addEventListener('DOMContentLoaded', function() {

    const GAME_SPEED = 150;
    const CANVAS_BORDER_COLOR = 'black';
    const CANVAS_BACKGROUND_COLOR = "white";
    const SNAKE_COLOR = 'lightgreen';
    const SNAKE_BORDER_COLOR = 'darkgreen';
    const FOOD_COLOR = 'red';
    const FOOD_BORDER_COLOR = 'darkred';

    const gamesURL = 'http://localhost:3000/api/v1/games'

    let snake = [
      {x: 150, y: 150},
      {x: 140, y: 150},
      {x: 130, y: 150},
      {x: 120, y: 150},
      {x: 110, y: 150}
    ]
    // The user's score
    let score = 0;
    // When set to true the snake is changing direction
    let changingDirection = false;
    // Food x-coordinate
    let foodX;
    // Food y-coordinate
    let foodY;
    // Horizontal velocity
    let dx = 10;
    // Vertical velocity
    let dy = 0;
    // Get the canvas element
    const gameCanvas = document.getElementById("gameCanvas");
    // Return a two dimensional drawing context
    const ctx = gameCanvas.getContext("2d");

    // Return a two dimensional drawing context for Menu
    // const menuCtx = menuCanvas.getContext("2d")

    // menu??
    // leaderboard()
    // function leaderboard() {
      //   menuCtx.fillStyle = CANVAS_BACKGROUND_COLOR
      //   menuCtx.strokestyle = CANVAS_BORDER_COLOR
      // }
      // fetch for all the information
      // display all the information on the screen in a list format
      // hit button to remove current display and pull in canvas

    // fetch that specific URL
    const gameContainer = document.querySelector('#gameContainer')
    const scoreContainer = document.querySelector('#score')

    const gamesList = document.querySelector('#gameContainer ul')

    fetch(gamesURL)
      .then( response => response.json())
      .then( gamesData => {
        gamesData.forEach (game => {
          gamesList.innerHTML += renderOneGame(game)
        })
      }) // end of the fetch(gamesURL)

    function renderOneGame(game) {
      return `<li>${game.user} - ${game.score}</li>`
    }


    /** EVENT LISTENER FOR THE CLICK TO START THE GAME **/
    gameContainer.addEventListener('click', function(event) {
      if (event.target.tagName === "BUTTON") {
        gameCanvas.style.display = "block"
        scoreContainer.style.display = "block"

          main();
          createFood();
      }
    }) // end of EVENT LISTENER FOR THE CLICK TO START THE GAME





    // everything under here occurs after button press of "Start Game" or something
    // Start game

    // Create the first food location

    // Call changeDirection whenever a key is pressed
    document.addEventListener("keydown", changeDirection);
    /**
     * Main function of the game
     * called repeatedly to advance the game
     */
    function main() {
      // If the game ended return early to stop game
      if (didGameEnd()) return;

      setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        // Call game again
        main();
      }, GAME_SPEED)
    }
    /**
     * Change the background colour of the canvas to CANVAS_BACKGROUND_COLOR and
     * draw a border around it
     */
    function clearCanvas() {
      //  Select the colour to fill the drawing
      ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
      //  Select the colour for the border of the canvas
      ctx.strokestyle = CANVAS_BORDER_COLOR;
      // Draw a "filled" rectangle to cover the entire canvas
      ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
      // Draw a "border" around the entire canvas
      ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
    }
    /**
     * Draw the food on the canvas
     */
    function drawFood() {
      ctx.fillStyle = FOOD_COLOR;
      ctx.strokestyle = FOOD_BORDER_COLOR;
      ctx.fillRect(foodX, foodY, 10, 10);
      ctx.strokeRect(foodX, foodY, 10, 10);
    }
    /**
     * Advances the snake by changing the x-coordinates of its parts
     * according to the horizontal velocity and the y-coordinates of its parts
     * according to the vertical veolocity
     */
    function advanceSnake() {
      // Create the new Snake's head
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      // Add the new head to the beginning of snake body
      snake.unshift(head);
      const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
      if (didEatFood) {
        // Increase score
        score += 10;
        // Display score on screen
        document.getElementById('score').innerHTML = score;
        // Generate new food location
        createFood();
      } else {
        // Remove the last part of snake body
        snake.pop();
      }
    }
    /**
     * Returns true if the head of the snake touched another part of the game
     * or any of the walls
     */
    function didGameEnd() {
      for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
      }
      const hitLeftWall = snake[0].x < 0;
      const hitRightWall = snake[0].x > gameCanvas.width - 10;
      const hitBottomWall = snake[0].y < 0;
      const hitTopWall = snake[0].y > gameCanvas.height - 10;
      return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
    }
    /**
     * Generates a random number that is a multiple of 10 given a minumum
     * and a maximum number
     * @param { number } min - The minimum number the random number can be
     * @param { number } max - The maximum number the random number can be
     */
    function randomTen(min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }
    /**
     * Creates random set of coordinates for the snake food.
     */
    function createFood() {
      // Generate a random number the food x-coordinate
      foodX = randomTen(0, gameCanvas.width - 10);
      // Generate a random number for the food y-coordinate
      foodY = randomTen(0, gameCanvas.height - 10);
      // if the new food location is where the snake currently is, generate a new food location
      snake.forEach(function isFoodOnSnake(part) {
        const foodIsoNsnake = part.x == foodX && part.y == foodY;
        if (foodIsoNsnake) createFood();
      });
    }
    /**
     * Draws the snake on the canvas
     */
    function drawSnake() {
      // loop through the snake parts drawing each part on the canvas
      snake.forEach(drawSnakePart)
    }
    /**
     * Draws a part of the snake on the canvas
     * @param { object } snakePart - The coordinates where the part should be drawn
     */
    function drawSnakePart(snakePart) {
      // Set the colour of the snake part
      ctx.fillStyle = SNAKE_COLOR;
      // Set the border colour of the snake part
      ctx.strokestyle = SNAKE_BORDER_COLOR;
      // Draw a "filled" rectangle to represent the snake part at the coordinates
      // the part is located
      ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
      // Draw a border around the snake part
      ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }
    /**
     * Changes the vertical and horizontal velocity of the snake according to the
     * key that was pressed.
     * The direction cannot be switched to the opposite direction, to prevent the snake
     * from reversing
     * For example if the the direction is 'right' it cannot become 'left'
     * @param { object } event - The keydown event
     */
    function changeDirection(event) {
      const LEFT_KEY = 37;
      const RIGHT_KEY = 39;
      const UP_KEY = 38;
      const DOWN_KEY = 40;
      /**
       * Prevent the snake from reversing
       * Example scenario:
       * Snake is moving to the right. User presses down and immediately left
       * and the snake immediately changes direction without taking a step down first
       */
      if (changingDirection) return;
      changingDirection = true;

      const keyPressed = event.keyCode;
      const goingUp = dy === -10;
      const goingDown = dy === 10;
      const goingRight = dx === 10;
      const goingLeft = dx === -10;
      if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
      }

      if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
      }

      if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
      }

      if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
      }
    }
}) // end of DOMContentLoaded
