var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//sizing the canvas correctly
canvas.height = window.innerHeight * 0.9;
canvas.width = window.innerWidth;
var stage = document.getElementById("stage");

//Arrays of the logic gates and their nodes
var gateElements = Array.from(document.getElementsByClassName("gate"));
var nodeElements = Array.from(
  document.getElementsByClassName("gateInputOutput")
);

//making each gate draggable
gateElements.forEach((gate) => {
    dragElement(gate);
});

let originX, originY;

function checkDragDown(event) {
  originX = event.clientX;
  originY = event.clientY;
}
function checkDragUp(event) {
  if (event.clientX - originX <= 2 && event.clientX - originX >= -2 && event.clientY - originY <= 2 && event.clientY >= -2) {
    gateObject[event.target.id].outputs[0].value = 1;
    if (event.target.style.backgroundColor == "red") {
      event.target.style.backgroundColor = "#04c90b";
      event.target.innerHTML = `
        ON
        <div class="gateInputOutput switchOutput output1 gateOutput"></div>
      `;
    } else {
      event.target.style.backgroundColor = "red";
      event.target.innerHTML = `
        OFF
        <div class="gateInputOutput switchOutput output1 gateOutput"></div>
      `;
    }
  }
}

//object containing all of the logic gates and their nodes
var gateObject = {
  "1": {
    element: document.getElementById("1"),
    type: "and",
    inputs: [
      {
        element: document.getElementById("1").getElementsByClassName("andInput1")[0],
        x: document.getElementById("1").offsetLeft + document.getElementById("1").getElementsByClassName("andInput1")[0].offsetLeft,
        y: document.getElementById("1").offsetTop + document.getElementById("1").getElementsByClassName("andInput1")[0].offsetTop,
      },
      {
        element: document.getElementById("1").getElementsByClassName("andInput2")[0],
        x: document.getElementById("1").offsetLeft + document.getElementById("1").getElementsByClassName("andInput2")[0].offsetLeft,
        y: document.getElementById("1").offsetTop + document.getElementById("1").getElementsByClassName("andInput2")[0].offsetTop,
      },
    ],
    outputs: [
      {
        element: document.getElementById("1").getElementsByClassName("andOutput1")[0],
        x: document.getElementById("1").offsetLeft + document.getElementById("1").getElementsByClassName("andOutput1")[0].offsetLeft,
        y: document.getElementById("1").offsetTop + document.getElementById("1").getElementsByClassName("andOutput1")[0].offsetTop,
        value: 0,
        connections: []
      },
    ],
  },
  "2": {
    element: document.getElementById("2"),
    type: "switch",
    inputs: [],
    outputs: [
      {
        element: document.getElementById("2").getElementsByClassName("switchOutput")[0],
        x: document.getElementById("2").offsetLeft + document.getElementById("2").getElementsByClassName("switchOutput")[0].offsetLeft,
        y: document.getElementById("2").offsetTop + document.getElementById("2").getElementsByClassName("switchOutput")[0].offsetTop,
        value: 0,
        connections: [],
      },
    ],
  },
  "3": {
    element: document.getElementById("3"),
    type: "switch",
    inputs: [],
    outputs: [
      {
        element: document.getElementById("3").getElementsByClassName("switchOutput")[0],
        x: document.getElementById("3").offsetLeft + document.getElementById("3").getElementsByClassName("switchOutput")[0].offsetLeft,
        y: document.getElementById("3").offsetTop + document.getElementById("3").getElementsByClassName("switchOutput")[0].offsetTop,
        value: 0,
        connections: [],
      },
    ],
  }
};

//is the mouse dragging something
var isDragging = false;

//modified drag function from w3schools.com
function dragElement(elmnt) {
  var relX, relY;
  elmnt.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    originX = e.clientX;
    originY = e.clientY
    e.preventDefault();
    // Get the relation between the element and mouse coordinates
    relX = elmnt.offsetLeft - e.clientX;
    relY = elmnt.offsetTop - e.clientY;
    var noDrag = false;
    gateElements.forEach((gate) => {
      Array.from(gate.children).forEach((node, index) => {
        if (
          gate.offsetLeft + node.offsetLeft <= mouse.x &&
          gate.offsetTop + node.offsetTop <= mouse.y &&
          gate.offsetLeft + node.offsetLeft + node.offsetWidth >= mouse.x &&
          gate.offsetTop + node.offsetTop + node.offsetHeight >= mouse.y
        ) {
          noDrag = true;
          if (gate.classList.contains("and")) {
            if (node.classList.contains("gateOutput")) {
                mouse.startNode = [gate.id, index - 1, "gateOutput"];
            } else {
                mouse.startNode = [gate.id, index + 1, "gateInput"];
            }
          } else if (gate.classList.contains("switch")) {
            mouse.startNode = [gate.id, index + 1, "gateOutput"];
          }
        }
      });
    });
    if (!noDrag) {
      isDragging = true;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  }

  function elementDrag(e) {
    e.preventDefault();
    // set the element's new position:
    if (e.clientY + relY < 0) {
      elmnt.style.top = "0px";
    } else if (e.clientY + relY + elmnt.offsetHeight > stage.offsetHeight) {
      elmnt.style.top = stage.offsetHeight - elmnt.offsetHeight + "px";
    } else {
      elmnt.style.top = e.clientY + relY + "px";
    }
    if (e.clientX + relX < 7) {
      elmnt.style.left = "7px";
    } else if (e.clientX + relX + elmnt.offsetWidth + 8 > stage.offsetWidth) {
      elmnt.style.left = stage.offsetWidth - elmnt.offsetWidth - 8 + "px";
    } else {
      elmnt.style.left = e.clientX + relX + "px";
    }
    gateObject[elmnt.id].inputs.forEach((node, index) => {
      node.x = document.getElementById(elmnt.id).offsetLeft + document.getElementById(elmnt.id).getElementsByClassName(`input${index + 1}`)[0].offsetLeft;
      node.y = document.getElementById(elmnt.id).offsetTop + document.getElementById(elmnt.id).getElementsByClassName(`input${index + 1}`)[0].offsetTop;
    });
    gateObject[elmnt.id].outputs.forEach((node, index) => {
      node.x = document.getElementById(elmnt.id).offsetLeft + document.getElementById(elmnt.id).getElementsByClassName(`output${index + 1}`)[0].offsetLeft;
      node.y = document.getElementById(elmnt.id).offsetTop + document.getElementById(elmnt.id).getElementsByClassName(`output${index + 1}`)[0].offsetTop;
    });
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    isDragging = false;
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//data on the mouse's current position
let mouse = {
  isMouseDown: false,
  x: 0,
  y: 0,
  startX: 0,
  startY: 0,
  startNode: [],
  endNode: [],
};

//changing mouse object when the mouse moves
document.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y - stage.offsetTop;
});

