// Get canvas element and its 2D rendering context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Define line endpoints and circle properties
const x1 = 600;
const y1 = 100;
const x2 = 500;
const y2 = 600;
const circleRadius = 30;
let circle = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    radius: circleRadius,
    color: "red"
};

// Function to draw the circle on the canvas
function drawCircle(x, y) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Begin path for the circle
    ctx.beginPath();
    // Draw the circle
    ctx.arc(x, y, circle.radius, 0, Math.PI * 2);
    // Fill the circle with color
    ctx.fillStyle = circle.color;
    ctx.fill();
    // Close the path
    ctx.closePath();
}

// Function to update circle position based on mouse movement
function updateCirclePosition(event) {
    // Get mouse coordinates relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Update circle position
    circle.x = mouseX;
    circle.y = mouseY;

    // Redraw the circle and line
    drawCircle(circle.x, circle.y);
    drawLine();
    // Check for collision
    checkCollision();
}

// Function to draw the line on the canvas
function drawLine() {
    // Set line style
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    // Begin path for the line
    ctx.beginPath();
    // Draw the line
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Function to check for collision between the circle and the line
function checkCollision() {
    // Calculate distance between circle center and line endpoints
    const distanceToStart = Math.sqrt((circle.x - x1) ** 2 + (circle.y - y1) ** 2);
    const distanceToEnd = Math.sqrt((circle.x - x2) ** 2 + (circle.y - y2) ** 2);

    // Check if the circle overlaps with either endpoint
    if (distanceToStart <= circle.radius || distanceToEnd <= circle.radius) {
        // Change circle color to indicate collision
        circle.color = "yellow";
        // Redraw the circle and line
        drawCircle(circle.x, circle.y);
        drawLine();
        return; // Exit early if collision with endpoint detected
    }

    // Perform collision detection for the line segment
    const dotProduct = ((circle.x - x1) * (x2 - x1)) + ((circle.y - y1) * (y2 - y1));
    const lineLengthSquared = ((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1));
    const normalizedDistance = dotProduct / lineLengthSquared;
    const projectedX = x1 + (normalizedDistance * (x2 - x1));
    const projectedY = y1 + (normalizedDistance * (y2 - y1));
    const isWithinSegment = projectedX >= Math.min(x1, x2) && projectedX <= Math.max(x1, x2) &&
          projectedY >= Math.min(y1, y2) && projectedY <= Math.max(y1, y2);
    const distanceToSegment = Math.sqrt((circle.x - projectedX) ** 2 + (circle.y - projectedY) ** 2);

    // Check if the circle collides with the line segment
    if (isWithinSegment && distanceToSegment <= circle.radius) {
        // Change circle color to indicate collision
        circle.color = "yellow";
        // Redraw the circle and line
        drawCircle(circle.x, circle.y);
        drawLine();
    } else {
        // Change circle color back to normal
        circle.color = "red";
        // Redraw the circle and line
        drawCircle(circle.x, circle.y);
        drawLine();
    }
}

// Add event listener for mouse movement to update circle position
canvas.addEventListener("mousemove", updateCirclePosition);

// Initial drawing of circle and line
drawCircle(circle.x, circle.y);
drawLine();