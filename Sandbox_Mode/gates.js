class Node {
    constructor(parentId, parentType, type, index, value = 0, connections = []) {
        this.parentId = parentId;
        this.parentType = parentType;
        this.type = type;
        this.index = index;
        this.value = value;
        this.connections = connections;
    }

    getCoords() {
        this.x = this.getParentElement().offsetLeft + this.getElement().offsetLeft;
        this.y = this.getParentElement().offsetTop + this.getElement().offsetTop;
        return [this.x, this.y];
    }

    getElement() {
        return document.getElementById(this.parentId).getElementsByClassName(`${this.type}${this.index + 1}`)[0];
    }

    getParentElement() {
        return document.getElementById(this.parentId)
    }

    createConnection(connectionId, connectionIndex) {
        this.connections.push([connectionId, connectionIndex]);
        gateObject[this.parentId].connections[this.index].push([connectionId, connectionIndex])
    }
}

class Gate {
    constructor(type, id = nextId.toString(), x = 0, y = 0, inputValues = [], outputValues = [], outputConnections = []) {
        this.type = type;
        this.id = id;
        this.x = x;
        this.y = y;
        this.inputValues = inputValues;
        this.outputValues = outputValues;
        this.outputs = [];
        this.inputs = [];
        this.connections = outputConnections;
        switch (type) {
            case "switch":
                gateContainer.innerHTML += `
                        <div onmousedown="checkDragDown(event)" onmouseup="checkDragUp(event)" class="switch gate" id="${id}" style="left:${x}px; top: ${y}px; background-color: ${outputValues[0] == 1 ? "#04c90b" : "red"}">
                            ${outputValues[0] == 1 ? "ON" : "OFF"}
                            <div class="gateInputOutput switchOutput output1 gateOutput"></div>
                        </div>
                    `
                this.outputs.push(new Node(id, type, "output", 0, outputValues[0], outputConnections[0]));
                if (this.connections.length == 0) {
                    this.connections.push([])
                }
                break;
            case "light":
                gateContainer.innerHTML += `
                        <div class="light gate" id="${id}" style="left:${x}px; top: ${y}px;  background-color: ${inputValues[0] == 1 ? "#04c90b" : "red"}">
                            ${inputValues[0] == 1 ? "ON" : "OFF"}
                            <div class="gateInputOutput lightInput input1 gateInput"></div>
                        </div>
                    `
                this.inputs.push(new Node(id, type, "input", 0, inputValues[0]));
                break;
            case "and":
                gateContainer.innerHTML += `
                        <div class="and gate" id="${id}" style="left:${x}px; top: ${y}px;">
                            <div class="gateInputOutput andInput1 input1 gateInput"></div>
                            <div class="gateInputOutput andInput2 input2 gateInput"></div>
                            AND
                            <div class="gateInputOutput andOutput1 output1 gateOutput"></div>
                        </div>
                    `;
                this.inputs.push(new Node(id, type, "input", 0, inputValues[0]));
                this.inputs.push(new Node(id, type, "input", 1, inputValues[1]));
                this.outputs.push(new Node(id, type, "output", 0, outputValues[0], outputConnections[0]));
                if (this.connections.length == 0) {
                    this.connections.push([])
                }
                break;
            case "or":
                gateContainer.innerHTML += `
                        <div class="or gate" id="${id}" style="left:${x}px; top: ${y}px;">
                            <div class="gateInputOutput orInput1 input1 gateInput"></div>
                            <div class="gateInputOutput orInput2 input2 gateInput"></div>
                            OR
                            <div class="gateInputOutput orOutput1 output1 gateOutput"></div>
                        </div>
                    `;
                this.inputs.push(new Node(id, type, "input", 0, inputValues[0]));
                this.inputs.push(new Node(id, type, "input", 1, inputValues[1]));
                this.outputs.push(new Node(id, type, "output", 0, outputValues[0], outputConnections[0]));
                if (this.connections.length == 0) {
                    this.connections.push([])
                }
                break;
            case "not":
                gateContainer.innerHTML += `
                        <div class="not gate" id="${id}" style="left:${x}px; top: ${y}px;">
                            <div class="gateInputOutput notInput input1 gateInput"></div>
                            NOT
                            <div class="gateInputOutput notOutput output1 gateOutput"></div>
                        </div>
                    `;
                this.inputs.push(new Node(id, type, "input", 0, inputValues[0]));
                this.outputs.push(new Node(id, type, "output", 0, outputValues[0], outputConnections[0]));
                if (this.connections.length == 0) {
                    this.connections.push([])
                }
                break;
            case "xor":
                gateContainer.innerHTML += `
                        <div class="xor gate" id="${id}" style="left:${x}px; top: ${y}px;">
                            <div class="gateInputOutput xorInput1 input1 gateInput"></div>
                            <div class="gateInputOutput xorInput2 input2 gateInput"></div>
                            XOR
                            <div class="gateInputOutput xorOutput1 output1 gateOutput"></div>
                        </div>
                    `;
                this.inputs.push(new Node(id, type, "input", 0, inputValues[0]));
                this.inputs.push(new Node(id, type, "input", 1, inputValues[1]));
                this.outputs.push(new Node(id, type, "output", 0, outputValues[0], outputConnections[0]));
                if (this.connections.length == 0) {
                    this.connections.push([])
                }
                break;
            case "nand":
                gateContainer.innerHTML += `
                        <div class="nand gate" id="${id}" style="left:${x}px; top: ${y}px;">
                            <div class="gateInputOutput nandInput1 input1 gateInput"></div>
                            <div class="gateInputOutput nandInput2 input2 gateInput"></div>
                            NAND
                            <div class="gateInputOutput nandOutput1 output1 gateOutput"></div>
                        </div>
                    `;
                this.inputs.push(new Node(id, type, "input", 0, inputValues[0]));
                this.inputs.push(new Node(id, type, "input", 1, inputValues[1]));
                this.outputs.push(new Node(id, type, "output", 0, outputValues[0], outputConnections[0]));
                if (this.connections.length == 0) {
                    this.connections.push([])
                }
                break;
            case "nor":
                gateContainer.innerHTML += `
                        <div class="nor gate" id="${id}" style="left:${x}px; top: ${y}px;">
                            <div class="gateInputOutput norInput1 input1 gateInput"></div>
                            <div class="gateInputOutput norInput2 input2 gateInput"></div>
                            NOR
                            <div class="gateInputOutput norOutput1 output1 gateOutput"></div>
                        </div>
                    `;
                this.inputs.push(new Node(id, type, "input", 0, inputValues[0]));
                this.inputs.push(new Node(id, type, "input", 1, inputValues[1]));
                this.outputs.push(new Node(id, type, "output", 0, outputValues[0], outputConnections[0]));
                if (this.connections.length == 0) {
                    this.connections.push([])
                }
                break;
            case "xnor":
                gateContainer.innerHTML += `
                        <div class="xnor gate" id="${id}" style="left:${x}px; top: ${y}px;">
                            <div class="gateInputOutput xnorInput1 input1 gateInput"></div>
                            <div class="gateInputOutput xnorInput2 input2 gateInput"></div>
                            XNOR
                            <div class="gateInputOutput xnorOutput1 output1 gateOutput"></div>
                        </div>
                    `;
                this.inputs.push(new Node(id, type, "input", 0, inputValues[0]));
                this.inputs.push(new Node(id, type, "input", 1, inputValues[1]));
                this.outputs.push(new Node(id, type, "output", 0, outputValues[0], outputConnections[0]));
                if (this.connections.length == 0) {
                    this.connections.push([])
                }
                break;
        }
    }

