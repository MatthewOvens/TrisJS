class HumanPlayer{
    
    name;
    moves = [];

    constructor(name) {
        this.name = name;
    }

    makeMove (box){  //Gli passo il box vero e proprio
        box.classList.remove("box");  //Per evitare l'hover
        box.classList.add("immagineDinamica");
        arrTris.splice(arrTris.indexOf(box.id), 1);
        player.moves.push(box.id);
        console.log("Player " + this.moves);

        controllaVittoria(this);
    }
}

class Bot {

    name = "Yellow Bot";
    moves = [];

    makeMove (){

        if(arrTris != "") {

            //LOGICA PICK BOT

            //Il box scelto
            let theChoosenOne = bestMove();
            arrTris.splice(arrTris.indexOf(theChoosenOne), 1); //toglie l'elemento dall'array
            this.moves.push(theChoosenOne);

            //Cambio immagine nel box scelto da X a O
            let idBoxRandom = document.getElementById(theChoosenOne);
            let elImg = document.createElement("img");
            elImg.setAttribute("src", "./Otictactoe.png");
            elImg.setAttribute("class", "imageO");
            idBoxRandom.classList.remove("box"); //Per evitare l'hover
            idBoxRandom.removeChild(idBoxRandom.firstElementChild)  //Rimuove la X
            idBoxRandom.appendChild(elImg);  //Aggiunge la O
            
            controllaVittoria(this);
        }
        else {
            controllaVittoria(this);
        }

    }
}

//Funzione di controllo vittoria/pareggio
function controllaVittoria(player) {

    for (let i = 0; i < combinations.length && !gameEnd; i++) {
        if(player.moves.includes(combinations[i][0]) && player.moves.includes(combinations[i][1]) && player.moves.includes(combinations[i][2])) {
            gameEnd = true;  //Uscendo così dal ciclo
        }
    }

    if(gameEnd) {
        finalPopup.style.display = "block";
        finalText.innerHTML += `Vittoria per ${player.name}`;
    }
    else {
        if(arrTris == "") {
            gameEnd = true;
            //Pareggio
            finalPopup.style.display = "block";
            finalText.innerHTML += "PAREGGIO";
        }
    } 
}

//Funzione di calcolo della mossa migliore da fare
function bestMove() {

    var choosenBox = "";  //stringa rappresentante box scelto come mossa dal bot

    var arrayPlayer = player.moves;
    var arrayBot = bot.moves;

    //Gestione mossa iniziale, quando il giocatore ha fatto una sola mossa
    if(arrayPlayer.length === 1) {
        
        if(arrayPlayer.includes("c5")) {
            console.log("random 0");
            choosenBox = randomFromArray(["c1", "c3", "c7", "c9"]);
        }
        else {
            choosenBox = "c5";
        }
    }
    else if(arrayPlayer.length === 2){  //Alla seconda mossa dell'utente

        //Quando si hanno sulla diagonale due X e una O
        if((!arrTris.includes("c1") && !arrTris.includes("c5") && !arrTris.includes("c9")) ||
           (!arrTris.includes("c3") && !arrTris.includes("c5") && !arrTris.includes("c7"))) {
            
            if(arrayBot.includes("c5")) {  // se il cerchio è in mezzo
                console.log("random 1");
                choosenBox = randomFromArray(["c2", "c4", "c6", "c8"]); //un box random fra quelli laterali
            }
            else {  //Quando invece il cerchio non è in mezzo
                console.log("random 2");
                choosenBox = randomFromArray(["c1", "c3", "c7", "c9"]); //un box random fra gli angoli
            }
        }
        else {
            //Nel caso cerca di bloccare l'avversario
            choosenBox = chooseMove(arrayPlayer);
            //Se ancora non si è trovato un box adeguato, logica random corner
            if(choosenBox == "") {
                console.log("random 3");
                choosenBox = randomFromArray(["c1", "c3", "c7", "c9"]);
            }
        }
    }
    else {  //Dopo la seconda mossa dell'utente, controlla se riesce a chiudere, altrimenti blocca il tentativo di vittoria dell'avversario

        //Priorità alla chiusura se ce ne è la possibilità
        choosenBox = chooseMove(arrayBot);
        //Se choosenBox è ancora vuota... Non c'è stato modo di chiudere la partita:
        if(choosenBox == "") {
            choosenBox = chooseMove(arrayPlayer);
        }
        //Se ancora non si è trovato un box adeguato, logica random corner
        if(choosenBox == "") {
            console.log("random 4");
            choosenBox = randomFromArray(["c1", "c3", "c7", "c9"]);
            if(choosenBox == "") {
                choosenBox = randomFromArray(["c2", "c4", "c6", "c8"]);
            }
        }
    }
    return choosenBox;
}

