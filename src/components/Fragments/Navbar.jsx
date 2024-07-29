import React from 'react';
import { Link } from 'react-router-dom';
import { usePokemon } from '../../contexts/PokemonContext';
import { useBerry } from '../../contexts/BerryContext';

const Navbar = () => {
    const { pokemonParty } = usePokemon();
    const pokemonPartyCount = pokemonParty.length;

    const { berryParty } = useBerry();
    const berryPartyCount = berryParty.length;

    return (
        <nav className="bg-gray-800 p-4 mb-8">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold">Home</Link>
                <div className="flex items-center space-x-8">
                    <Link to="/" className="text-white relative flex items-center">
                        <span>Pokemon List</span>
                        {pokemonPartyCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center h-6 w-6 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                {pokemonPartyCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/bag" className="text-white relative flex items-center">
                        <span>Bag</span>
                        {berryPartyCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center h-6 w-6 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                {berryPartyCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
