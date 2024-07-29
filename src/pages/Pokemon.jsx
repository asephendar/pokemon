import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Fragments/Navbar';
import { usePokemon } from '../contexts/PokemonContext';
import Title from '../components/Elements/Title';
import Button from '../components/Elements/Button';
import Figure from '../components/Elements/Figure';
import Eye from '../components/Elements/Eye';

const PokemonList = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const pageSize = 12;
    const { pokemonParty, addToTeam, removeFromParty, alertMessage, setAlertMessage } = usePokemon();

    useEffect(() => {
        const fetchPokemon = async (page) => {
            try {
                const offset = (page - 1) * pageSize;
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`);
                const pokemonData = response.data.results;

                const detailedPokemonData = await Promise.all(
                    pokemonData.map(async (pokemon) => {
                        const pokemonDetails = await axios.get(pokemon.url);
                        return {
                            name: pokemon.name,
                            sprite: pokemonDetails.data.sprites.front_default,
                            sprites: pokemonDetails.data.sprites,
                            stats: pokemonDetails.data.stats,
                            url: pokemon.url
                        };
                    })
                );

                setPokemonList(detailedPokemonData);
                setTotalPages(Math.ceil(response.data.count / pageSize));
            } catch (error) {
                console.error('Error fetching the Pokemon list:', error);
            }
        };
        fetchPokemon(currentPage);
    }, [currentPage]);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleShowModal = (pokemon) => {
        setSelectedPokemon(pokemon);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPokemon(null);
    };

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage, setAlertMessage]);

    return (
        <>
            <Navbar pokemonPartyCount={pokemonParty.length} />
            <div className="container mx-auto">
                <Title>Pokemon Team</Title>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {pokemonParty.map((pokemon, index) => (
                        <li key={index} className="card shadow-xl">
                            <div className="card-body">
                                <div className="flex flex-col items-center">
                                    <Title Tag="h2" variant="card-title mb-4">{pokemon.name}
                                        <Eye pokemon={pokemon} onClick={handleShowModal}>👁</Eye>
                                    </Title>
                                    <div className="absolute top-2 right-2 flex space-x-1">
                                        <Button pokemon={pokemon} variant="btn btn-ghost btn-xs" onClick={removeFromParty}>✕
                                        </Button>
                                    </div>
                                    <Figure image={pokemon.sprites.other.showdown.front_default} name={pokemon.name} variant="w-15 h-30">
                                    </Figure>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <Title>Pokemon List</Title>
                {alertMessage && (
                    <div className="alert alert-success mb-4">
                        {alertMessage}
                    </div>
                )}
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pokemonList.map((pokemon, index) => (
                        <li key={index} className="card card-side bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex flex-col items-center">
                                    <Title Tag="h2" variant="card-title mb-4">{pokemon.name}
                                        <Eye pokemon={pokemon} onClick={handleShowModal}>👁</Eye>
                                    </Title>
                                    <Figure image={pokemon.sprite} name={pokemon.name}></Figure>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="card-actions justify-end">
                                    {pokemonParty.some(p => p.url === pokemon.url) ? (
                                        <Button variant="btn btn-sm btn-disabled">In the Team</Button>
                                    ) : (
                                        <Button pokemon={pokemon} onClick={addToTeam}>Add to Team</Button>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="flex justify-between my-8">
                    <button
                        className="btn btn-neutral"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="text-xl">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        className="btn btn-neutral"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>

                {showModal && selectedPokemon && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="modal-box">
                            <form method="dialog">
                                <Button variant="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseModal}>✕
                                </Button>
                            </form>
                            <Title Tag="h3" variant="text-2xl font-bold mb-4 text-center">{selectedPokemon.name}</Title>
                            <div className="flex justify-center">
                                <Figure variant="w-23 h-30" image={selectedPokemon.sprites.other.dream_world.front_default} name={selectedPokemon.name}>
                                </Figure>
                            </div>
                            <div className="flex justify-between">
                                <Figure variant="w-15 h-30" image={selectedPokemon.sprites.other.showdown.front_default} name={selectedPokemon.name}></Figure>
                            </div>
                            <Title Tag="h4" variant="text-xl font-bold mt-4 mb-2">Stats</Title>
                            <div className="flex flex-wrap gap-4">
                                {selectedPokemon.stats.map((stat, index) => (
                                    <div key={index} className="flex-1 min-w-[200px]">
                                        <div className="flex justify-between mb-2 shadow-md py-1 px-1">
                                            <Title Tag="span" variant="font-bold">{stat.stat.name}</Title>
                                            <Title Tag="span" variant="font-bold">{stat.base_stat}</Title>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PokemonList;
