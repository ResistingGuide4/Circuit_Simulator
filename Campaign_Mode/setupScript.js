var saveFile = JSON.parse(localStorage.saveFile || '{"username": "User","levelsFinished": 0,"circuits": {}}');

if (saveFile.levelsFinished) {
    switch (saveFile.levelsFinished) {
        case 1:
            window.location.href = "introToTruthTable.html";
            break;
        case 2:
            window.location.href = "ComplicatedGates.html";
            break;
        case 3:
            window.location.href = "DeMorgansLaws.html";
            break;
        case 4:
            window.location.href = "Congrats.html";
            break;
    }
} else {
    window.location.href = "campaign.html";
}