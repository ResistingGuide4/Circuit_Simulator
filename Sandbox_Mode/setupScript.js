var linkContainer = document.getElementById("linkContainer");
var saveFile = JSON.parse(localStorage.getItem("saveFile") || "{}");
localStorage.selectedCircuit = "";
if ("circuits" in saveFile) {
    Object.values(saveFile.circuits).forEach((circuit, index) => {
        linkContainer.innerHTML += `<a href="./sandbox.html" onclick="localStorage.selectedCircuit = ${Object.keys(saveFile.circuits)[index]}" onmouseover="localStorage.selectedCircuit = '${Object.keys(saveFile.circuits)[index]}'">${Object.keys(saveFile.circuits)[index]}</a>`;
    });
} else {
    window.location.replace("sandbox.html");
}