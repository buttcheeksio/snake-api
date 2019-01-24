document.addEventListener('DOMContentLoaded', function() {

////////////////////// CONSTANTS ////////////////////////
    const GAME_SPEED = 150;
    const CANVAS_BORDER_COLOR = 'black';
    const CANVAS_BACKGROUND_COLOR = "white";
    const SNAKE_COLOR = 'lightgreen';
    const SNAKE_BORDER_COLOR = 'darkgreen';
    const FOOD_COLOR = 'red';
    const FOOD_BORDER_COLOR = 'darkred';

    const gamesURL = 'http://localhost:3000/api/v1/games'
    const weatherURL = 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=dadc8345526b5cb33c413493ea7bf56f'
    const cloudsURL = 'http://freebigpictures.com/wp-content/uploads/cloud.jpg'
    const hazeyURL = 'https://wallpaperplay.com/walls/full/1/8/6/215620.jpg'
    const snowURL = `https://cdn.pixabay.com/photo/2016/03/12/23/25/landscape-1253032_960_720.jpg`
    const rubberDuckWithSunglass = `https://art.pixilart.com/ca050e04650ceaf.png`
    const rubberDuckWithBow = `https://art.pixilart.com/b365c1e88ecf6ca.png`
    const rubberDuckWithBriefcase = `https://art.pixilart.com/6e7d81bf4d728ce.png`
    const rubberDuckPlain = `https://art.pixilart.com/32f43ba45fa2e05.png`
    const flockyLogo = `https://fontmeme.com/permalink/190123/8a5c9ae5518ede9ae135238333c6e120.png`

    const gameContainer = document.querySelector('#gameContainer')
    const scoreContainer = document.querySelector('#scoreContainer')
    const highScoreContainer = document.querySelector('#highScoreContainer')
    const gamesList = document.querySelector('#gameContainer table')
    const userInputContainer = document.querySelector('#userInputContainer')
    const finalScore = document.querySelector('#userInputContainer h1')
    const userNameInput = document.querySelector('#userInputContainer input')
    const scoresData = document.querySelector('#scoresData')
    const gameCanvas = document.getElementById("gameCanvas")

    // returns a two-dimensional drawing context
    const ctx = gameCanvas.getContext("2d");
    let mySound = []

////////////////////// END OF CONSTANTS ////////////////////////

////////////////////// SNAKE LETS ////////////////////////
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
////////////////////// END OF SNAKE LETS ////////////////////////

////////////////////// INITIAL GAME FETCH ////////////////////////
    allGames = []

    fetch(gamesURL)
      .then( response => response.json())
      .then( gamesData => {
        gamesData.forEach (game => {
          allGames.push(game)
          allGames.sort((a,b) => b.score - a.score)
        })
        allGames.splice(8)

        renderAllGames(allGames)
      }) // end of the fetch(gamesURL)

////////////////////// END OF INITIAL GAME FETCH ////////////////////////

      function renderAllGames(games) {
        i = 1
        games.forEach (game => {
          scoresData.innerHTML += renderOneGame(game)
        })
      }

      function renderOneGame(game) {

        return `
        <tr>
        <td> ${i++} </td>
        <td> ${game.user} </td>
        <td> ${game.score} </td>
        </tr>
        `
      }

////////////////////////// WEATHER FETCH //////////////////////////
    //WEATHER API Call
    fetch(weatherURL)
      .then(response => response.json())
      .then(obj => {
        if (obj.weather[0].main === 'Clouds') {
          document.body.style.backgroundImage = `url(${cloudsURL})`
        } else if (obj.weather[0].main === 'Haze') {
            document.body.style.backgroundImage = `url(${hazeyURL})`
        }
      })
///////////////////////// END OF WEATHER FETCH //////////////////////


    /** EVENT LISTENER FOR THE CLICK TO START THE GAME **/
    function buttonToStartGame() {

      gameContainer.addEventListener('click', function(event) {
      if (event.target.id === "startGame") {
        console.log(GAME_SPEED)
        console.log(dx, dy)

        snake = [
          {x: 150, y: 150},
          {x: 140, y: 150},
          {x: 130, y: 150},
          {x: 120, y: 150},
          {x: 110, y: 150}
        ]

        score = 0;
        changingDirection = false;
        foodX;
        foodY;
        dx = 10;
        dy = 0;

        // gamesList.style.display = "block"
        highScoreContainer.style.display = "none"
        userInputContainer.style.display = "none"
        gameCanvas.style.display = "block"
        scoreContainer.style.display = "block"

          main();
          createFood();
      }
    })
  }// end of EVENT LISTENER FOR THE CLICK TO START THE GAME
  buttonToStartGame()

  userInputContainer.addEventListener('click', (event) => {
    if (event.target.id === 'nameInputButton') {
      fetch(gamesURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user: userNameInput.value,
          score: score
        }) //end of body
      }) // end of fetch
      .then(response => response.json())
      .then(game => {
        userInputContainer.style.display = "none"

        allGames.push(game)
        allGames.sort((a,b) => b.score - a.score)
        allGames.splice(8)
        // gamesList.innerHTML += renderOneGame(obj)

        scoresData.innerHTML = `
          <tr>
            <th><h3><u> RANK </u></h3></th>
            <th><h3><u> PLAYER </u></h3></th>
            <th><h3><u> SCORE </u></h3></th>
          </tr>
        `
        highScoreContainer.style.display = "block"
        renderAllGames(allGames)
      })
    } //end of IF statement
  }) // end of user input event listener

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
      if (didGameEnd()) {

        gameCanvas.style.display = "none"
        userInputContainer.style.display = "block"
        scoreContainer.style.display = "none"
        finalScore.innerText = score

        // gamesList.innerHTML += renderOneGame
      } else {



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
        // Play Quack
        mySound.play();
        // Increase score
        score += 10;
        // Display score on screen
        scoreContainer.innerHTML = score;
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

////////////////////////// SOUNDS //////////////////////////
  // new object constructor to handle sound objects
  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

  mySound = new sound("/Users/johnmartinez/dev/js/api-test/snake-api/app/images/quack.mp3");

  const buttonForQuack = document.querySelector('#sound')
  buttonForQuack.addEventListener('click', function(event) {
    mySound.play();
  })

////////////////////////// END OF SOUNDS //////////////////////////

}) // end of DOMContentLoaded
