import axios from 'axios';

const axios = require('axios');

async function getPokemonList() {
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10');
        const pokemonList = response.data.results;
        console.log(pokemonList);
    } catch (error) {
        console.error('Error fetching the Pokemon list:', error);
    }
}

getPokemonList();
