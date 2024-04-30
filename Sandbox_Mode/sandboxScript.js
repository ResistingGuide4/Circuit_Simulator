var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//sizing the canvas correctly
canvas.height = window.innerHeight * 0.8;
canvas.width = window.innerWidth;
var stage = document.getElementById("stage");
var gateContainer = document.getElementById("gateContainer");
var circuitName = document.getElementById("circuitName");

var saveFile = JSON.parse(localStorage.getItem("saveFile") || '{"username": "User","levelsFinished": 0,"circuits": {}}')

//object containing all of the logic gates and their nodes
var gateObject = {};

var availableIds = []
var nextId = 0;

if (localStorage.selectedCircuit) {
    circuitName.innerText = localStorage.selectedCircuit;
    gateObject = saveFile.circuits[localStorage.selectedCircuit];
    Object.values(saveFile.circuits[localStorage.selectedCircuit]).forEach((gate, index) => {
        if (parseInt(Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]) >= nextId) {
            nextId = parseInt(Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]) + 1;
        }
        switch (gate.type) {
            case "switch":
                gateContainer.innerHTML += `
                    <div onmousedown="checkDragDown(event)" onmouseup="checkDragUp(event)" class="switch gate" id="${Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]}" style="left:${gate.x}px; top: ${gate.y}px; background-color: ${gate.outputs[0].value == 1 ? "#04c90b" : "red"}">
                        ${gate.outputs[0].value == 1 ? "ON" : "OFF"}
                        <div class="gateInputOutput switchOutput output1 gateOutput"></div>
                    </div>
                `
                break;
            case "light":
                gateContainer.innerHTML += `
                    <div class="light gate" id="${Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]}" style="left:${gate.x}px; top: ${gate.y}px;  background-color: ${gate.inputs[0].value == 1 ? "#04c90b" : "red"}">
                        ${gate.inputs[0].value == 1 ? "ON" : "OFF"}
                        <div class="gateInputOutput lightInput input1 gateInput"></div>
                    </div>
                `
                break;
            case "and":
                gateContainer.innerHTML += `
                    <div class="and gate" id="${Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]}" style="left:${gate.x}px; top: ${gate.y}px;">
                        <div class="gateInputOutput andInput1 input1 gateInput"></div>
                        <div class="gateInputOutput andInput2 input2 gateInput"></div>
                        AND
                        <div class="gateInputOutput andOutput1 output1 gateOutput"></div>
                    </div>
                `;
                break;
            case "or":
                gateContainer.innerHTML += `
                    <div class="and gate" id="${Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]}" style="left:${e.clientX - relX}px; top: ${e.clientY - relY - window.innerHeight * 0.2}px;">
                        <div class="gateInputOutput andInput1 input1 gateInput"></div>
                        <div class="gateInputOutput andInput2 input2 gateInput"></div>
                        AND
                        <div class="gateInputOutput andOutput1 output1 gateOutput"></div>
                    </div>
                `;
                break;
            case "not":
                gateContainer.innerHTML += `
                    <div class="not gate" id="${Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]}" style="left:${gate.x}px; top: ${gate.y}px;">
                        <div class="gateInputOutput notInput input1 gateInput"></div>
                        NOT
                        <div class="gateInputOutput notOutput output1 gateOutput"></div>
                    </div>
                `;
                break;
            case "xor":
                gateContainer.innerHTML += `
                    <div class="xor gate" id="${Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]}" style="left:${gate.x}px; top: ${gate.y}px;">
                        <div class="gateInputOutput xorInput1 input1 gateInput"></div>
                        <div class="gateInputOutput xorInput2 input2 gateInput"></div>
                        XOR
                        <div class="gateInputOutput xorOutput1 output1 gateOutput"></div>
                    </div>
                `;
                break;
            case "nand":
                gateContainer.innerHTML += `
                    <div class="nand gate" id="${Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]}" style="left:${gate.x}px; top: ${gate.y}px;">
                        <div class="gateInputOutput nandInput1 input1 gateInput"></div>
                        <div class="gateInputOutput nandInput2 input2 gateInput"></div>
                        NAND
                        <div class="gateInputOutput nandOutput1 output1 gateOutput"></div>
                    </div>
                `;
                break;
            case "nor":
                gateContainer.innerHTML += `
                    <div class="nor gate" id="${Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]}" style="left:${gate.x}px; top: ${gate.y}px;">
                        <div class="gateInputOutput norInput1 input1 gateInput"></div>
                        <div class="gateInputOutput norInput2 input2 gateInput"></div>
                        NOR
                        <div class="gateInputOutput norOutput1 output1 gateOutput"></div>
                    </div>
                `;
                break;
            case "xnor":
                gateContainer.innerHTML += `
                    <div class="xnor gate" id="${Object.keys(saveFile.circuits[localStorage.selectedCircuit])[index]}" style="left:${gate.x}px; top: ${gate.y}px;">
                        <div class="gateInputOutput xnorInput1 input1 gateInput"></div>
                        <div class="gateInputOutput xnorInput2 input2 gateInput"></div>
                        XNOR
                        <div class="gateInputOutput xnorOutput1 output1 gateOutput"></div>
                    </div>
                `;
            break;
        }
    });
}

