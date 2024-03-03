// Part 1: Number Facts 

// 1. Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number. (Make sure you get back JSON by including the json query key, specific to this API. Details.

axios.get('http://numbersapi.com/17?json')
    .then(resp => console.log(resp.data.text))
    .catch(err => console.log(err))


// 2. Figure out how to get data on multiple numbers in a single request. Make that request and when you get the data back, put all of the number facts on the page. 
// Get data on multiple numbers from a single request

// http://numbersapi.com/1..3


function getMultipleNums(min, max) {
    let promise = axios.get(`http://numbersapi.com/${min}..${max}?json`)

    promise
        .then(resp => {
            for (let num in resp.data) {
                console.log(resp.data[num])
            }
        })
        .catch(err => console.log(err))
}

getMultipleNums(13, 17)


// 3. Use the API to get 4 facts on your favorite number. Once you have them all, put them on the page. It’s okay if some of the facts are repeats.

let favoriteNumbersArr = []

for (let i = 1; i < 5; i++) {
    favoriteNumbersArr.push(axios.get('http://numbersapi.com/17?json'))
}

Promise.all(favoriteNumbersArr)
    .then(resolvedNumsArr => {
        for (let resp of resolvedNumsArr) {
            console.log(resp.data.text)
        }
    })


// Part 2: Deck of Cards
// 1. Make a request to the Deck of Cards API to request a single card from a newly shuffled deck.Once you have the card, console.log the value and the suit(e.g. “5 of spades”, “queen of diamonds”).

// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1

// https://deckofcardsapi.com/api/deck/dzy3gw05ew6n/draw/?count=1

let promise = axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')

promise
    .then(resp => {
        let deckID = resp.data.deck_id
        return axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    })
    .then(resp => {
        let value = resp.data.cards[0].value
        let suit = resp.data.cards[0].suit
        console.log(`${value} of ${suit}`)
    })
    .catch(respError => console.log(respError))


// 2. Make a request to the deck of cards API to request a single card from a newly shuffled deck.Once you have the card, make a request to the same API to get one more card from the same deck.
// Once you have both cards, console.log the values and suits of both cards.
// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1

// https://deckofcardsapi.com/api/deck/dzy3gw05ew6n/draw/?count=1

let valueArr = []
let suitArr = []

let promise = axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')

promise
    .then(resp => {
        let deckID = resp.data.deck_id
        return axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/?count=1`)
    })
    .then(resp => {
        let value1 = resp.data.cards[0].value
        let suit1 = resp.data.cards[0].suit
        valueArr.push(value1)
        suitArr.push(suit1)
        return axios.get('https://deckofcardsapi.com/api/deck/dzy3gw05ew6n/draw/?count=1')
    })
    .then(resp => {
        let value2 = resp.data.cards[0].value
        let suit2 = resp.data.cards[0].suit
        valueArr.push(value2)
        suitArr.push(suit2)
        console.log(`${valueArr[0]} of ${suitArr[0]}`)
        console.log(`${valueArr[1]} of ${suitArr[1]}`)
    })


// 3. Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. Every time you click the button, display a new card, until there are no cards left in the deck.

// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1

// https://deckofcardsapi.com/api/deck/dzy3gw05ew6n/draw/?count=1
let deckID = null
form = document.querySelector('form')
img = document.querySelector('img')

let promise = axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')

promise
    .then(resp => {
        deckID = resp.data.deck_id
    })


form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
        .then(resp => {
            console.log(resp)
            let cardImg = resp.data.cards[0].image
            img.src = cardImg
        })
})



// Part 3 - Further Study

// 1.Figure out how to make a single request to the Pokemon API to get names and URLs for every pokemon in the database.
//     https://pokeapi.co/api/v2/pokemon?limit=1302

let promise = axios.get('https://pokeapi.co/api/v2/pokemon?limit=1302')

promise
    .then(resp => {
        let pokemonArr = resp.data.results
        for (obj of pokemonArr) {
            console.log(`Pokemon Name: ${obj.name}, URL: ${obj.url}`)
        }
    })
    .catch(err => console.log('Error:', err))

// 2. Once you have names and URLs of all the pokemon, pick three at random and make requests to their URLs.Once those requests are complete, console.log the data for each pokemon.

let urlArr = []
let threePokemonURLs = []

axios.get('https://pokeapi.co/api/v2/pokemon?limit=1302')
    .then(resp => {
        let pokemonArr = resp.data.results
        for (obj of pokemonArr) {
            urlArr.push(obj.url)
        }

        for (i = 1; i < 4; i++) {
            let randomNum = Math.round(Math.random() * resp.data.results.length)
            console.log(resp.data)
            let pokemonURL = urlArr[randomNum]
            threePokemonURLs.push(axios.get(pokemonURL))
        }
        return Promise.all(threePokemonURLs)
    })
    .then(arrWithResps => {
        for (resp of arrWithResps) {
            console.log(resp.data)
        }
    })


// 3. Start with your code from 2, but instead of logging the data on each random pokemon, store the name of the pokemon in a variable and then make another request, this time to that pokemon’s species URL(you should see a key of species in the data).Once that request comes back, look in the flavor_text_entries key of the response data for a description of the species written in English.If you find one, console.log the name of the pokemon along with the description you found.
// https://pokeapi.co/api/v2/pokemon-species/{id or name}/
let urlArr = []
let threePokemonURLs = []
let pokemonName = null

axios.get('https://pokeapi.co/api/v2/pokemon?limit=1302')
    .then(resp => {
        let pokemonArr = resp.data.results
        for (obj of pokemonArr) {
            urlArr.push(obj.url)
        }

        for (i = 1; i < 4; i++) {
            let randomNum = Math.round(Math.random() * 1302)
            let pokemonURL = urlArr[randomNum]
            threePokemonURLs.push(axios.get(pokemonURL))
        }
        return Promise.all(threePokemonURLs)
    })
    .then(arrWithResps => {
        pokemonName = arrWithResps[0].data.name
        return axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
    })
    .then(resp => {
        for (let text of resp.data.flavor_text_entries) {
            if (text.language.name === 'en') {
                console.log(`Pokemon Name: ${resp.data.name}`)
                console.log(`Description of species: ${text.flavor_text}`)
            }
        }
    })