    setCoords(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.getElement().style.left = newX + "px";
        this.getElement().style.top = newY + "px";
    }

    getCoords() {
        this.x = this.getElement().offsetLeft;
        this.y = this.getElement().offsetTop;
        return [this.x, this.y]
    }

    getElement() {
        return document.getElementById(this.id);
    }

    updateGate() {
        var elmnt = this.getElement();
        if (elmnt.classList.contains("and")) {
            if (this.inputs[0].value && this.inputs[1].value) {
                this.#setOn();
            } else {
                this.#setOff();;
            }
        } else if (elmnt.classList.contains("light")) {
            if (this.inputs[0].value) {
                elmnt.style.backgroundColor = "#04c90b"
                elmnt.innerHTML = `
                ON
                <div class="gateInputOutput lightInput input1 gateInput"></div>
              `;
            } else if (!this.inputs[0].value) {
                elmnt.style.backgroundColor = "red"
                elmnt.innerHTML = `
                OFF
                <div class="gateInputOutput lightInput input1 gateInput"></div>
              `;
            }
        } else if (elmnt.classList.contains("not")) {
            if (this.inputs[0].value) {
                this.#setOff();;
            } else {
                this.#setOn();
            }
        } else if (elmnt.classList.contains("or")) {
            if (this.inputs[0].value || this.inputs[1].value) {
                this.#setOn();
            } else {
                this.#setOff();;
            }
        } else if (elmnt.classList.contains("xor")) {
            if (
                (this.inputs[0].value || this.inputs[1].value) &&
                !(this.inputs[0].value && this.inputs[1].value)
            ) {
                this.#setOn();
            } else {
                this.#setOff();;
            }
        } else if (elmnt.classList.contains("nand")) {
            if (!(this.inputs[0].value && this.inputs[1].value)) {
                this.#setOn();
            } else {
                this.#setOff();;
            }
        } else if (elmnt.classList.contains("xnor")) {
            if (!(
                (this.inputs[0].value || this.inputs[1].value) &&
                !(this.inputs[0].value && this.inputs[1].value)
            )) {
                this.#setOn();
            } else {
                this.#setOff();;
            }
        } else if (elmnt.classList.contains("nor")) {
            if (!(this.inputs[0].value || this.inputs[1].value)) {
                this.#setOn();
            } else {
                this.#setOff();;
            }
        }
    }
    #setOn() {
        this.outputs[0].value = 1;
        this.outputs[0].connections.forEach((value) => {
            gateObject[value[0]].inputs[value[1] - 1].value = 1;
            gateObject[value[0]].updateGate();
        });
    }
    #setOff() {
        this.outputs[0].value = 0;
        this.outputs[0].connections.forEach((value) => {
            gateObject[value[0]].inputs[value[1] - 1].value = 0;
            gateObject[value[0]].updateGate();
        });
    }
}