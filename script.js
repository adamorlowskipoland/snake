/** CONSTANTS **/
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "white";

// Get the canvas element
let gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
let ctx = gameCanvas.getContext("2d");
//  Select the colour to fill the canvas
ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
//  Select the colour for the border of the canvas
ctx.strokestyle = CANVAS_BORDER_COLOUR;
// Draw a "filled" rectangle to cover the entire canvas
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
// Draw a "border" around the entire canvas
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];

function drawSnakePart(snakePart) {
  ctx.fillStyle = 'lightgreen';
  ctx.strokestyle = 'darkgreen';
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

drawSnake();

// Change vertical velocity to 0
dx = 0;
// Change horizontal velocity to 10
dy = -10;

function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  snake.pop();
}

function main() {
  setTimeout(function onTick() {
    clearCanvas();
    advanceSnake();
    drawSnake();
    // Call main again
    main();
  }, 100)
}

// main();
