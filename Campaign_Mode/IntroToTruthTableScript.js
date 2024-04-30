var saveFile = JSON.parse(localStorage.saveFile || '{"username": "User","levelsFinished": 0,"circuits": {}}');

function checkIfCorrect() {
    if (document.querySelector('input[name="question2"]:checked').value == "AndGate") {
        document.getElementById("solution").innerHTML = `
            <div id="solutionExplain">
                <h3>Correct!</h3>
                <p>It is the AND gate truth table because O1 is only ON if I1 and I2 are ON.</p>
            </div>
            <button onclick="next()">Next</button>
        `;
        document.location.href = "#solution";
    } else {
        document.getElementById("solution").innerHTML = `
            <div id="solutionExplain">
                <h3>Incorrect</h3>
                <p>Try Again</p>
            </div>
        `;
        document.location.href = "#solution";
    }
}

function next() {
    if (saveFile.levelsFinished < 2) {
        saveFile.levelsFinished = 2;
        localStorage.saveFile = JSON.stringify(saveFile)
    }; 
    window.location.href = 'ComplicatedGates.html';
}