function randomFromArray(array) {

    let box = "";
    let flag = true;

    for (let i = 0; i < array.length && flag; i++) {
        box = array[Math.floor(Math.random() * array.length)];  //stringa casuale dall'array, box selezionato
        if(arrTris.includes(box)) {
            flag = false;
        }
        console.log("box tentato " + box);
    }

    if(flag) {
        box = "";
    }

    console.log("box scelto" + box);
    return box;
}


//Funzione richiamata per scegliere la mossa migliore, in base al parametro passatogli, cercherà di vincere oppure di bloccare l'avversario
function chooseMove(param) {
    
    let tempChoosenBox = "";
    let flag = true;

    for (let i = 0; i<combinations.length && flag; i++) {
        if(param.includes(combinations[i][0]) && param.includes(combinations[i][1])) {
            if(arrTris.includes(combinations[i][2])){
                tempChoosenBox = combinations[i][2];
                flag = false;
            }
        }
        
        if(param.includes(combinations[i][0]) && param.includes(combinations[i][2])) {
            if(arrTris.includes(combinations[i][1])){
                tempChoosenBox = combinations[i][1];
                flag = false;
            }   
        }
        
        if(param.includes(combinations[i][1]) && param.includes(combinations[i][2])) {
            if(arrTris.includes(combinations[i][0])){
                tempChoosenBox = combinations[i][0];
                flag = false;
            }
        }
    }
    return tempChoosenBox;
}


/**
 * GAME CICLE
 */

var gameEnd = false; //Variabile di controllo che la partita sia finitafm

var arrTris = ["c1", "c2", "c3", "c4", "c5", "c6", "c7","c8", "c9"];

//Combinazioni di vittoria
var combinations = [["c1", "c2", "c3"], ["c4", "c5", "c6"], ["c7","c8", "c9"], ["c1", "c5", "c9"], 
                    ["c3", "c5", "c7"], ["c1", "c4", "c7"], ["c2", "c5", "c8"], ["c3", "c6", "c9"]];

//Tutte le box del tris
const boxes = document.querySelectorAll(".box");

//Popup iniziale per inserimento nome
const popup = document.getElementById("popupClass");
const okButton = document.getElementById("ok");
var nameField = document.getElementById("nameField");

//Popup finale per vittoria/sconfitta/pareggio
const finalPopup = document.getElementById("finalPopup");
var finalText = document.getElementById("finalText");
const restart = document.getElementById("restartButton");

//Visualizza popup per inserimento nome giocatore
popup.style.display = "block";

//Event listener sul bottone di conferma nome
okButton.addEventListener("click", () => {
    popup.style.display = "none";  //Nasconde il popup

    if(nameField.value == "") {
        nameField.value = "Anonymous Player";
    }

    //Istanziazione oggetti dopo il click all'OK
    player = new HumanPlayer(nameField.value);  //Prendendo come nome quello inserito dall'utente
    bot = new Bot();
})

//Event listener sul bottone di restart
restart.addEventListener("click", () => {
    
    window.location.reload();

    //Eventualmente anche salvataggio risultato
})

//Event listener su ogni box del tris
boxes.forEach(box => {
    box.addEventListener("click", () => {

        //box.id  identifica il box selezionato
        if (arrTris.includes(box.id)) {  
            //Mossa Giocatore umano
            if(!gameEnd){
            player.makeMove(box);
            }
            //Mossa Bot
            if(!gameEnd){
                bot.makeMove();
            }
        }
    });
});