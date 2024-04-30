var saveFile = JSON.parse(localStorage.saveFile || '{"username": "User","levelsFinished": 0,"circuits": {}}');

function checkIfCorrect() {
    if (document.querySelector('input[name="question3"]:checked').value == "NandGate") {
        document.getElementById("solution").innerHTML = `
            <div id="solutionExplain">
                <h3>Correct!</h3>
                <p>It is a description of the NAND gate because it says it outputs ON if at least one input is OFF.</p>
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
    if (saveFile.levelsFinished < 3) {
        saveFile.levelsFinished = 3;
        localStorage.saveFile = JSON.stringify(saveFile)
    }; 
    window.location.href = 'DeMorgansLaws.html';
}