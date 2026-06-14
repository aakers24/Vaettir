// Canvas Setup
const spaceCanvas = document.getElementById("spaceCanvas");
const spctx = spaceCanvas.getContext("2d");
let seed = seedGen();
let screenScale = 0;
let starDistance = 0;
let frameTime = 0;
let prevTimestamp = 0;

// Dynamic canvas sizing
function resizeCanvas() {
    spaceCanvas.width = window.innerWidth;
    spaceCanvas.height = window.innerHeight;
    screenScale = Math.max(.64, Math.min(spaceCanvas.width / 2048, 1.16));
    starDistance = screenScale * 240;
    influenceRadius = screenScale * 256
}

// Dynamic canvas resizing
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initalization resize event



// Procedural Randomness Generator
function seedGen() {
return (Math.random() * Math.random() * 8821 * 43481 * 51659 * 73476511) % Number.MAX_SAFE_INTEGER;
//console.log(seed); // DEBUG
}



// Space Setup
const starsA = [];
const starsB = [];
const starsC = [];
const starsD = [];
const connectionStars = [];

function generateStars(numStars) {
    // Class A stars
    for (let i = 1; i < numStars + 1; i++) {
        seed = seedGen();
        let x = Math.abs(seed) % 100000 / 100000;
        let xVel = 0;
        seed = seedGen();
        let y  = Math.abs(seed) % 100000 / 100000;
        let yVel = 0;
        starsA.push({x, y, xVel, yVel, baseXVel: xVel, baseYVel: yVel, initX: x, initY: y});
    }

    // Class B stars
    for (let i = 1; i < numStars * 10 + 1; i++) {
        seed = seedGen();
        let x = Math.abs(seed) % 100000 / 100000;
        let xVel = 0;
        seed = seedGen();
        let y  = Math.abs(seed) % 100000 / 100000;
        let yVel = 0;
        starsB.push({x, y, xVel, yVel, baseXVel: xVel, baseYVel: yVel, initX: x, initY: y});
    }

    // Class C stars
    for (let i = 1; i < numStars * 100 + 1; i++) {
        seed = seedGen();
        let x = Math.abs(seed) % 100000 / 100000;
        seed = seedGen();
        let y  = Math.abs(seed) % 100000 / 100000;
        starsC.push({x, y});
    }

    // Class D stars
    for (let i = 1; i < numStars * 400 + 1; i++) {
        seed = seedGen();
        let x = Math.abs(seed) % 100000 / 100000;
        seed = seedGen();
        let y  = Math.abs(seed) % 100000 / 100000;
        starsD.push({x, y});
    }

    connectionStars.push(...starsA, ...starsB);
}

generateStars(12); // THIS SHOULD MOVE TO A SETUP LOCATION?
//console.log(starsA); // DEBUG

function drawStars() {
    // Class D
    spctx.fillStyle = "#888888";
    starsD.forEach(star => {
        spctx.beginPath();
        spctx.arc(star.x * spaceCanvas.width, star.y * spaceCanvas.height, screenScale / 2, 0, Math.PI * 2);
        spctx.fill();
    });

    // Class C
    spctx.fillStyle = "#AAAAAA";
    starsC.forEach(star => {
        spctx.beginPath();
        spctx.arc(star.x * spaceCanvas.width, star.y * spaceCanvas.height, screenScale, 0, Math.PI * 2);
        spctx.fill();
    });

    // Class B
    spctx.fillStyle = "#AFAFAF";
    starsB.forEach(star => {
        spctx.beginPath();
        spctx.arc(star.x * spaceCanvas.width, star.y * spaceCanvas.height, screenScale * 2.5, 0, Math.PI * 2);
        spctx.fill();
    });

    // Class A
    spctx.fillStyle = "#FAFAFA";
    starsA.forEach(star => {
        starX = star.x * spaceCanvas.width;
        starY = star.y * spaceCanvas.height;
        starSize = screenScale * 3.2;
        spctx.beginPath();
        spctx.arc(starX, starY, starSize, 0, Math.PI * 2);
        spctx.fill();

        // Draw flare
        const flareSize = starSize * 1.32;
        spctx.lineWidth = screenScale * 1.16;
        spctx.beginPath();
        spctx.moveTo(starX - flareSize, starY);
        spctx.lineTo(starX + flareSize, starY);
        spctx.moveTo(starX, starY - flareSize);
        spctx.lineTo(starX, starY + flareSize);
        spctx.strokeStyle = "#fafafaDD";
        spctx.stroke();
    });
}

function drawConstellations() {
    for (let i = 0; i < connectionStars.length; i++) {
        let star1 = connectionStars[i];
        let x1 = star1.x * spaceCanvas.width;
        let y1 = star1.y * spaceCanvas.height;

        for (let j = i + 1; j < connectionStars.length; j++) {
            let star2 = connectionStars[j];
            let x2 = star2.x * spaceCanvas.width;
            let y2 = star2.y * spaceCanvas.height;

            let distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            if (distance < starDistance) {
                let constellationAlpha = 1 - distance / (starDistance * 1.16);

                spctx.beginPath();
                spctx.moveTo(x1, y1);
                spctx.lineTo(x2, y2);
                spctx.strokeStyle = `rgba(170, 170, 170, ${constellationAlpha})`;
                spctx.lineWidth = constellationAlpha * 0.8;
                spctx.stroke();
            }
        }
    }
}