//Setting the update interval
setInterval(() => {
  drawCanvas();
}, 10);

//resize the canvas if window resizes
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.9;
});

document.addEventListener("mousedown", (e) => {
  mouse.isMouseDown = true;
  mouse.startX = mouse.x;
  mouse.startY = mouse.y;
});
document.addEventListener("mouseup", (e) => {
  mouse.isMouseDown = false;
  //checks if drawn line connected two nodes
  var madeConnection = false;
  gateElements.forEach((gate) => {
    Array.from(gate.children).forEach((node, index) => {
      if (
        gate.offsetLeft + node.offsetLeft <= mouse.x &&
        gate.offsetTop + node.offsetTop <= mouse.y &&
        gate.offsetLeft + node.offsetLeft + node.offsetWidth >= mouse.x &&
        gate.offsetTop + node.offsetTop + node.offsetHeight >= mouse.y
      ) {
        noDrag = true;
        //edits end node so it can make connections
        if (gate.classList.contains("and")) {
          if (node.classList.contains("gateOutput")) {
            mouse.endNode = [gate.id, index - 1, "gateOutput"];
          } else {
            mouse.endNode = [gate.id, index + 1, "gateInput"];
          }
        } else if (gate.classList.contains("switch")) {
            mouse.endNode = [gate.id, index + 1, "gateOutput"];
        }
      }
    });
  });
  if (mouse.startNode[2] == "gateOutput" && mouse.endNode[2] == "gateInput") {
    gateObject[mouse.startNode[0]].outputs[mouse.startNode[1] - 1].connections.push([mouse.endNode[0], mouse.endNode[1]]);
    madeConnection = true;
  } else if (
    mouse.startNode[2] == "gateInput" &&
    mouse.endNode[2] == "gateOutput"
  ) {
    gateObject[mouse.endNode[0]].outputs[mouse.endNode[1] - 1].connections.push(
      [mouse.startNode[0], mouse.startNode[1]]
    );
    madeConnection = true;
  }
  mouse.startNode = [];
  mouse.endNode = [];
  if (!isDragging && !madeConnection) {
    lines.push([mouse.startX, mouse.startY, mouse.x, mouse.y]);
  }
});

var lines = [];

function drawCanvas() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = "5";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (mouse.isMouseDown && !isDragging) {
    ctx.beginPath();
    var isSelected = false;
    nodeElements.forEach((element) => {
      if (
        element.parentElement.offsetLeft + element.offsetLeft <= mouse.startX &&
        element.parentElement.offsetTop + element.offsetTop <= mouse.startY &&
        element.parentElement.offsetLeft + element.offsetLeft + element.offsetWidth >= mouse.startX &&
        element.parentElement.offsetTop + element.offsetTop + element.offsetHeight >= mouse.startY
      ) {
        isSelected = true;
        mouse.startX = element.offsetLeft + element.parentElement.offsetLeft + Math.floor(element.offsetWidth / 2);
        mouse.startY = element.offsetTop + element.parentElement.offsetTop + Math.floor(element.offsetHeight / 2);
      }
    });
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

  var gates = Object.values(gateObject);

  gates.forEach((gate) => {
    gate.outputs.forEach((node) => {
      node.connections.forEach((connection) => {
        ctx.beginPath();
        ctx.moveTo(
          node.x + Math.floor(node.element.offsetWidth / 2),
          node.y + Math.floor(node.element.offsetHeight / 2)
        );
        ctx.lineTo(
            document.getElementById(connection[0]).offsetLeft +
            document.getElementById(connection[0]).getElementsByClassName(`input${connection[1]}`)[0].offsetLeft + Math.floor(document.getElementById(connection[0]).getElementsByClassName(`input${connection[1]}`)[0].offsetWidth / 2),
            document.getElementById(connection[0]).offsetTop +
            document.getElementById(connection[0]).getElementsByClassName(`input${connection[1]}`)[0].offsetTop + Math.floor(document.getElementById(connection[0]).getElementsByClassName(`input${connection[1]}`)[0].offsetHeight / 2)
        );
        ctx.stroke();
      });
    });
  });
}
