const GAME_SPEED = 100;
const CANVAS_BORDER_COLOUR = '#000';
const CANVAS_BACKGROUND_COLOUR = "#fff";
const SNAKE_COLOUR = '#98FB98';
const SNAKE_HEAD_BORDER_COLOUR = '#006400';
/*  Ferrari red ;-) */
const FOOD_COLOUR = '#ff2800';
const FOOD_BORDER_COLOUR = '#8b0000';

// Get the canvas element
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const snake = {
  body: [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 },
  ],
};

const food = {
  x: 0,
  y: 0,
};

let score = 0;
let changingDirection = false;

// Horizontal velocity
let dx = 10;
let dy = 0;

const operator = {
  randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
  },
  didGameEnd() {
    for (let i = 4; i < snake.body.length; i++) {
      if (snake.body[i].x === snake.body[0].x && snake.body[i].y === snake.body[0].y) return true
    }
    const hitLeftWall = snake.body[0].x < 0;
    const hitRightWall = snake.body[0].x > gameCanvas.width - 10;
    const hitToptWall = snake.body[0].y < 0;
    const hitBottomWall = snake.body[0].y > gameCanvas.height - 10;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
  },
  createFood() {
    // Generate a random number the food x-coordinate and food y coordinate
    food.x = this.randomTen(0, gameCanvas.width - 10);
    food.y = this.randomTen(0, gameCanvas.height - 10);
    // if the new food location is where the snake currently is, generate a new food location
    snake.body.forEach(function isFoodOnSnake(part) {
      const foodIsoNsnake = part.x === food.x && part.y === food.y;
      if (foodIsoNsnake) this.createFood();
    });
  },
  advanceSnake() {
    // Create the new Snake's head
    const head = { x: snake.body[0].x + dx, y: snake.body[0].y + dy };
    // Add the new head to the beginning of snake body
    snake.body.unshift(head);
    const didEatFood = snake.body[0].x === food.x && snake.body[0].y === food.y;
    if (didEatFood) {
      // Increase score
      score += 10;
      // Display score on screen
      document.getElementById('score').innerHTML = score;
      // Generate new food location
      operator.createFood();
    } else {
      // Remove the last part of snake body
      snake.body.pop();
    }
  },
  changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
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
  },
};

const view = {
  clearCanvas() {
    //  Select the colour to fill the drawing
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    //  Select the colour for the border of the canvas
    ctx.strokestyle = CANVAS_BORDER_COLOUR;
    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a "border" around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
  },
  drawFood() {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokestyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(food.x, food.y, 10, 10);
    ctx.strokeRect(food.x, food.y, 10, 10);
  },
  drawSnake() {
    // loop through the snake parts drawing each part on the canvas
    snake.body.forEach(this.drawSnakePart)
  },
  drawSnakePart(snakePart) {
    // Set the colour of the snake part
    ctx.fillStyle = snake.body.indexOf(snakePart) === 0 ? SNAKE_HEAD_BORDER_COLOUR : SNAKE_COLOUR;
    // Set the border colour of the snake part
    ctx.strokestyle = SNAKE_HEAD_BORDER_COLOUR;
    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    // Draw a border around the snake part
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
  },
  main() {
    // If the game ended return early to stop game
    if (operator.didGameEnd()) return;
    setTimeout(() => {
      changingDirection = false;
      this.clearCanvas();
      this.drawFood();
      operator.advanceSnake();
      this.drawSnake();
      // Call game again
      this.main();
    }, GAME_SPEED)
  },
};


view.clearCanvas();
operator.createFood();
view.drawFood();
// Create the first food location
view.drawSnake();

// Call changeDirection whenever a key is pressed
document.addEventListener("keydown", operator.changeDirection);

document.addEventListener("keyup", (event) => {
  let code;

  if (event.key !== undefined) {
    code = event.key;
  } else if (event.keyIdentifier !== undefined) {
    code = event.keyIdentifier;
  } else if (event.keyCode !== undefined) {
    code = event.keyCode;
  }
  code === 13 || code === 'Enter' ? view.main() : 0
});