function saveCircuit() {
    if (localStorage.selectedCircuit == "") {
        rename();
    }
    saveFile.circuits[localStorage.selectedCircuit] = gateObject;
    localStorage.saveFile = JSON.stringify(saveFile);
}

function saveToFile() {
    const blob = new Blob([JSON.stringify(saveFile)], { type: 'application/json' });
    downloadBlob(blob, "SaveFile")
}

function rename() {
    var name = prompt("Enter the new name: ");
    if (name == "") {
        alert("Please enter a valid name with at least one character");
        rename();
    } else if (localStorage.selectedCircuit == "") {
        localStorage.selectedCircuit = name;
        circuitName.innerText = name;
    } else if (name !== localStorage.selectedCircuit) {
        Object.defineProperty(saveFile.circuits, name,
            Object.getOwnPropertyDescriptor(saveFile.circuits, localStorage.selectedCircuit));
        delete saveFile.circuits[localStorage.selectedCircuit];
        localStorage.selectedCircuit = name;
        circuitName.innerText = name;
    }
}

function downloadBlob(blob, filename) {
    // Create an object URL for the blob object
    const url = URL.createObjectURL(blob);

    // Create a new anchor element
    const a = document.createElement('a');

    // Set the href and download attributes for the anchor element
    // You can optionally set other attributes like `title`, etc
    // Especially, if the anchor element will be attached to the DOM
    a.href = url;

    a.download = filename || 'SaveFile';

    // Click handler that releases the object URL after the element has been clicked
    // This is required for one-off downloads of the blob content
    const clickHandler = () => {
        setTimeout(() => {
            URL.revokeObjectURL(url);
            removeEventListener('click', clickHandler);
        }, 150);
    };

    // Add the click event listener on the anchor element
    // Comment out this line if you don't want a one-off download of the blob content
    a.addEventListener('click', clickHandler, false);

    a.click();
}

//Arrays of the logic gates and their nodes
var gateElements = document.getElementsByClassName("gate");
var nodeElements = document.getElementsByClassName("gateInputOutput");

//making each gate draggable
Array.from(gateElements).forEach((gate) => {
    dragElement(gate);
});

let originX, originY;

