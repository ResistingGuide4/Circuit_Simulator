var saveFile = JSON.parse(localStorage.saveFile || '{"username": "User","levelsFinished": 0,"circuits": {}}');

function checkIfCorrect() {
    if (document.querySelector('input[name="question4"]:checked').value == "NorGate") {
        document.getElementById("solution").innerHTML = `
            <div id="solutionExplain">
                <h3>Correct!</h3>
                <p>You can simplify this circuit to a Nor gate</p>
            </div>
            <button onclick="if (saveFile.levelsFinished < 4) {saveFile.levelsFinished = 4; localStorage.saveFile = JSON.stringify(saveFile)}; window.location.href = 'Congrats.html';">Next</button>
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
    if (saveFile.levelsFinished < 4) {
        saveFile.levelsFinished = 4;
        localStorage.saveFile = JSON.stringify(saveFile)
    }; 
    window.location.href = 'Congrats.html';
}