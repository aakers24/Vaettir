// Canvas Setup
const spaceCanvas = document.getElementById("spaceCanvas");
let spctx = spaceCanvas.getContext("2d");
let seed = seedGen();
let screenScale = 0;
let starDistance = 0;
let frameTime = 0;
let prevTimestamp = 0;
let scrolling = 0;
let scrollPos = 0;
let prevPointerY = 0;
let headerSpaceX = 0;
let headerSpaceY = 0;
let fontSize = 0;
let totalHeaders = 0;


// Dynamic canvas sizing
function resizeCanvas() {
    spaceCanvas.width = spaceCanvas.clientWidth;
    spaceCanvas.height = spaceCanvas.clientHeight;
    screenScale = Math.max(.64, Math.min(spaceCanvas.width / 2048, 1.16));
    starDistance = spaceCanvas.width > spaceCanvas.height ? screenScale * spaceCanvas.width / 8 : screenScale * spaceCanvas.height / 8;
    pointer.influenceRadius = spaceCanvas.width > spaceCanvas.height ? screenScale * spaceCanvas.width / 8 : screenScale * spaceCanvas.height / 8;
    fontSize = Math.ceil(screenScale * 24);

    // Headers
    headerSpaceX = spaceCanvas.width * .86;
    headerSpaceY = spaceCanvas.height * .86;
    headers.forEach((header) => {
        let coords = calcHeaderLocation(header);
        let x = coords.x;
        let y = coords.y;
        header.x = x;
        header.y = y;
    });
}

// Dynamic canvas resizing
window.addEventListener("resize", resizeCanvas);



// Procedural Randomness Generator
function seedGen() {
return (Math.random() * Math.random() * 8821 * 43481 * 51659 * 73476511) % Number.MAX_SAFE_INTEGER;
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
    for (let i = 1; i < numStars * 256 + 1; i++) {
        seed = seedGen();
        let x = Math.abs(seed) % 100000 / 100000;
        seed = seedGen();
        let y  = Math.abs(seed) % 100000 / 100000;
        starsD.push({x, y});
    }

    connectionStars.push(...starsA, ...starsB);
}



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



// Shooting stars
const shootingStars = new Set();
function generateShootingStar(){
    seed = seedGen();
    let start = Math.abs(seed) % 100000 / 100000;
    seed = seedGen();
    let dX = (Math.abs(seed) % 100000 / 100000) % .01;
    seed = seedGen();
    let dY = (Math.abs(seed) % 100000 / 100000) % .01;
    let x = 0;
    let y = 0;

    if(start < .25) {
        seed = seedGen();
        x = (Math.abs(seed) % 100000 / 100000);

        dY = dY > 0 ? dY : -dY;
    } else if(start >= .25 && start < .5) {
        seed = seedGen();
        x = 1;
        y = (Math.abs(seed) % 100000 / 100000);

        dX = dX > 0 ? -dX : dX;
    } else if(start >= .5 && start < .75 ) {
        seed = seedGen();
        x = (Math.abs(seed) % 100000 / 100000);
        y = 1;

        dY = dY > 0 ? -dY : dY;
    } else {
        seed = seedGen();
        y = (Math.abs(seed) % 100000 / 100000);

        dX = dX > 0 ? dX : -dX;
    }

    shootingStars.add({x, y, dX, dY});
}

