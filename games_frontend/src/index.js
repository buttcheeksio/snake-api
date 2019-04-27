document.addEventListener('DOMContentLoaded', function() {

////////////////////// CONSTANTS //////////////////////////////////////

    let GAME_SPEED = 150;
    let pointsMultiplier = 1

    const CANVAS_BACKGROUND_COLOR = "lightgrey";

    const gamesURL = 'http://localhost:3000/api/v1/games'
    const weatherURL = 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=dadc8345526b5cb33c413493ea7bf56f'
    const cloudsURL = 'http://freebigpictures.com/wp-content/uploads/cloud.jpg'
    const hazeyURL = 'https://wallpaperplay.com/walls/full/1/8/6/215620.jpg'
    const snowURL = `https://cdn.pixabay.com/photo/2016/03/12/23/25/landscape-1253032_960_720.jpg`
    const rainySky = '/Users/johnmartinez/dev/js/api-test/snake-api/app/images/rainySky.png'

    const rubberDuckWithSunglass = `https://art.pixilart.com/ca050e04650ceaf.png`
    const rubberDuckWithBow = `https://art.pixilart.com/b365c1e88ecf6ca.png`
    const rubberDuckWithBriefcase = `https://art.pixilart.com/6e7d81bf4d728ce.png`
    const rubberDuckPlain = `https://art.pixilart.com/32f43ba45fa2e05.png`
    const flockyLogo = `https://fontmeme.com/permalink/190123/8a5c9ae5518ede9ae135238333c6e120.png`

    const gameContainer = document.querySelector('#gameContainer')
    const highScoreContainer = document.querySelector('#highScoreContainer')
    const userInputContainer = document.querySelector('#userInputContainer')
    const scoresContainer = document.querySelector('#scores')
    const gameWinner = document.querySelector('#gameWinner h3')
    const gameWinnerContainer = document.querySelector('#gameWinner')

    const getReady = document.querySelector('#getReady')
    const startGameButton = document.querySelector('#startGame')
    const startGameButton2 = document.querySelector('#startGame2')
    const mainMenuButton = document.querySelectorAll('.mainMenuButton')

    const speedView = document.querySelector('#speedView')
    const difficulty = document.querySelector('#difficulty')
    const gamesList = document.querySelector('#gameContainer table')
    const finalScore = document.querySelector('#userInputContainer h1')
    const userNameInput = document.querySelector('#userInputContainer input')
    const scoresData = document.querySelector('#scoresData')
    const gameCanvas = document.getElementById("gameCanvas")
    const duckImage = document.querySelector('#duck')
    const headImage = document.querySelector('#icon')
    const duckImage2 = document.querySelector('#duck2')
    const headImage2 = document.querySelector('#duck2')
    const foodDuck = document.querySelector('#foodDuck')
    const difficultyText = document.querySelector('#difficulty-text')

    const quackSoundPath = "/Users/johnmartinez/dev/js/api-test/snake-api/app/images/quack.mp3"
    const gameplayMusicPath = '/Users/johnmartinez/dev/js/api-test/snake-api/app/images/GWars Evolved Main Stem.mp3'
    const gameOverSoundPath = '/Users/johnmartinez/dev/js/api-test/snake-api/app/images/gameOverSound.mp3'

    // returns a two-dimensional drawing context
    const ctx = gameCanvas.getContext("2d");
    let quackSound = []
    let gameplayMusic = []
    let gameOverSound = []
    let keys = []
    let winner = ""

////////////////////// END OF CONSTANTS ///////////////////////////////

////////////////////// SNAKE LETS /////////////////////////////////////

    let snake = [
      {x: 150, y: 150},
      {x: 140, y: 150},
      {x: 130, y: 150},
      {x: 120, y: 150},
      {x: 110, y: 150}
    ]

    let snake2 = [
      {x: 150, y: 150},
      {x: 140, y: 150},
      {x: 130, y: 150},
      {x: 120, y: 150},
      {x: 110, y: 150}
    ]
    // The user's score
    let score = 0;
    let score2 = 0
    // When set to true the snake is changing direction
    let changingDirection = false;
    let changingDirection2 = false;
    // Food x-coordinate
    let foodX;
    // Food y-coordinate
    let foodY;
    // Horizontal velocity
    let dx = 10;
    let dx2 = 10
    // Vertical velocity
    let dy = 0;
    let dy2 = 0;

////////////////////// END OF SNAKE LETS //////////////////////////////

////////////////////// INITIAL GAME FETCH /////////////////////////////

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

////////////////////// END OF INITIAL GAME FETCH //////////////////////

///////////////////// RENDER //////////////////////////////////////////

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

///////////////////// END OF RENDER ///////////////////////////////////

////////////////////////// WEATHER FETCH //////////////////////////////

    //WEATHER API Call
    fetch(weatherURL)
      .then(response => response.json())
      .then(obj => {
        if (obj.weather[0].main === 'Clouds') {
          document.body.style.backgroundImage = `url(${cloudsURL})`
        } else if (obj.weather[0].main === 'Mist') {
            document.body.style.backgroundImage = `url(${hazeyURL})`
        } else if (obj.weather[0].main === 'Haze') {
            document.body.style.backgroundImage = `url(${hazeyURL})`
        } else if (obj.weather[0].main === 'Rain') {
            document.body.style.backgroundImage = `url(${rainySky})`
        }
      })

///////////////////////// END OF WEATHER FETCH //////////////////////

//////////////////////// SELECT SPEED /////////////////////////////////

    function selectSpeed() {
      difficulty.addEventListener('change', function(event) {
        if (event.target.value === "slow") {
          GAME_SPEED = 200
          pointsMultiplier = 0.7
          speedView.innerHTML = "Current Speed: Slow (score multipler: 0.75)"

        } else if (event.target.value === "normal") {
          GAME_SPEED = 150
          pointsMultiplier = 1
          speedView.innerHTML = "Current Speed: Normal (score multipler: 1.0)"

        } else if (event.target.value === "fast") {
          GAME_SPEED = 75
          pointsMultiplier = 1.5
          speedView.innerHTML = "Current Speed: Fast (score multipler: 1.5)"
        }
      })
    }
    selectSpeed()

//////////////////////// END OF SELECT SPEED //////////////////////////

  // function mainMenuButtonPressed() {
  //   // highScoreContainer.style.display = "block"
  //   console.log("lol")
  // }
//////////////////////// EVENT LISTENER FOR CLICK TO START GAME ///////

    function buttonToStartGame() {
      gameContainer.addEventListener('click', function(event) {

      ///////////////// IF PLAYER CHOOSES ONE PLAYER GAME ////////////
      if (event.target.id === "startGame") {

        difficultyText.style.display = "none";
        highScoreContainer.style.display = "none"
        getReady.style.display = "flex"

        setTimeout( function onTick() {
          getReady.style.display = "none"
          gameplayMusic = new sound(gameplayMusicPath);
          gameplayMusic.play();

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

          highScoreContainer.style.display = "none"
          userInputContainer.style.display = "none"
          difficultyText.style.display = "none"
          gameCanvas.style.display = "block"
          scoresContainer.style.display = "block"

            main();
            createFood();
        }, 3000) // end of setTimeout

      //////////// IF PLAYER CHOOSES TWO PLAYER GAME //////////////////
      } else if (event.target.id === "startGame2") {
        console.log('button is working')
        gameplayMusic = new sound(gameplayMusicPath);
        gameplayMusic.play();

        snake = [
          {x: 40, y: 0},
          {x: 30, y: 0},
          {x: 20, y: 0},
          {x: 10, y: 0},
          {x: 0, y: 0}
        ]

        snake2 = [
          {x: 250, y: 290},
          {x: 260, y: 290},
          {x: 270, y: 290},
          {x: 280, y: 290},
          {x: 290, y: 290}
        ]

        score = 0;
        score2 = 0

        changingDirection = false;
        changingDirection2 = false

        foodX;
        foodY;

        dx = 10;
        dy = 0;
        dx2 = -10;
        dy2 = 0;

        highScoreContainer.style.display = "none"
        userInputContainer.style.display = "none"
        gameCanvas.style.display = "block"
        scoresContainer.style.display = "none"

          main2();
          createFood();
      } else if (event.target.id === "mainMenuButton") {
        difficultyText.style.display = "block";
        highScoreContainer.style.display = "block"
        userInputContainer.style.display = "none"
        gameWinnerContainer.style.display = "none"
      }
    })
  }// end of EVENT LISTENER FOR THE CLICK TO START THE GAME
  buttonToStartGame()

//////////////////// END OF EVENT LISTENER FOR CLICK TO START GAME ////

////////////////// EVENT LISTENER FOR CLICK TO SUBMIT TO LEADERBOARD ///

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


        scoresData.innerHTML = `
          <tr>
            <th><h3><u> RANK </u></h3></th>
            <th><h3><u> PLAYER </u></h3></th>
            <th><h3><u> SCORE </u></h3></th>
          </tr>
        `
        highScoreContainer.style.display = "block"
        difficultyText.style.display = "block"
        renderAllGames(allGames)
      })
    } //end of IF statement
  }) // end of user input event listener