function checkDragDown(event) {
    originX = event.clientX;
    originY = event.clientY;
}
function checkDragUp(event) {
    if (event.clientX - originX <= 2 && event.clientX - originX >= -2 && event.clientY - originY <= 2 && event.clientY >= -2) {
        mouse.startX = 0;
        mouse.startY = 0;
        if (gateObject[event.target.id].outputs[0].value == 0) {
            event.target.style.backgroundColor = "#04c90b";
            event.target.innerHTML = `
        ON
        <div class="gateInputOutput switchOutput output1 gateOutput"></div>
      `;
            gateObject[event.target.id].outputs[0].value = 1;
            gateObject[event.target.id].outputs[0].element = document.getElementById(event.target.id).children[0];
            gateObject[event.target.id].outputs[0].connections.forEach((value) => {
                gateObject[value[0]].inputs[value[1] - 1].value = 1;
                updateGate(value[0]);
            });
        } else {
            event.target.style.backgroundColor = "red";
            event.target.innerHTML = `
        OFF
        <div class="gateInputOutput switchOutput output1 gateOutput"></div>
      `;
            gateObject[event.target.id].outputs[0].value = 0;
            gateObject[event.target.id].outputs[0].element = document.getElementById(event.target.id).children[0];
            gateObject[event.target.id].outputs[0].connections.forEach((value) => {
                gateObject[value[0]].inputs[value[1] - 1].value = 0;
                updateGate(value[0]);
            });
        }
    }
}

