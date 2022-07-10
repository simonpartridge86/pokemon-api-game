let body = document.querySelector("body");
let pokemonData = [];

//lines below add the background "Who's that Pokemon" image to the page
let mainImage = document.createElement('img');
mainImage.src = "https://i.imgflip.com/1yzkic.jpg";
mainImage.id = "background-pic";
mainImage.style.position = "absolute";
mainImage.style.width = "auto";
mainImage.style.height = "500px";
body.prepend(mainImage);

//randomPokeID creates a random Pokemon ID number within a customisable range
function randomPokeID(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

let randomNum = randomPokeID(1, 150);

//fetchURL creates a URL using the random pokemon ID generated above
function fetchURL(id){
    let baseURL = `https://pokeapi.co/api/v2/pokemon/${id}`
    return baseURL;
}

//getPokemon runs the fetch request (GET) and adds the returned data to the 'pokemonData' array
async function getPokemon(){
    let response = await fetch(fetchURL(randomNum));
    let data = await response.json();
    pokemonData.push(data);
    addPokePic(pokemonData);
}

//as a fun easter egg, getDadJoke fetches a dad joke, which is then displaued at the bottom of the page when the background image is clicked
let dadJokeArray = [];
async function getDadJoke(){
    let dadResponse = await fetch("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
        });
    let dadData = await dadResponse.json();
    dadJokeArray.push(dadData);
}

//getPokemonTypes adds the fetched pokemon types and concatenates them into a formatted string
function getPokemonTypes(arr) {
    let types = "Types:";
    for(let i = 0; i < arr.length; i++) {
        types += ` ${capitalizeFirstLetter(arr[i].type.name)}`;
        if(i !== arr.length - 1){
            types += `,`;
        }
    }
    return types;
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

//addNewLi creates and appends a new 'li' element to the existing 'ul'
function addNewLi(str){
    let ul = document.querySelector('ul');
    let newLi = document.createElement('li');
    newLi.innerText = str;
    ul.appendChild(newLi);
}

//displayPokemonData adds new elements to display the fetched pokemon data
function displayPokemonData(){
    let h1 = document.querySelector('h1');
    let pokemonName = capitalizeFirstLetter(pokemonData[0].name);
    h1.innerText = pokemonName;
    let typeText = getPokemonTypes(pokemonData[0].types);
    addNewLi(typeText);
    let idText = `ID: #${pokemonData[0].id}`;
    addNewLi(idText);
    let heightText = `${pokemonData[0].height / 10} m`;
    addNewLi(heightText);
    let weightText = `${pokemonData[0].weight / 10} kg`;
    addNewLi(weightText);
}

//addPokePic displays the current pokemon picture set to black (0% brightness)
function addPokePic(){
    let image = document.createElement('img');
    image.src = pokemonData[0].sprites.other["official-artwork"].front_default;
    image.style.filter = ("brightness(0%)");
    image.id = "pokemon-pic";
    image.style.height = "500px";
    body.insertBefore(image, body.children[1]);
    return image;
}

//code below adds all input fields, buttons, and event listeners used to play the game
let inputField = document.createElement('input');
inputField.setAttribute("type", "text");
inputField.placeholder = "Type guess here...";
body.appendChild(inputField);

let guessButton = document.createElement("button");
guessButton.innerText = "Guess";
guessButton.id = "#guess";
body.appendChild(guessButton);

guessButton.addEventListener("click", checkAnswer);

let giveUpButton = document.createElement("button");
giveUpButton.innerText = "Give Up";
giveUpButton.id = "#give-up";
body.appendChild(giveUpButton);

giveUpButton.addEventListener("click", giveUp);

let newPokemonButton = document.createElement("button");
newPokemonButton.innerText = "New Pokemon";
newPokemonButton.id = "#try-again";
body.appendChild(newPokemonButton);

newPokemonButton.addEventListener("click", newPokemon);

let jokeImage = document.querySelector('img');

jokeImage.addEventListener("click", function (){
    let joke = document.createElement('p')
    joke.innerText = dadJokeArray[0].joke;
    body.appendChild(joke);
    setTimeout(function(){
        joke.style.color = "black";
      }, 5000);
}, {once: true});

//checkAnswer updates the display based on whether the user answer is correct or not
function checkAnswer() {
    let image = document.querySelector('#pokemon-pic');
    if(pokemonData[0].name === inputField.value.toLowerCase()){
        image.style.filter = ("brightness(100%)");
        displayPokemonData();
        body.style.backgroundColor = "green";
        setTimeout(function(){
          body.style.backgroundColor = "white"; 
        }, 300);
    } else {
      body.style.backgroundColor = "red";
      setTimeout(function(){
          body.style.backgroundColor = "white"; 
      }, 300);
    }
}

//giveUp displays the pokemon and corresponding data if you can't guess it
function giveUp(){
    let image = document.querySelector('#pokemon-pic');
    image.style.filter = ("brightness(100%)");
    displayPokemonData();
}

//newPokemon restarts the game by reloading the page, and plays a corresponding audio clip
function newPokemon(){
    document.location.reload();
    let audio = document.querySelector('#first-clip');
    audio.play();
}

//calls functions to run game on page load
getDadJoke();
getPokemon();