///////////// END EVENT LISTENER FOR CLICK TO SUBMIT TO LEADERBOARD ///

//////////////////////////// MAIN /////////////////////////////////////

    /**
     * Main function of the game
     * called repeatedly to advance the game
     */
    function main() {
      // If the game ended return early to stop game
      if (didGameEnd()) {

        difficultyText.style.display = "none"
        gameCanvas.style.display = "none"
        scoresContainer.style.display = "none"
        userInputContainer.style.display = "block"
        finalScore.innerText = score

        gameplayMusic.stop();
        gameOverSound.play();

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
     * Main function of the two-player game
     * called repeatedly to advance the game
     */
    function main2() {
      // If the game ended return early to stop game
      if (didGameEnd2()) {

        gameCanvas.style.display = "none"
        scoresContainer.style.display = "none"
        userInputContainer.style.display = "none"
        difficultyText.style.display = "none"
        gameWinner.innerText = winner
        gameWinnerContainer.style.display = "block"

        gameplayMusic.stop();
        gameOverSound.play();

      } else {

        setTimeout(function onTick() {
          changingDirection = false;
          changingDirection2 = false;
          clearCanvas();
          drawFood();
          advanceSnake();
          advanceSnake2();
          drawSnake();
          drawSnake2();
          // Call game again
          main2();
        }, GAME_SPEED)
      }
    }

/////////////////////////// END OF MAIN ///////////////////////////////

////////////////////////// clearCanvas ////////////////////////////////

    /**
     * Change the background colour of the canvas to CANVAS_BACKGROUND_COLOR and
     * draw a border around it
     */
    function clearCanvas() {
      ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
      ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    }

////////////////////////// END OF clearCanvas /////////////////////////

//////////////////////// advanceSnake /////////////////////////////////

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
        quackSound.play();
        // Increase score
        score += (10 * pointsMultiplier);
        // Display score on screen
        scoreContainer.innerHTML = `
        <b><p><u>Score</u></p>
        <p>${score}</p></b>
        `
        if (score == 50) {
          console.log('SCORE IS NOW 10')
        }
        // Generate new food location
        createFood();
      } else {
        // Remove the last part of snake body
        snake.pop();
      }
    }

    function advanceSnake2() {
      // Create the new Snake's head
      const head = {x: snake2[0].x + dx2, y: snake2[0].y + dy2};
      // Add the new head to the beginning of snake body
      snake2.unshift(head);
      const didEatFood = snake2[0].x === foodX && snake2[0].y === foodY;
      if (didEatFood) {
        // Play Quack
        quackSound.play();
        // Increase score
        score2 += (10 * pointsMultiplier);
        // Display score on screen

        // Generate new food location
        createFood();
      } else {
        // Remove the last part of snake body
        snake2.pop();
      }
    }