function previewDrag(e) {
    var classList = e.target.classList;
    var pBoundingRect = e.target.getBoundingClientRect();
    var relX = e.clientX - pBoundingRect.left, relY = e.clientY - pBoundingRect.top;
    var gate;
    switch (true) {
        case classList.contains("pSwitch"):
            gateContainer.innerHTML += `
        <div onmousedown="checkDragDown(event)" onmouseup="checkDragUp(event)" class="switch gate" id="${nextId}" style="left:${e.clientX - relX}px; top: ${e.clientY - relY - window.innerHeight * 0.2}px;">
          OFF
          <div class="gateInputOutput switchOutput output1 gateOutput"></div>
        </div>
      `
            gate = {
                element: document.getElementById(nextId),
                x: document.getElementById(nextId).offsetLeft,
                y: document.getElementById(nextId).offsetTop,
                type: "switch",
                inputs: [],
                outputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("switchOutput")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("switchOutput")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("switchOutput")[0].offsetTop,
                        value: 0,
                        connections: [],
                    },
                ],
            }
            gateObject[nextId.toString()] = gate;
            break;
        case classList.contains("pLight"):
            gateContainer.innerHTML += `
        <div class="light gate" id="${nextId}" style="left:${e.clientX - relX}px; top: ${e.clientY - relY - window.innerHeight * 0.2}px;">
          OFF
          <div class="gateInputOutput lightInput input1 gateInput"></div>
        </div>
      `
            gate = {
                element: document.getElementById(nextId),
                x: document.getElementById(nextId).offsetLeft,
                y: document.getElementById(nextId).offsetTop,
                type: "light",
                inputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("lightInput")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("lightInput")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("lightInput")[0].offsetTop,
                        value: 0,
                        connections: [],
                    },
                ],
                outputs: [],
            }
            gateObject[nextId.toString()] = gate;
            break;
        case classList.contains("pAnd"):
            gateContainer.innerHTML += `
        <div class="and gate" id="${nextId}" style="left:${e.clientX - relX}px; top: ${e.clientY - relY - window.innerHeight * 0.2}px;">
          <div class="gateInputOutput andInput1 input1 gateInput"></div>
          <div class="gateInputOutput andInput2 input2 gateInput"></div>
          AND
          <div class="gateInputOutput andOutput1 output1 gateOutput"></div>
        </div>
      `;
            gate = {
                element: document.getElementById(nextId),
                x: document.getElementById(nextId).offsetLeft,
                y: document.getElementById(nextId).offsetTop,
                type: "and",
                inputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("andInput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("andInput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("andInput1")[0].offsetTop,
                        value: 0
                    },
                    {
                        element: document.getElementById(nextId).getElementsByClassName("andInput2")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("andInput2")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("andInput2")[0].offsetTop,
                        value: 0
                    }
                ],
                outputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("andOutput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("andOutput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("andOutput1")[0].offsetTop,
                        value: 0,
                        connections: [],
                    },
                ]
            };
            gateObject[nextId.toString()] = gate;
            break;
        case classList.contains("pOr"):
            gateContainer.innerHTML += `
        <div class="or gate" id="${nextId}" style="left:${e.clientX - relX}px; top: ${e.clientY - relY - window.innerHeight * 0.2}px;">
          <div class="gateInputOutput orInput1 input1 gateInput"></div>
          <div class="gateInputOutput orInput2 input2 gateInput"></div>
          OR
          <div class="gateInputOutput orOutput1 output1 gateOutput"></div>
        </div>
      `;
            gate = {
                element: document.getElementById(nextId),
                x: document.getElementById(nextId).offsetLeft,
                y: document.getElementById(nextId).offsetTop,
                type: "or",
                inputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("orInput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("orInput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("orInput1")[0].offsetTop,
                        value: 0
                    },
                    {
                        element: document.getElementById(nextId).getElementsByClassName("orInput2")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("orInput2")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("orInput2")[0].offsetTop,
                        value: 0
                    }
                ],
                outputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("orOutput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("orOutput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("orOutput1")[0].offsetTop,
                        value: 0,
                        connections: [],
                    },
                ]
            };
            gateObject[nextId.toString()] = gate;
            break;
        case classList.contains("pNot"):
            gateContainer.innerHTML += `
                <div class="not gate" id="${nextId}" style="left:${e.clientX - relX}px; top: ${e.clientY - relY - window.innerHeight * 0.2}px;">
                    <div class="gateInputOutput notInput input1 gateInput"></div>
                    NOT
                    <div class="gateInputOutput notOutput output1 gateOutput"></div>
                </div>
            `;
            gate = {
                element: document.getElementById(nextId),
                x: document.getElementById(nextId).offsetLeft,
                y: document.getElementById(nextId).offsetTop,
                type: "not",
                inputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("notInput")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("notInput")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("notInput")[0].offsetTop,
                        value: 0
                    }
                ],
                outputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("notOutput")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("notOutput")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("notOutput")[0].offsetTop,
                        value: 0,
                        connections: [],
                    },
                ]
            };
            gateObject[nextId.toString()] = gate;
            break;
        case classList.contains("pXor"):
            gateContainer.innerHTML += `
        <div class="xor gate" id="${nextId}" style="left:${e.clientX - relX}px; top: ${e.clientY - relY - window.innerHeight * 0.2}px;">
          <div class="gateInputOutput xorInput1 input1 gateInput"></div>
          <div class="gateInputOutput xorInput2 input2 gateInput"></div>
          XOR
          <div class="gateInputOutput xorOutput1 output1 gateOutput"></div>
        </div>
      `;
            gate = {
                element: document.getElementById(nextId),
                x: document.getElementById(nextId).offsetLeft,
                y: document.getElementById(nextId).offsetTop,
                type: "xor",
                inputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("xorInput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("xorInput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("xorInput1")[0].offsetTop,
                        value: 0
                    },
                    {
                        element: document.getElementById(nextId).getElementsByClassName("xorInput2")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("xorInput2")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("xorInput2")[0].offsetTop,
                        value: 0
                    }
                ],
                outputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("xorOutput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("xorOutput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("xorOutput1")[0].offsetTop,
                        value: 0,
                        connections: [],
                    },
                ]
            };
            gateObject[nextId.toString()] = gate;
            break;
        case classList.contains("pNand"):
            gateContainer.innerHTML += `
        <div class="nand gate" id="${nextId}" style="left:${e.clientX - relX}px; top: ${e.clientY - relY - window.innerHeight * 0.2}px;">
          <div class="gateInputOutput nandInput1 input1 gateInput"></div>
          <div class="gateInputOutput nandInput2 input2 gateInput"></div>
          NAND
          <div class="gateInputOutput nandOutput1 output1 gateOutput"></div>
        </div>
      `;
            gate = {
                element: document.getElementById(nextId),
                x: document.getElementById(nextId).offsetLeft,
                y: document.getElementById(nextId).offsetTop,
                type: "nand",
                inputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("nandInput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("nandInput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("nandInput1")[0].offsetTop,
                        value: 0
                    },
                    {
                        element: document.getElementById(nextId).getElementsByClassName("nandInput2")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("nandInput2")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("nandInput2")[0].offsetTop,
                        value: 0
                    }
                ],
                outputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("nandOutput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("nandOutput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("nandOutput1")[0].offsetTop,
                        value: 0,
                        connections: [],
                    },
                ]
            };
            gateObject[nextId.toString()] = gate;
            break;
        case classList.contains("pNor"):
            gateContainer.innerHTML += `
        <div class="nor gate" id="${nextId}" style="left:${e.clientX - relX}px; top: ${e.clientY - relY - window.innerHeight * 0.2}px;">
          <div class="gateInputOutput norInput1 input1 gateInput"></div>
          <div class="gateInputOutput norInput2 input2 gateInput"></div>
          NOR
          <div class="gateInputOutput norOutput1 output1 gateOutput"></div>
        </div>
      `;
            gate = {
                element: document.getElementById(nextId),
                x: document.getElementById(nextId).offsetLeft,
                y: document.getElementById(nextId).offsetTop,
                type: "nor",
                inputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("norInput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("norInput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("norInput1")[0].offsetTop,
                        value: 0
                    },
                    {
                        element: document.getElementById(nextId).getElementsByClassName("norInput2")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("norInput2")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("norInput2")[0].offsetTop,
                        value: 0
                    }
                ],
                outputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("norOutput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("norOutput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("norOutput1")[0].offsetTop,
                        value: 0,
                        connections: [],
                    },
                ]
            };
            gateObject[nextId.toString()] = gate;
            break;
        case classList.contains("pXnor"):
            gateContainer.innerHTML += `
          <div class="xnor gate" id="${nextId}" style="left:${e.clientX - relX}px; top: ${e.clientY - relY - window.innerHeight * 0.2}px;">
            <div class="gateInputOutput xnorInput1 input1 gateInput"></div>
            <div class="gateInputOutput xnorInput2 input2 gateInput"></div>
            XNOR
            <div class="gateInputOutput xnorOutput1 output1 gateOutput"></div>
          </div>
        `;
            gate = {
                element: document.getElementById(nextId),
                x: document.getElementById(nextId).offsetLeft,
                y: document.getElementById(nextId).offsetTop,
                type: "xnor",
                inputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("xnorInput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("xnorInput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("xnorInput1")[0].offsetTop,
                        value: 0
                    },
                    {
                        element: document.getElementById(nextId).getElementsByClassName("xnorInput2")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("xnorInput2")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("xnorInput2")[0].offsetTop,
                        value: 0
                    }
                ],
                outputs: [
                    {
                        element: document.getElementById(nextId).getElementsByClassName("xnorOutput1")[0],
                        x: document.getElementById(nextId).offsetLeft + document.getElementById(nextId).getElementsByClassName("xnorOutput1")[0].offsetLeft,
                        y: document.getElementById(nextId).offsetTop + document.getElementById(nextId).getElementsByClassName("xnorOutput1")[0].offsetTop,
                        value: 0,
                        connections: [],
                    },
                ]
            };
            gateObject[nextId.toString()] = gate;
            break;
        default:
            break;
    }
    document.onmousemove = pDragMove;
    isDragging = true;
    document.onmouseup = pDragStop;

    function pDragMove(e) {
        var elmnt = document.getElementById(nextId.toString());
        elmnt.style.left = e.pageX - relX + "px";
        elmnt.style.top = e.pageY - window.innerHeight * 0.2 - relY + "px";
        gateObject[nextId.toString()].inputs.forEach((node, index) => {
            node.x = document.getElementById(elmnt.id).offsetLeft + document.getElementById(elmnt.id).getElementsByClassName(`input${index + 1}`)[0].offsetLeft;
            node.y = document.getElementById(elmnt.id).offsetTop + document.getElementById(elmnt.id).getElementsByClassName(`input${index + 1}`)[0].offsetTop;
        });
        gateObject[nextId.toString()].outputs.forEach((node, index) => {
            node.x = document.getElementById(elmnt.id).offsetLeft + document.getElementById(elmnt.id).getElementsByClassName(`output${index + 1}`)[0].offsetLeft;
            node.y = document.getElementById(elmnt.id).offsetTop + document.getElementById(elmnt.id).getElementsByClassName(`output${index + 1}`)[0].offsetTop;
        });
        gateObject[nextId.toString()].x = document.getElementById(elmnt.id).offsetLeft;
        gateObject[nextId.toString()].y = document.getElementById(elmnt.id).offsetTop;
    }

    function pDragStop(e) {
        var elmnt = document.getElementById(nextId.toString());
        document.onmousemove = null;
        document.onmouseup = null;
        isDragging = false;
        if (elmnt.offsetTop < 0) {
            elmnt.remove();
        } else {
            nextId += 1;
            Array.from(gateElements).forEach((gate) => {
                dragElement(gate);
            });
        }
    }
}

