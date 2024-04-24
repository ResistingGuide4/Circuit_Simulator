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

function newName() {
    var newName = prompt("Enter your new username: ");
    if (newName) {
        saveFile.username = newName
        welcome.innerText = `Welcome, ${saveFile.username}.`;
        localStorage.saveFile = JSON.stringify(saveFile);
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

function saveToFile() {
    const blob = new Blob([JSON.stringify(saveFile)], { type: 'application/json' });
    downloadBlob(blob, "SaveFile")
}