function drawShootingStars() {
    shootingStars.forEach((star) => {
        // Draw the star
        let vel = Math.max(star.dX, star.dY);
        let brightness = Math.floor(Math.abs(vel * 100 * 256));
        let brightnessHex = brightness.toString(16);
        let screenX = star.x * spaceCanvas.width;
        let screenY = star.y * spaceCanvas.height;
        let trailLength = 16;
        let trailX = star.dX * spaceCanvas.width * trailLength;
        let trailY = star.dY * spaceCanvas.height * trailLength;

        // spctx.fillStyle = `#${brightnessHex}${brightnessHex}${brightnessHex}`;
        // spctx.beginPath();
        // spctx.arc(screenX, screenY, screenScale * 4, 0, Math.PI * 2);
        // spctx.fill();

        // Draw the trail
        spctx.beginPath();
        spctx.moveTo(screenX, screenY);
        spctx.lineTo((screenX - trailX), (screenY - trailY));
        let trail = spctx.createLinearGradient(screenX, screenY, trailX, trailY);
        trail.addColorStop(1, `#${brightnessHex}${brightnessHex}${brightnessHex}`);
        trail.addColorStop(0, `#${brightnessHex}${brightnessHex}${brightnessHex}${brightnessHex}`);
        spctx.strokeStyle = trail;
        spctx.lineWidth = screenScale * 4;
        spctx.stroke();

        // Update the star
        star.x += star.dX;
        star.y += star.dY;
        if(star.x < -.16 || star.x > 1.16 || star.y < -.16 || star.y > 1.16) {
            shootingStars.delete(star);
        }
    });
}



// Generate Headers
const headers = [];
function generateHeader(name, link) {
    // Generate Hex version of name
    name = name.toString().toUpperCase();
    let nameArray = [...name];
    let nameArray2 = [];
    nameArray.forEach((char) => {
        nameArray2.push(char);
        for(let i = 0; i < 3; i++){
            nameArray2.push(".");
        }
    });

    let hexArray = [];
    for (let i = 0; i < name.length; i++) {
        hexArray[i] = "0x" + name.charCodeAt(i).toString(16);
    }
    let hexName = hexArray.join("");



    // Generate Location
    let initX = -1;
    let initY = -1;
    let rounds = 8;

    if(headers.length === 0) {
        seed = seedGen();
        initX = (Math.abs(seed) % 100000 / 100000);
        seed = seedGen();
        initY  = (((Math.abs(seed) % 100000 / 100000) % (1 / totalHeaders)));
    } else {
        let max = -1;

        for (let i = 0; i < rounds; i++) {
            seed = seedGen();
            let thisX = (Math.abs(seed) % 100000 / 100000);
            seed = seedGen();
            let thisY = ((Math.abs(seed) % 100000 / 100000) % (1 / totalHeaders)) + ((1 / totalHeaders) * headers.length);
            let smallestDistance = 2;

            for(let h of headers) {
                let dX = thisX - h.initX;
                let dY = thisY - h.initY;
                let distance = Math.sqrt((dX ** 2) + (dY ** 2));

                if (distance < smallestDistance) {
                    smallestDistance = distance;
                }
            }

            if (smallestDistance > max) {
                max = smallestDistance;
                initX = thisX;
                initY = thisY;
            }
        }
    }

    let coords = calcHeaderLocation({name, hexName, initX, initY});
    let x = coords.x;
    let y = coords.y;



    return {name, hexName, link, x, y, initX, initY};

}

function calcHeaderLocation(header) {
    spctx.font = `${fontSize}px 'Courier New', Courier, monospace`;
    const headerWidth = spctx.measureText(header.hexName).width;
    const headerHeight = spctx.measureText(header.hexName).actualBoundingBoxAscent;
    let headerX = header.initX * headerSpaceX;
    let headerY = header.initY * headerSpaceY;
    
    if(headerWidth + headerX > headerSpaceX) {
        headerX -= (headerWidth + headerX) - spaceCanvas.width;
    }
    if(headerY - headerHeight < spaceCanvas.height - headerSpaceY) {
        headerY += headerHeight;
    } else if (headerY + headerHeight > headerSpaceY) {
        headerY -= headerHeight;
    }
    
    x = headerX;
    y = headerY;

    return {x, y};
}