//is the mouse dragging something
var isDragging = false;

function updateGate(id) {
    var elmnt = document.getElementById(id);
    if (elmnt.classList.contains("and")) {
        if (gateObject[id].inputs[0].value && gateObject[id].inputs[1].value) {
            setOn();
        } else {
            setOff();
        }
    } else if (elmnt.classList.contains("light")) {
        if (gateObject[id].inputs[0].value) {
            elmnt.style.backgroundColor = "#04c90b"
            elmnt.innerHTML = `
        ON
        <div class="gateInputOutput lightInput input1 gateInput"></div>
      `;
        } else if (!gateObject[id].inputs[0].value) {
            elmnt.style.backgroundColor = "red"
            elmnt.innerHTML = `
        OFF
        <div class="gateInputOutput lightInput input1 gateInput"></div>
      `;
        }
    } else if (elmnt.classList.contains("not")) {
        if (gateObject[id].inputs[0].value) {
            setOff();
        } else {
            setOn();
        }
    } else if (elmnt.classList.contains("or")) {
        if (gateObject[id].inputs[0].value || gateObject[id].inputs[1].value) {
            setOn();
        } else {
            setOff();
        }
    } else if (elmnt.classList.contains("xor")) {
        if (
            (gateObject[id].inputs[0].value || gateObject[id].inputs[1].value) &&
            !(gateObject[id].inputs[0].value && gateObject[id].inputs[1].value)
        ) {
            setOn();
        } else {
            setOff();
        }
    } else if (elmnt.classList.contains("nand")) {
        if (!(gateObject[id].inputs[0].value && gateObject[id].inputs[1].value)) {
            setOn();
        } else {
            setOff();
        }
    } else if (elmnt.classList.contains("xnor")) {
        if (!(
            (gateObject[id].inputs[0].value || gateObject[id].inputs[1].value) &&
            !(gateObject[id].inputs[0].value && gateObject[id].inputs[1].value)
        )) {
            setOn();
        } else {
            setOff();
        }
    } else if (elmnt.classList.contains("nor")) {
        if (!(gateObject[id].inputs[0].value || gateObject[id].inputs[1].value)) {
            setOn();
        } else {
            setOff();
        }
    }
    function setOn() {
        gateObject[id].outputs[0].value = 1;
        gateObject[id].outputs[0].connections.forEach((value) => {
            gateObject[value[0]].inputs[value[1] - 1].value = 1;
            updateGate(value[0]);
        });
    }
    function setOff() {
        gateObject[id].outputs[0].value = 0;
        gateObject[id].outputs[0].connections.forEach((value) => {
            gateObject[value[0]].inputs[value[1] - 1].value = 0;
            updateGate(value[0]);
        });
    }
    navigator.clipboard.writeText(JSON.stringify(gateObject));
}

