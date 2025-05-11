try {
    var stage = document.getElementById("stage");
    var canvas = document.createElement("canvas");
    stage.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    
    //sizing the canvas correctly
    canvas.height = window.innerHeight * 0.8;
    canvas.width = window.innerWidth;
    var gateContainer = document.createElement("div");
    stage.appendChild(gateContainer);
    var circuitName = document.getElementById("circuitName");

    const nodeWidth = 20;
    const spacing = 20;

    var saveFile = JSON.parse(localStorage.getItem("saveFile") || '{"username": "User","levelsFinished": 0,"circuits": {}}')

    //object containing all of the logic gates and their nodes
    var gateObject = {};

    var nextId = 0;

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

    var keyboard = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    var cameraLoc = {
        x: 4000,
        y: 4000
    }

    addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowDown":
                keyboard.down = true;
                break;
            case "ArrowUp":
                keyboard.up = true;
                break;
            case "ArrowRight":
                keyboard.right = true;
                break;
            case "ArrowLeft":
                keyboard.left = true;
                break;
        }
    });

    addEventListener("keyup", (e) => {
        switch (e.key) {
            case "ArrowDown":
                keyboard.down = false;
                break;
            case "ArrowUp":
                keyboard.up = false;
                break;
            case "ArrowRight":
                keyboard.right = false;
                break;
            case "ArrowLeft":
                keyboard.left = false;
                break;
        }
    });

    var pathFindGrid = new PF.Grid(400, 400);
    var finder = new PF.AStarFinder({
        allowDiagonal: true
    });

    if (localStorage.selectedCircuit) {
        circuitName.innerText = localStorage.selectedCircuit;
        gateObject = saveFile.circuits[localStorage.selectedCircuit];
        Object.values(gateObject).forEach((gate, index) => {
            var lookKey = Object.keys(gateObject)[index];
            if (parseInt(lookKey) >= nextId) {
                nextId = parseInt(lookKey) + 1;
            }
            gateObject[lookKey] = new Gate(gate.type, lookKey, gate.x, gate.y, gate.inputValues, gate.outputValues, gate.connections);
            switch (gate.type) {
                case "nand":
                case "xnor":
                    for (i = 0; i < 4; i++) {
                        for (j = 0; j < 3; j++) {
                            pathFindGrid.setWalkableAt(Math.floor((gate.x + cameraLoc.x)/20)+i,Math.floor((gate.y + cameraLoc.y)/20)+j, false)
                        }
                    }
                    break;
                default:
                    for (i = 0; i < 3; i++) {
                        for (j = 0; j < 3; j++) {
                            pathFindGrid.setWalkableAt(Math.floor((gate.x + cameraLoc.x)/20)+i,Math.floor((gate.y + cameraLoc.y)/20)+j, false)
                        }
                    }
            }
        });

    }

    var path = finder.findPath(218, 205, 223, 205, pathFindGrid);
    path = PF.Util.compressPath(path);

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
        if (name == "" || !name) {
            alert("Please enter a valid name with at least one character");
            rename();
        } else if (localStorage.selectedCircuit == "") {
            localStorage.selectedCircuit = name;
            circuitName.innerText = name;
        } else if (name !== localStorage.selectedCircuit && name !== null) {
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
                    gateObject[value[0]].updateGate();
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
                    gateObject[value[0]].updateGate();
                });
            }
        }
    }

    //When the user drags a gate from the toolbar
    function previewDrag(e) {
        var classList = e.target.classList;
        var pBoundingRect = e.target.getBoundingClientRect();
        var relX = e.clientX - pBoundingRect.left, relY = e.clientY - pBoundingRect.top;
        var gate;
        switch (true) {
            case classList.contains("pSwitch"):
                gateObject[nextId.toString()] = new Gate("switch", nextId, e.clientX - relX, e.clientY - relY - window.innerHeight * 0.2, [0]);
                break;
            case classList.contains("pLight"):
                gateObject[nextId.toString()] = new Gate("light", nextId, e.clientX - relX, e.clientY - relY - window.innerHeight * 0.2, []);
                break;
            case classList.contains("pAnd"):
                gateObject[nextId.toString()] = new Gate("and", nextId, e.clientX - relX, e.clientY - relY - window.innerHeight * 0.2, [0]);
                break;
            case classList.contains("pOr"):
                gateObject[nextId.toString()] = new Gate("or", nextId, e.clientX - relX, e.clientY - relY - window.innerHeight * 0.2, [0]);
                break;
            case classList.contains("pNot"):
                gateObject[nextId.toString()] = new Gate("not", nextId, e.clientX - relX, e.clientY - relY - window.innerHeight * 0.2, [0]);
                break;
            case classList.contains("pXor"):
                gateObject[nextId.toString()] = new Gate("xor", nextId, e.clientX - relX, e.clientY - relY - window.innerHeight * 0.2, [0]);
                break;
            case classList.contains("pNand"):
                gateObject[nextId.toString()] = new Gate("nand", nextId, e.clientX - relX, e.clientY - relY - window.innerHeight * 0.2, [0]);
                break;
            case classList.contains("pNor"):
                gateObject[nextId.toString()] = new Gate("nor", nextId, e.clientX - relX, e.clientY - relY - window.innerHeight * 0.2, [0]);
                break;
            case classList.contains("pXnor"):
                gateObject[nextId.toString()] = new Gate("xnor", nextId, e.clientX - relX, e.clientY - relY - window.innerHeight * 0.2, [0]);
                break;
            default:
                break;
        }

        document.onmousemove = pDragMove;
        isDragging = true;
        document.onmouseup = pDragStop;

        function pDragMove(e) {
            var elmnt = document.getElementById(nextId.toString());
            elmnt.style.left = Math.round((e.pageX - relX) / spacing) * spacing + "px";
            elmnt.style.top = Math.round((e.pageY - relY - stage.offsetTop) / spacing) * spacing + "px";
            gateObject[nextId.toString()].setCoords(elmnt.offsetLeft, elmnt.offsetTop)
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
            elmnt.style.top = Math.round((e.clientY + relY - cameraLoc.y % spacing) / spacing) * spacing + "px";

            elmnt.style.left = Math.round((e.clientX + relX - cameraLoc.x % spacing) / spacing) * spacing + "px";
            gateObject[elmnt.id].setCoords(elmnt.offsetLeft, elmnt.offsetTop);
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
                                gateObject[connection[0]].updateGate();
                                node.connections.splice(0, 2);
                            }
                        });
                    });
                });
                delete gateObject[elmnt.id];
                elmnt.remove();
            }
        }
    }

    //changing mouse object when the mouse moves
    document.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y - stage.offsetTop;
    });

    function printArr(arr) {
        let str = "\n[";
        for (let item of arr) {
            if (Array.isArray(item)) str += printArr(item);
            else str += item + ", ";

        }
        str += "]"
        return str;
    }

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
                            mouse.endNode = [gate.id, index + 1, "gateOutput"];
                        } else {
                            mouse.endNode = [gate.id, index + 1, "gateInput"];
                        }
                    } else if (gate.classList.contains("switch")) {
                        mouse.endNode = [gate.id, index + 1, "gateOutput"];
                    } else if (gate.classList.contains("light")) {
                        mouse.endNode = [gate.id, index + 1, "gateInput"];
                    } else if (gate.classList.contains("not")) {
                        if (node.classList.contains("gateOutput")) {
                            mouse.endNode = [gate.id, index + 1, "gateOutput"];
                        } else {
                            mouse.endNode = [gate.id, index + 1, "gateInput"];
                        }
                    }
                }
            });
        });
        if (mouse.startNode[2] == "gateInput" && mouse.endNode[2] == "gateOutput") {
            gateObject[mouse.endNode[0]].outputs[mouse.endNode[1] - 1].createConnection(mouse.startNode[0], mouse.startNode[1])
            gateObject[mouse.endNode[0]].outputs[mouse.endNode[1] - 1].connections.forEach((value) => {
                gateObject[value[0]].inputs[value[1] - 1].value = gateObject[mouse.endNode[0]].outputs[mouse.endNode[1] - 1].value;
                gateObject[value[0]].updateGate();
            });
        }
        else if (mouse.startNode[2] == "gateOutput" && mouse.endNode[2] == "gateInput") {
            gateObject[mouse.startNode[0]].outputs[mouse.startNode[1] - 1].createConnection(mouse.endNode[0], mouse.endNode[1]);
            gateObject[mouse.startNode[0]].outputs[mouse.startNode[1] - 1].connections.forEach((value) => {
                gateObject[value[0]].inputs[value[1] - 1].value = gateObject[mouse.startNode[0]].outputs[mouse.startNode[1] - 1].value;
                gateObject[value[0]].updateGate();
            });
        }
        mouse.startNode = [];
        mouse.endNode = [];
        mouse.startX = 0;
        mouse.startY = 0;
    });

    function drawCanvas() {
        ctx.strokeStyle = "white";
        ctx.lineWidth = "5";
        ctx.fillStyle = "white";
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

        if (keyboard.up) {
            Object.values(gateObject).forEach((gate) => {
                gate.setCoords(gate.getElement().offsetLeft, gate.getElement().offsetTop + 5)
            });
            cameraLoc.y -= 5;
        }
        if (keyboard.down) {
            Object.values(gateObject).forEach((gate) => {
                gate.setCoords(gate.getElement().offsetLeft, gate.getElement().offsetTop - 5)
            })
            cameraLoc.y += 5;
        }
        if (keyboard.left) {
            Object.values(gateObject).forEach((gate) => {
                gate.setCoords(gate.getElement().offsetLeft + 5, gate.getElement().offsetTop)
            })
            cameraLoc.x -= 5;
        }
        if (keyboard.right) {
            Object.values(gateObject).forEach((gate) => {
                gate.setCoords(gate.getElement().offsetLeft - 5, gate.getElement().offsetTop)
            })
            cameraLoc.x += 5;
        }

        var gates = Object.values(gateObject);
        gates.forEach((gate) => {
            gate.outputs.forEach((node) => {
                node.connections.forEach((connection) => {
                    ctx.beginPath();
                    if (node.value) {
                        ctx.strokeStyle = "green";
                    } else {
                        ctx.strokeStyle = "red";
                    }
                    ctx.moveTo(
                        document.getElementById(node.parentId).offsetLeft +
                        document.getElementById(node.parentId).getElementsByClassName(`output${node.index + 1}`)[0].offsetLeft + nodeWidth / 2 - 2,
                        document.getElementById(node.parentId).offsetTop +
                        document.getElementById(node.parentId).getElementsByClassName(`output${node.index + 1}`)[0].offsetTop + nodeWidth / 2 - 2
                    );
                    ctx.lineTo(
                        document.getElementById(connection[0]).offsetLeft +
                        document.getElementById(connection[0]).getElementsByClassName(`input${connection[1]}`)[0].offsetLeft + nodeWidth / 2 - 2,
                        document.getElementById(connection[0]).offsetTop +
                        document.getElementById(connection[0]).getElementsByClassName(`input${connection[1]}`)[0].offsetTop + nodeWidth / 2 - 2
                    );
                    ctx.stroke();
                });
            });
        });
        ctx.beginPath();
        ctx.moveTo(path[0][0]*20-cameraLoc.x, path[0][1]*20-cameraLoc.y+10);
        for (i = 1; i < path.length; i++) {
            ctx.lineTo(path[i][0]*20-cameraLoc.x, path[i][1]*20-cameraLoc.y+10);
        }
        ctx.stroke();
        requestAnimationFrame(drawCanvas)
    }

    drawCanvas();
} catch (error) {
    document.title = error;
}