function drawHeaders(){
    headers.forEach((header) => {
        spctx.font = `${fontSize}px 'Courier New', Courier, monospace`;
        spctx.fillStyle = "rgb(216, 216, 216)";

        const headerWidth = spctx.measureText(header.hexName).width;
        const headerHeight = spctx.measureText(header.hexName).actualBoundingBoxAscent;

        let headerX = header.x;
        let headerY = header.y;

        for(let i = 0; i < header.name.length; i++) {
            let plainChunk = header.name[i];

            let hexChunk = header.hexName.substring(i * 3, (i * 3) + 3);

            let chunkWidth = spctx.measureText(hexChunk).width;
            let chunkPosX = headerX + (chunkWidth * i) + (chunkWidth / 2);
            let distance = Math.sqrt(((pointer.x - chunkPosX) ** 2) + ((pointer.y - headerY) ** 2));



            // Decrypt from scrolling
            let scrollPage = Math.abs(Math.floor(scrollPos / spaceCanvas.height));
            let pageSpot = Math.abs(scrollPos % spaceCanvas.height);
            if(Math.floor(scrollPos / spaceCanvas.height) === -1) {
                spctx.fillText(hexChunk, headerX + (chunkWidth * i), headerY);
                continue;
            }
            if(scrollPage % 2 == 0 && pageSpot > headerY) {
                let centered = chunkPosX  - (spctx.measureText(plainChunk).width / 2);

                spctx.fillText(plainChunk, centered, headerY);
                continue;
            } else if(scrollPage % 2 == 1 && pageSpot < headerY) {
                let centered = chunkPosX  - (spctx.measureText(plainChunk).width / 2);

                spctx.fillText(plainChunk, centered, headerY);
                continue;
            } else { // If scrolling isn't decrypting, see if mouse will
                // If close enough, draw plain
                if(distance < (pointer.influenceRadius * .75)) {
                    let centered = chunkPosX  - (spctx.measureText(plainChunk).width / 2);

                    spctx.fillText(plainChunk, centered, headerY);
                } else { // If not close enough, keep encrypted 
                    spctx.fillText(hexChunk, headerX + (chunkWidth * i), headerY);
                }
                continue;
            }
        }
    });
}



// Generate 
// FPS counter
const frames = [];
let fps = 0;
function drawFPS(timestamp, frameTime) {
    while (frames.length > 0 && frames[0] <= timestamp - 1000) {
        frames.shift();
    }
    frames.push(timestamp);
    fps = frames.length;
    spctx.font = "10px 'Courier New', Courier, monospace";
    spctx.fillStyle = "rgb(170, 170, 170)";
    spctx.fillText(fps + " FPS", spaceCanvas.width - 200, 100);
    spctx. fillText("Frame time: " + frameTime + " ms", spaceCanvas.width - 200, 120);
}



// Update Loop
function update() {
    mouseStarInteract();
    if(scrolling !== 0) {
        scrollStarInteract();
        scrolling = Math.max(0, Math.floor(scrolling / 2));
    }

    seed = seedGen();
    let newShootingStar = ((seed % 100000) / 100000) > .99936 ? 1 : 0;
    if(newShootingStar === 1) generateShootingStar();
}



// Animation Loop
function render(timestamp) {
    spctx.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);

    drawSpace();

    drawShootingStars();

    drawHeaders();
    
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
const pointer = {
    x: undefined,
    y: undefined,
    influenceRadius: spaceCanvas.width > spaceCanvas.height ? screenScale * spaceCanvas.width / 8 : screenScale * spaceCanvas.height / 8
};

const activePointers = [];

function mouseStarInteract() {
    //console.log(pointer.x, pointer.y); // DEBUG
    connectionStars.forEach(star => {
        let starScreenX = star.x * spaceCanvas.width;
        let starScreenY = star.y * spaceCanvas.height;
        if (pointer.x !== undefined && pointer.y !== undefined) {
            let distance = Math.sqrt((pointer.x - starScreenX) ** 2 + (pointer.y - starScreenY) ** 2);
            // Mouse Influence
            if (distance < pointer.influenceRadius) {
                const force = (pointer.influenceRadius - distance) / pointer.influenceRadius;

                // Component Vectors
                let dirX = (pointer.x - starScreenX) / distance;
                let dirY = (pointer.y - starScreenY) / distance;

                // Apply force to vel with accel acceleration
                const accel = .16
                star.xVel += (dirX * force * accel) / spaceCanvas.width;
                star.yVel += (dirY * force * accel) / spaceCanvas.height;
            } else { // Star reset
                starReset(star);
            }
        } else { // Star Reset
            starReset(star);
        }

        // Friction
        star.xVel -= (star.xVel - star.baseXVel) * .064;
        star.yVel -= (star.yVel - star.baseYVel) * .064;

        // Move star
        star.x += star.xVel;
        star.y += star.yVel;

        // Edge wrapping / handling
        if (star.x < 0) star.x = 1;
        if (star.x > 1) star.x = 0;
        if (star.y < 0) star.y = 1;
        if (star.y > 1) star.y = 0;
    });
}