// Space Canvas Drawing
function drawNightSky() {
    var nightSkyGradient = spctx.createLinearGradient(0, spaceCanvas.height * .1, 0, spaceCanvas.height / 1.25);
    nightSkyGradient.addColorStop(0, "rgb(8, 4, 16)");
    nightSkyGradient.addColorStop(1, "rgb(16, 16, 48)");
    var nightSkyGradient2 = spctx.createLinearGradient(0, spaceCanvas.height * .75, 0, spaceCanvas.height);
    nightSkyGradient2.addColorStop(0, "rgba(16, 16, 48, 0)");
    nightSkyGradient2.addColorStop(1, "rgba(32, 24, 48, 1)");

    //spctx.fillStyle = "rgb(07, 04, 14)"; // DEBUG
    spctx.fillStyle = nightSkyGradient;
    spctx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height);
    spctx.fillStyle = nightSkyGradient2;
    spctx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height);
}

function drawSpace() {
    //spctx.fillStyle = "rgb(07, 04, 14)"; // DEBUG
    //spctx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height); // DEBUG
    drawNightSky();
    drawConstellations();
    drawStars();
}



// FPS counter
const frames = [];
let fps = 0;
function drawFPS(timestamp, frameTime) {
    while (frames.length > 0 && frames[0] <= timestamp - 1000) {
        frames.shift();
    }
    frames.push(timestamp);
    fps = frames.length;
    spctx.fillStyle = "rgb(170, 170, 170)";
    spctx.fillText(fps + " FPS", spaceCanvas.width - 200, 100);
    spctx. fillText("Frame time: " + frameTime + " ms", spaceCanvas.width - 200, 120);
}



// Update Loop
function update() {
    mouseStarInteract();
}



// Animation Loop
function render(timestamp) {
    spctx.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);

    drawSpace();
    
    frameTime = timestamp - prevTimestamp;
    prevTimestamp = timestamp;
    drawFPS(timestamp, frameTime);

    update();

    requestAnimationFrame(render);

    // DEBUG limit frames to Iterations variable #
    // while(iterations < 1) { // DEBUG
    //     requestAnimationFrame(render); // DEBUG
    //     iterations++; // DEBUG
    // }
}
//let iterations = 0; // DEBUG

// Start Animation
requestAnimationFrame(render);



// Mouse, mouse functions, and mouse event listeners
const mouse = {
    x: undefined,
    y: undefined,
    influenceRadius: screenScale * 256
};

function mouseStarInteract() {
    connectionStars.forEach(star => {
        let starScreenX = star.x * spaceCanvas.width;
        let starScreenY = star.y * spaceCanvas.height;
        if (mouse.x !== undefined && mouse.y !== undefined) {
            let distance = Math.sqrt((mouse.x - starScreenX) ** 2 + (mouse.y - starScreenY) ** 2);
            //console.log(mouse.x, mouse.y, distance, mouse.influenceRadius); // DEBUG
            // Mouse Influence
            if (distance < mouse.influenceRadius) {
                const force = (influenceRadius - distance) / influenceRadius;

                // Component Vectors
                let dirX = (mouse.x - starScreenX) / distance;
                let dirY = (mouse.y - starScreenY) / distance;

                // Apply force to vel with accel acceleration
                const accel = .16
                star.xVel += (dirX * force * accel) / spaceCanvas.width;
                star.yVel += (dirY * force * accel) / spaceCanvas.height;

                //console.log(dirX, dirY, mouse.x, star.x, distance); // DEBUG
            } else { // Star reset
                let starScreenInitX = star.initX * spaceCanvas.width;
                let starScreenInitY = star.initY * spaceCanvas.height;
                let distance = Math.sqrt((starScreenInitX - starScreenX) ** 2 + (starScreenInitY - starScreenY) ** 2);
                if (distance > 0) {
                    const force = (((spaceCanvas.width + spaceCanvas.height) / 2) - distance) / ((spaceCanvas.width + spaceCanvas.height) / 2);

                    // Component Vectors
                    let dirX = (starScreenInitX - starScreenX) / distance;
                    let dirY = (starScreenInitY - starScreenY) / distance;

                    // Apply force to vel with accel acceleration
                    const accel = .025
                    star.xVel += (dirX * force * accel) / spaceCanvas.width;
                    star.yVel += (dirY * force * accel) / spaceCanvas.height;
                }
            }
        } else { // Star Reset
            let starScreenInitX = star.initX * spaceCanvas.width;
            let starScreenInitY = star.initY * spaceCanvas.height;
            let distance = Math.sqrt((starScreenInitX - starScreenX) ** 2 + (starScreenInitY - starScreenY) ** 2);
            if (distance > 0) {
                const force = (((spaceCanvas.width + spaceCanvas.height) / 2) - distance) / ((spaceCanvas.width + spaceCanvas.height) / 2);

                // Component Vectors
                let dirX = (starScreenInitX - starScreenX) / distance;
                let dirY = (starScreenInitY - starScreenY) / distance;

                // Apply force to vel with accel acceleration
                const accel = .025
                star.xVel += (dirX * force * accel) / spaceCanvas.width;
                star.yVel += (dirY * force * accel) / spaceCanvas.height;
            }
        }

        // Friction
        star.xVel -= (star.xVel - star.baseXVel) * .064;
        star.yVel -= (star.yVel - star.baseYVel) * .064;

        // Move star
        star.x += star.xVel;
        star.y += star.yVel;

        // Edge wrapping
        if (star.x < 0) star.x = 1;
        if (star.x > 1) star.x = 0;
        if (star.y < 0) star.y = 1;
        if (star.y > 1) star.y = 0;

        //console.log(star); // DEBUG
        //console.log("x, y, xVel, yVel: " + star.x, star.y, star.xVel, star.yVel); // DEBUG
    });
}

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse.x, mouse.y); // DEBUG
});

window.addEventListener("mouseout", () => {
    mouse.x = undefined;
    mouse.y = undefined;
});