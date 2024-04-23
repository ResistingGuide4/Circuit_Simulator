var welcome = document.getElementById("welcome");
var saveFile;

saveFile = JSON.parse(localStorage.saveFile);
welcome.innerText = `Welcome, ${saveFile.username}.`;

function readFile(input) {
    let file = input.files[0];
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        saveFile = JSON.parse(reader.result);
        welcome.innerText = `Welcome, ${saveFile.username}.`;
        localStorage.saveFile = JSON.stringify(saveFile);
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}