function starReset(star) {
    let ndX = star.initX - star.x;
    let ndY = star.initY - star.y;

    // Account for distance across the edges of the screen
    if (ndX > .5) ndX -= 1;
    if (ndX < -.5) ndX += 1;
    if (ndY > .5) ndY -= 1;
    if (ndY < -.5) ndY += 1;

    let normDistance = Math.sqrt((ndX ** 2) + (ndY ** 2));
    
    const force = .64;

    // Component Vectors
    let normDirX = normDistance > 0 ? (ndX / normDistance) : 0;
    let normDirY = normDistance > 0 ? (ndY / normDistance) : 0;


    // Apply force to vel with accel acceleration
    let accel = normDistance * .0032;
    star.xVel += (normDirX * force * accel);
    star.yVel += (normDirY * force * accel);
}

spaceCanvas.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;

    if(prevPointerY !== 0 && event.pointerType !== "mouse" && activePointers.length === 1) {
        const drag = prevPointerY - event.clientY;
        scrolling += drag;
        prevPointerY = event.clientY;

        scrollPos += drag;
    }
});

spaceCanvas.addEventListener("pointerleave", (event) => {
    pointerReset();
    activePointers.pop();
});

spaceCanvas.addEventListener("pointerdown", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;

    prevPointerY = event.clientY;
    activePointers.push(1);
});

spaceCanvas.addEventListener("pointerup", (event) => {
    if(event.pointerType === "mouse") {

    } else {
        pointerReset();
    }
    activePointers.pop();
});

spaceCanvas.addEventListener("pointercancel", () => {
    if(event.pointerType === "mouse") {

    } else {
        pointerReset();
    }
    activePointers.pop();
});

spaceCanvas.addEventListener("wheel", (event) => {
    scrolling += event.deltaY;

    scrollPos += event.deltaY;
}, {passive: true});



function pointerReset() {
    pointer.x = undefined;
    pointer.y = undefined;
    prevPointerY = 0;
}



// Scroll
function scrollStarInteract() {
    if (scrolling === 0) {
        return;
    } else {
        connectionStars.forEach(star => {
            let scrollVel = (scrolling) / (4096);
            star.yVel += scrollVel;

            // Friction
            star.xVel -= (star.xVel - star.baseXVel) * .064;
            star.yVel -= (star.yVel - star.baseYVel) * .064;

            // Move star
            star.x += star.xVel;
            star.y += star.yVel;

            // Edge wrapping / handling
            if (star.x < 0) star.x = 1;
            if (star.x > 1) star.x = 0;
            if (star.y < 0) star.y = 1;
            if (star.y > 1) star.y = 0;
        });
    }
}



// Mobile
spaceCanvas.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("contextmenu", e => e.preventDefault());
screen.orientation.addEventListener("change", resizeCanvas);



// -------- SETUP CODE --------

// Initalization resize event
resizeCanvas();

// Generate Components
generateStars(12);

// DEFINE HARDCODED HEADERS
totalHeaders = 4;
headers.push(generateHeader("Vaettir", "EotN"));
headers.push(generateHeader("Vaettir2", "EotN"));
headers.push(generateHeader("Vaettir3", "EotN"));
headers.push(generateHeader("Vaettir4", "EotN"));

// Reload/resize for mobile
window.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            resizeCanvas();
        });
    });
});
// -------- SETUP CODE --------