//////////////////////// END OF advanceSnake //////////////////////////

/////////////////////// didGameEnd() //////////////////////////////////

  /**
   * Returns true if the head of the snake touched another part of the game
   * or any of the walls
   */
   function didGameEnd() {
     for (let i = 4; i < snake.length; i++) {
       if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
         return true
       }
     }

     const hitLeftWall = snake[0].x < 0
     const hitRightWall = snake[0].x > gameCanvas.width - 10
     const hitBottomWall = snake[0].y < 0
     const hitTopWall = snake[0].y > gameCanvas.height - 10

     return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
   }

    function didGameEnd2() {
      for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
          winner = "Player 2 wins!"
          return true
        }
      }

      for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake2[0].x && snake[i].y === snake2[0].y) {
          winner = "Player 1 wins!"
          return true
        }
      }

      for (let i = 4; i < snake2.length; i++) {
        if (snake2[i].x === snake[0].x && snake2[i].y === snake[0].y) {
          winner = "Player 2 wins!"
          return true
        }
      }

      for (let i = 4; i < snake2.length; i++) {
        if (snake2[i].x === snake2[0].x && snake2[i].y === snake2[0].y) {
          winner = "Player 1 wins!"
          return true
        }
      }

      const hitLeftWall = snake[0].x < 0 || snake2[0].x < 0
      const hitRightWall = snake[0].x > gameCanvas.width - 10 || snake2[0].x > gameCanvas.width - 10;
      const hitBottomWall = snake[0].y < 0 || snake2[0].y < 0;
      const hitTopWall = snake[0].y > gameCanvas.height - 10 || snake2[0].y > gameCanvas.height - 10;

      if (snake2[0].x < 0) {
        winner = "Player 1 wins!"
      } else if (snake2[0].x > gameCanvas.width - 10) {
        winner = "Player 1 wins!"
      } else if (snake2[0].y < 0) {
        winner = "Player 1 wins!"
      } else if (snake2[0].y > gameCanvas.height - 10) {
        winner = "Player 1 wins!"
      } else if (snake[0].x < 0) {
        winner = "Player 2 wins!"
      } else if (snake[0].x > gameCanvas.width - 10) {
        winner = "Player 2 wins!"
      } else if (snake[0].y < 0) {
        winner = "Player 2 wins!"
      } else if (snake[0].y > gameCanvas.height - 10) {
        winner = "Player 2 wins!"
      }

      return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
  } // end of didGameEnd()

