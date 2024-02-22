var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.height = window.innerHeight * .9;
canvas.width = window.innerWidth;
var stage = document.getElementById("stage");

var test1 = document.getElementById("test1");
var test2 = document.getElementById("test2");

var test = document.getElementById("cricutName");
let mouse = {
    isMouseDown: false,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
}

document.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y - stage.offsetTop;
});

//Setting the update interval
setInterval(() => {
    drawCanvas();
}, 15);

//resize the canvas if window resizes
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * .9;
});

document.addEventListener("mousedown", (e) => {
    mouse.isMouseDown = true;
    mouse.startX = mouse.x;
    mouse.startY = mouse.y;
});
document.addEventListener("mouseup", (e) => {
    mouse.isMouseDown = false;
    lines.push([mouse.startX, mouse.startY, mouse.x, mouse.y]);
});

var lines = []

function drawCanvas() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = "5";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mouse.isMouseDown) {
        ctx.beginPath();
        ctx.moveTo(mouse.startX, mouse.startY);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }
    lines.forEach((value) => {
        ctx.beginPath();
        ctx.moveTo(value[0], value[1]);
        ctx.lineTo(value[2], value[3]);
        ctx.stroke();
    });
}