//modified drag function from w3schools.com
function dragElement(elmnt) {
    var relX, relY;
    gateObject[elmnt.id].inputs.forEach((node, index) => {
        node.x = document.getElementById(elmnt.id).offsetLeft + document.getElementById(elmnt.id).getElementsByClassName(`input${index + 1}`)[0].offsetLeft;
        node.y = document.getElementById(elmnt.id).offsetTop + document.getElementById(elmnt.id).getElementsByClassName(`input${index + 1}`)[0].offsetTop;
    });
    gateObject[elmnt.id].outputs.forEach((node, index) => {
        node.x = document.getElementById(elmnt.id).offsetLeft + document.getElementById(elmnt.id).getElementsByClassName(`output${index + 1}`)[0].offsetLeft;
        node.y = document.getElementById(elmnt.id).offsetTop + document.getElementById(elmnt.id).getElementsByClassName(`output${index + 1}`)[0].offsetTop;
    });
    elmnt.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        originX = e.clientX;
        originY = e.clientY
        e.preventDefault();
        // Get the relation between the element and mouse coordinates
        relX = elmnt.offsetLeft - e.clientX;
        relY = elmnt.offsetTop - e.clientY;
        var noDrag = false;
        Array.from(gateElements).forEach((gate) => {
            Array.from(gate.children).forEach((node, index) => {
                if (
                    gate.offsetLeft + node.offsetLeft <= mouse.x &&
                    gate.offsetTop + node.offsetTop <= mouse.y &&
                    gate.offsetLeft + node.offsetLeft + node.offsetWidth >= mouse.x &&
                    gate.offsetTop + node.offsetTop + node.offsetHeight >= mouse.y
                ) {
                    noDrag = true;
                    if (gate.classList.contains("and") || gate.classList.contains("or") || gate.classList.contains("xor") || gate.classList.contains("nand") || gate.classList.contains("xnor") || gate.classList.contains("nor")) {
                        if (node.classList.contains("gateOutput")) {
                            mouse.startNode = [gate.id, index - 1, "gateOutput"];
                        } else {
                            mouse.startNode = [gate.id, index + 1, "gateInput"];
                        }
                    } else if (gate.classList.contains("switch")) {
                        mouse.startNode = [gate.id, index + 1, "gateOutput"];
                    } else if (gate.classList.contains("light")) {
                        mouse.startNode = [gate.id, index + 1, "gateInput"];
                    } else if (gate.classList.contains("not")) {
                        if (node.classList.contains("gateOutput")) {
                            mouse.startNode = [gate.id, index, "gateOutput"];
                        } else {
                            mouse.startNode = [gate.id, index + 1, "gateInput"];
                        }
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
        if (e.clientY + relY + elmnt.offsetHeight > stage.offsetHeight) {
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
        gateObject[elmnt.id].x = elmnt.offsetLeft;
        gateObject[elmnt.id].y = elmnt.offsetTop;
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
        if (mouse.y + relY + window.innerHeight * 0.2 < 0) {
            Object.values(gateObject).forEach((gate) => {
                gate.outputs.forEach((node) => {
                    node.connections.forEach((connection) => {
                        if (connection[0] == elmnt.id) {
                            gateObject[connection[0]].inputs[connection[1] - 1].value = 0;
                            updateGate(connection[0]);
                            node.connections.splice(0, 2);
                        }
                    });
                });
            });
            availableIds.push(elmnt.id);
            delete gateObject[elmnt.id];
            elmnt.remove();
        }
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
    canvas.height = window.innerHeight * 0.8;
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
    Array.from(gateElements).forEach((gate) => {
        Array.from(gate.children).forEach((node, index) => {
            if (
                gate.offsetLeft + node.offsetLeft <= mouse.x &&
                gate.offsetTop + node.offsetTop <= mouse.y &&
                gate.offsetLeft + node.offsetLeft + node.offsetWidth >= mouse.x &&
                gate.offsetTop + node.offsetTop + node.offsetHeight >= mouse.y
            ) {
                noDrag = true;
                //edits end node so it can make connections
                if (gate.classList.contains("and") || gate.classList.contains("or") || gate.classList.contains("xor") || gate.classList.contains("nand") || gate.classList.contains("xnor") || gate.classList.contains("nor")) {
                    if (node.classList.contains("gateOutput")) {
                        mouse.endNode = [gate.id, index - 1, "gateOutput"];
                    } else {
                        mouse.endNode = [gate.id, index + 1, "gateInput"];
                    }
                } else if (gate.classList.contains("switch")) {
                    mouse.endNode = [gate.id, index + 1, "gateOutput"];
                } else if (gate.classList.contains("light")) {
                    mouse.endNode = [gate.id, index + 1, "gateInput"];
                } else if (gate.classList.contains("not")) {
                    if (node.classList.contains("gateOutput")) {
                        mouse.endNode = [gate.id, index, "gateOutput"];
                    } else {
                        mouse.endNode = [gate.id, index + 1, "gateInput"];
                    }
                }
            }
        });
    });
    if (mouse.startNode[2] == "gateOutput" && mouse.endNode[2] == "gateInput") {
        gateObject[mouse.startNode[0]].outputs[mouse.startNode[1] - 1].connections.push([mouse.endNode[0], mouse.endNode[1]]);
        gateObject[mouse.startNode[0]].outputs[mouse.startNode[1] - 1].connections.forEach((value) => {
            gateObject[value[0]].inputs[value[1] - 1].value = gateObject[mouse.startNode[0]].outputs[mouse.startNode[1] - 1].value;
            updateGate(value[0]);
        });
        madeConnection = true;
    } else if (
        mouse.startNode[2] == "gateInput" &&
        mouse.endNode[2] == "gateOutput"
    ) {
        gateObject[mouse.endNode[0]].outputs[mouse.endNode[1] - 1].connections.push([mouse.startNode[0], mouse.startNode[1]]);
        gateObject[mouse.endNode[0]].outputs[mouse.endNode[1] - 1].connections.forEach((value) => {
            gateObject[value[0]].inputs[value[1] - 1].value = gateObject[mouse.endNode[0]].outputs[mouse.endNode[1] - 1].value;
            updateGate(value[0]);
        });
        madeConnection = true;
    }
    mouse.startNode = [];
    mouse.endNode = [];
    mouse.startX = 0;
    mouse.startY = 0;
});

function drawCanvas() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = "5";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mouse.isMouseDown && !isDragging) {
        ctx.beginPath();
        var isSelected = false;
        Array.from(nodeElements).forEach((element) => {
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

    var gates = Object.values(gateObject);

    gates.forEach((gate) => {
        gate.outputs.forEach((node) => {
            node.connections.forEach((connection) => {
                ctx.beginPath();
                ctx.moveTo(
                    node.x + 8,
                    node.y + 8
                );
                ctx.lineTo(
                    document.getElementById(connection[0]).offsetLeft +
                    document.getElementById(connection[0]).getElementsByClassName(`input${connection[1]}`)[0].offsetLeft + 8,
                    document.getElementById(connection[0]).offsetTop +
                    document.getElementById(connection[0]).getElementsByClassName(`input${connection[1]}`)[0].offsetTop + 8
                );
                ctx.stroke();
            });
        });
    });
}