/////////////////////// END OF didGameEnd() ///////////////////////////

/////////////////////// FOOD //////////////////////////////////////////

    /**
     * Draw the food on the canvas
     */
    function drawFood() {
      ctx.drawImage(foodDuck, foodX, foodY, 10, 10)
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

/////////////////////////// END OF FOOD ///////////////////////////////

////////////////////////// DRAW SNAKE /////////////////////////////////

    /**
     * Draws the snake on the canvas
     */
    function drawSnake() {
      snake.forEach(drawSnakePart)
    }

    /**
     * Draws a part of the snake on the canvas
     * @param { object } snakePart - The coordinates where the part should be drawn
     */
    function drawSnakePart(snakePart) {

      if (snakePart === snake[0]) {
        ctx.drawImage(headImage, snakePart.x, snakePart.y, 10, 10)
      } else {
        ctx.drawImage(duckImage, snakePart.x, snakePart.y, 10, 10)
      }
    }

    function drawSnake2() {
      snake2.forEach(drawSnakePart2)
    }

    /**
     * Draws a part of the snake on the canvas
     * @param { object } snakePart - The coordinates where the part should be drawn
     */
    function drawSnakePart2(snakePart2) {

      if (snakePart2 === snake2[0]) {
        ctx.drawImage(headImage2, snakePart2.x, snakePart2.y, 10, 10)
      } else {
        ctx.drawImage(duckImage2, snakePart2.x, snakePart2.y, 10, 10)
      }
    }

////////////////////////// END OF DRAW SNAKE //////////////////////////

///////////////////////// MOVEMENT ////////////////////////////////////

     document.body.addEventListener("keydown", changeDirection);
     document.body.addEventListener("keydown", changeDirection2);
     document.body.addEventListener("keyup", function (e) {
       keys[e.keyCode] = false;
     });


    function changeDirection(event) {
      const LEFT_KEY = 37;
      const RIGHT_KEY = 39;
      const UP_KEY = 38;
      const DOWN_KEY = 40;
      keys[event.keyCode] = true;
      /**
       * Prevent the snake from reversing
       * Example scenario:
       * Snake is moving to the right. User presses down and immediately left
       * and the snake immediately changes direction without taking a step down first
       */
      if (changingDirection) return;
      changingDirection = true;

      // const keyPressed = event.keyCode;
      const goingUp = dy === -10;
      const goingDown = dy === 10;
      const goingRight = dx === 10;
      const goingLeft = dx === -10;

      if (keys[LEFT_KEY] && !goingRight) {
        dx = -10;
        dy = 0;
      }

      if (keys[UP_KEY] && !goingDown) {
        dx = 0;
        dy = -10;
      }

      if (keys[RIGHT_KEY] && !goingLeft) {
        dx = 10;
        dy = 0;
      }

      if (keys[DOWN_KEY] && !goingUp) {
        dx = 0;
        dy = 10;
      }
    } // end of changeDirection()

    function changeDirection2(event) {
      const LEFT_KEY = 65;
      const RIGHT_KEY = 68;
      const UP_KEY = 87;
      const DOWN_KEY = 83;
      keys[event.keyCode] = true;
      /**
       * Prevent the snake from reversing
       * Example scenario:
       * Snake is moving to the right. User presses down and immediately left
       * and the snake immediately changes direction without taking a step down first
       */
      if (changingDirection2) return;
      changingDirection2 = true;

      const goingUp2 = dy2 === -10;
      const goingDown2 = dy2 === 10;
      const goingRight2 = dx2 === 10;
      const goingLeft2 = dx2 === -10;

      if (keys[LEFT_KEY] && !goingRight2) {
        dx2 = -10;
        dy2 = 0;
      }

      if (keys[UP_KEY] && !goingDown2) {
        dx2 = 0;
        dy2 = -10;
      }

      if (keys[RIGHT_KEY] && !goingLeft2) {
        dx2 = 10;
        dy2 = 0;
      }

      if (keys[DOWN_KEY] && !goingUp2) {
        dx2 = 0;
        dy2 = 10;
      }

    } // end of changeDirection()

///////////////////////// END OF MOVEMENT /////////////////////////////

////////////////////////// SOUNDS /////////////////////////////////////

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

  quackSound = new sound(quackSoundPath);
  gameOverSound = new sound(gameOverSoundPath);

////////////////////////// END OF SOUNDS //////////////////////////////
}) // end of DOMContentLoaded
