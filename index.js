const display = document.getElementById("display");
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let timeAllowed = .1 * 60 * 1000;  // 10 minutes or any other value
let remainingTime = timeAllowed;
let isRunning = false;


// TIMER

function start(){
    if (!isRunning){
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update,10);
        isRunning = true;
    }
}
function stop(){
    if (isRunning){
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
        
    }
}
function reset(){
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    display.textContent = "00:10:00:00";
}

function update(){
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    remainingTime = timeAllowed - elapsedTime;
    if (remainingTime < 0){
        remainingTime = 0;
        alert("Time's up!")
        stop();
    }

    let hours = Math.floor(remainingTime / (1000 * 60 * 60));
    let minutes = Math.floor(remainingTime / (1000 * 60) % 60);
    let seconds = Math.floor(remainingTime / (1000) % 60);
    let milliseconds = Math.floor(remainingTime % 1000 / 10);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    display.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// TEXT BOX

const text_box = document.getElementById("box");
let cursorIndex = 0;

window.addEventListener("keydown", pressSpace);

function pressSpace(event){
    console.log(event.key)
    if (event.key == " "){
        event.preventDefault();  // ignore space input so it doesn't get typed into textbox

        cursorIndex = text_box.selectionStart;

        convert();
        updateWordCount();
        updateHintBox();
    }
    if (event.key == "ArrowLeft" || event.key == "ArrowRight"){
        console.log('hi')
        updateHintBox();
    }
}

// PRESS SPACE
// convert last english word in str into chinese character
function convert(){  
    let str = text_box.value;
    let index = cursorIndex - 1;  // make a 'pointer' for indicating index
    let chin_char = ""
     // only replace when last character is space
    if (isAlpha(str[index])){
        while (isAlpha(str[index])){
            index--;
        }
        index++;
        let word = str.slice(index, cursorIndex)  // get the last english word in the text_box string
    
        if (word_list.includes(word) ){
            chin_char = dataArray[ word_list.indexOf(word) ][1]  ;    // get corresponding chin char from list
        }
        text_box.value = text_box.value.slice(0, index) + chin_char + text_box.value.slice(cursorIndex, str.length);  // replace eng word with chin char
        setCursorPosition(index + chin_char.length);  // set cursorPos back to next to the added chin word
    }
}
function setCursorPosition(index) {
    text_box.selectionStart = index;
    text_box.selectionEnd = index;
  }
function isAlpha(ch){
    return /^[A-Z]$/i.test(ch);
}

const word_count = document.getElementById("word-count");
const hint_box = document.getElementById("hint-box")
// hint of command for the character before cursor
function updateHintBox(){
    hint_box.textContent = text_box.value[ text_box.selectionStart - 1 ] ;
}



function updateWordCount(){
    let num_of_words = text_box.value.length;
    word_count.textContent = num_of_words + " words";
}


// Retreive data from online txt file and put it in an array
fileURL = "https://gist.githubusercontent.com/hgjjefe/1aeac23bed64c36efb9cf822893763f2/raw" 

var dataArray;   // each element is a tuple of (command, output)
var word_list = [];     // each element is command

fetch(fileURL)
  .then(response => response.text())
  .then(data => {
    // Process and use the file content
    dataArray = data.split("\n");

    for(let i = 0; i<dataArray.length; i++) {
        dataArray[i] = dataArray[i].split(" ");
    }
    for(let i = 0; i<dataArray.length; i++) {
        word_list.push(dataArray[i][0]);
    }
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.error(error);
  });

