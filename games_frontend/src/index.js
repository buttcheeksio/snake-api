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
    const duckImage = document.querySelector('#duck')
    const headImage = document.querySelector('#icon')

    // returns a two-dimensional drawing context
    const ctx = gameCanvas.getContext("2d");
    let mySound = []
    let keys = []

////////////////////// END OF CONSTANTS ////////////////////////

////////////////////// SNAKE LETS ////////////////////////
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
    let foodX2;
    // Food y-coordinate
    let foodY;
    let foodY2
    // Horizontal velocity
    let dx = 10;
    let dx2 = 10
    // Vertical velocity
    let dy = 0;
    let dy2 = 0;
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
        } else if (obj.weather[0].main === 'Mist') {
            document.body.style.backgroundImage = `url(${hazeyURL})`
        }
      })
///////////////////////// END OF WEATHER FETCH //////////////////////


    /** EVENT LISTENER FOR THE CLICK TO START THE GAME **/
    function buttonToStartGame() {

      gameContainer.addEventListener('click', function(event) {
      if (event.target.id === "startGame") {


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
      } else if (event.target.id === "startGame2") {

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

        // gamesList.style.display = "block"
        highScoreContainer.style.display = "none"
        userInputContainer.style.display = "none"
        gameCanvas.style.display = "block"
        scoreContainer.style.display = "block"

          main2();
          createFood();
      }
    })
  }// end of EVENT LISTENER FOR THE CLICK TO START THE GAME
  buttonToStartGame()

  userInputContainer.addEventListener('click', (event) => {
    console.log(event.keyCode)
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

    function main2() {
      // If the game ended return early to stop game
      if (didGameEnd()) {

        gameCanvas.style.display = "none"
        userInputContainer.style.display = "block"
        scoreContainer.style.display = "none"
        finalScore.innerText = score

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
      ctx.drawImage(duckImage, foodX, foodY, 10, 10)
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
        scoreContainer.innerHTML = `
        <h2><u>Score</u></h2>
        <p>${score}</p>
        `
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
      const didEatFood = snake2[0].x === foodX2 && snake2[0].y === foodY2;
      if (didEatFood) {
        // Play Quack
        mySound.play();
        // Increase score
        score2 += 10;
        // Display score on screen
        scoreContainer.innerHTML = `
        <h2><u>Score</u></h2>
        <p>${score}</p>
        `
        scoreContainer2.innerHTML = `
        <h2><u>Score</u></h2>
        <p>${score2}</p>
        `
        // Generate new food location
        createFood();
      } else {
        // Remove the last part of snake body
        snake2.pop();
      }
    }


////////////////// didGameEnd() ////////////////////////
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

      for (let i = 4; i < snake2.length; i++) {
        if (snake2[i].x === snake2[0].x && snake2[i].y === snake2[0].y) {
          return true
        }
      }

      const hitLeftWall = snake[0].x < 0 || snake2[0].x < 0
      const hitRightWall = snake[0].x > gameCanvas.width - 10 || snake2[0].x > gameCanvas.width - 10;
      const hitBottomWall = snake[0].y < 0 || snake2[0].y < 0;
      const hitTopWall = snake[0].y > gameCanvas.height - 10 || snake2[0].y > gameCanvas.height - 10;

      return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
  } // end of didGameEnd()
////////////////// didGameEnd() ////////////////////////



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
        ctx.drawImage(headImage, snakePart2.x, snakePart2.y, 10, 10)
      } else {
        ctx.drawImage(duckImage, snakePart2.x, snakePart2.y, 10, 10)
      }
    }

    /**
     * Changes the vertical and horizontal velocity of the snake according to the
     * key that was pressed.
     * The direction cannot be switched to the opposite direction, to prevent the snake
     * from reversing
     * For example if the the direction is 'right' it cannot become 'left'
     * @param { object } event - The keydown event
     */

     ///NEED TO WRITE DIDGAMEEND2
     ///NEED TO CREATE CHANGE DIRECTION AND KEY DOWN EVENT LISTENER FOR PLAYER 2///


     document.body.addEventListener("keydown", changeDirection);
     document.body.addEventListener("keydown", changeDirection2);
     document.body.addEventListener("keyup", function (e) {
       // console.log("inside eventListener", keys)
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
      // console.log("inside changeDirection2", keys)

      // const keyPressed2 = event.keyCode;
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


    // document.body.addEventListener("keydown", function (e) {
    //   keys[e.keyCode] = true;
    //
    // });






    //
    //
    // function update() {
    //
    //   if (keys[38]) {
    //       if (snake.velY > -speed) {
    //           snake.velY--;
    //       }
    //   }
    //
    //   if (keys[40]) {
    //       if (snake.velY < speed) {
    //           snake.velY++;
    //       }
    //   }
    //   if (keys[39]) {
    //       if (snake.velX < speed) {
    //           snake.velX++;
    //       }
    //   }
    //   if (keys[37]) {
    //       if (snake.velX > -speed) {
    //           snake.velX--;
    //       }
    //   }
    //
    //   if (keys[87]) {
    //       if (snake2.velY > -speed) {
    //           snake2.velY--;
    //       }
    //   }
    //
    //   if (keys[83]) {
    //       if (snake2.velY < speed) {
    //           snake2.velY++;
    //       }
    //   }
    //   if (keys[68]) {
    //       if (snake2.velX < speed) {
    //           snake2.velX++;
    //       }
    //   }
    //   if (keys[65]) {
    //       if (snake2.velX > -speed) {
    //           snake2.velX--;
    //       }
    //   }
    //   ctx.clearRect(0, 0, 300, 300);
    //   updatePlayer(snake);
    //   updatePlayer(snake2);
    //   setTimeout(update, 10);
    // } // end of update()
    //
    // function updatePlayer(player) {
    //   player.velY *= friction;
    //   player.y += player.velY;
    //   player.velX *= friction;
    //   player.x += player.velX;
    //
    //   if (player.x >= 295) {
    //       player.x = 295;
    //   } else if (player.x <= 5) {
    //       player.x = 5;
    //   }
    //
    //   if (player.y > 295) {
    //       player.y = 295;
    //   } else if (player.y <= 5) {
    //       player.y = 5;
    //   }
    //
    //   ctx.fillStyle = player.color;
    //   ctx.beginPath();
    //   ctx.arc(player.x, player.y, 5, 0, Math.PI * 2);
    //   ctx.fill();
    // } // end of updatePlayer(player)
    //
    // update()




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


////////////////////////// END OF SOUNDS //////////////////////////

}) // end of DOMContentLoaded
