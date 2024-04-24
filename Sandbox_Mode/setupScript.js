var linkContainer = document.getElementById("linkContainer");
var saveFile = JSON.parse(localStorage.getItem("saveFile") || "{}");
localStorage.selectedCircuit = "";
if ("circuits" in saveFile) {
    Object.values(saveFile.circuits).forEach((circuit, index) => {
        linkContainer.innerHTML += `<a href="./sandbox.html" onclick="localStorage.selectedCircuit = ${Object.keys(saveFile.circuits)[index]}" onmouseover="localStorage.selectedCircuit = '${Object.keys(saveFile.circuits)[index]}'" style="margin: 0 10px">${Object.keys(saveFile.circuits)[index]}</a>`;
    });
} else {
    window.location.replace("sandbox.html");
}

function createNew() {
    var circuit = prompt("Enter the new circuit")
    saveFile.circuits[circuit] = {};
    localStorage.saveFile = JSON.stringify(saveFile);
    localStorage.selectedCircuit = circuit;
    window.location.replace("sandbox.html");
}