import React, { createContext, useState, useContext } from 'react';

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
    const [pokemonParty, setPokemonParty] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');

    const addToTeam = (pokemon) => {
        if (pokemonParty.length < 5 && !pokemonParty.some(p => p.url === pokemon.url)) {
            setPokemonParty([...pokemonParty, pokemon]);
        } else if (pokemonParty.some(p => p.url === pokemon.url)) {
            setAlertMessage('Pokemon is already in the party!');
        } else {
            setAlertMessage('Party is full!');
        }
    };

    const removeFromParty = (pokemon) => {
        setPokemonParty(pokemonParty.filter(p => p.url !== pokemon.url));
    };

    return (
        <PokemonContext.Provider value={{ pokemonParty, addToTeam, removeFromParty, alertMessage, setAlertMessage }}>
            {children}
        </PokemonContext.Provider>
    );
};

export const usePokemon = () => useContext(PokemonContext);
