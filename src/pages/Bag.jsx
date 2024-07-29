import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Fragments/Navbar';
import { useBerry } from '../contexts/BerryContext';
import Title from '../components/Elements/Title';
import Figure from '../components/Elements/Figure';
import Eye from '../components/Elements/Eye';
import Button from '../components/Elements/Button';

const BerryList = () => {
    const [berryList, setBerryList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedBerry, setSelectedBerry] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const pageSize = 12;
    const { berryParty, addToParty, removeFromParty, alertMessage, setAlertMessage } = useBerry();

    useEffect(() => {
        const fetchBerries = async (page) => {
            try {
                const offset = (page - 1) * pageSize;
                const response = await axios.get(`https://pokeapi.co/api/v2/berry?limit=${pageSize}&offset=${offset}`);
                const berries = response.data.results;

                const detailedBerries = await Promise.all(
                    berries.map(async (berry) => {
                        const berryDetails = await axios.get(berry.url);
                        const itemDetails = await axios.get(berryDetails.data.item.url);

                        return {
                            name: berry.name,
                            item: {
                                name: berryDetails.data.item.name,
                                url: berryDetails.data.item.url,
                                image: itemDetails.data.sprites.default
                            },
                            firmness: berryDetails.data.firmness.name,
                            flavors: berryDetails.data.flavors,
                            natural_gift_type: berryDetails.data.natural_gift_type,
                            natural_gift_power: berryDetails.data.natural_gift_power
                        };
                    })
                );

                setBerryList(detailedBerries);
                setTotalPages(Math.ceil(response.data.count / pageSize));
            } catch (error) {
                console.error('Error fetching berry list:', error);
            }
        };

        fetchBerries(currentPage);
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

    const handleShowModal = async (berry) => {
        try {
            const itemDetails = await axios.get(berry.item.url);
            const effectEntry = itemDetails.data.effect_entries.find(entry => entry.language.name === 'en') || { effect: 'No effect', short_effect: 'No short effect' };
            setSelectedBerry({
                ...berry,
                effect: effectEntry.effect,
                short_effect: effectEntry.short_effect
            });
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBerry(null);
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
            <Navbar bagPartyCount={berryParty.length} />
            <div className="container mx-auto">
                <Title Tag="h2" variant="text-3xl font-bold mb-4">Bag</Title>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {berryParty.map((berry, index) => (
                        <li key={index} className="card shadow-lg compact side bg-base-100">
                            <div className="card-body flex justify-between items-center">
                                <div className="flex items-center">
                                    <Figure image={berry.item.image} name={berry.name} variant="w-10 h-10 mr-2"></Figure>
                                    <Title Tag="span" variant="card-title">{berry.name}</Title>
                                    <span className="ml-2 text-gray-500">{`(${berry.count})`}
                                        <Eye pokemon={berry} onClick={handleShowModal} variant="btn btn-ghost btn-xs mx-1">👁</Eye>
                                    </span>
                                </div>
                                <div className="card-actions">
                                    <Button pokemon={berry} variant="btn btn-error btn-sm" onClick={removeFromParty}>Reduce</Button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <Title Tag="h1" variant="text-3xl font-bold my-6">Berry List</Title>
                {alertMessage && (
                    <div className="alert alert-success mb-4">
                        {alertMessage}
                    </div>
                )}
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {berryList.map((berry, index) => (
                        <li key={index} className="card shadow-lg compact side bg-base-100">
                            <div className="card-body flex justify-between items-center">
                                <div className="flex items-center">
                                    <Figure image={berry.item.image} name={berry.name} variant="w-10 h-10 mr-2"></Figure>
                                    <Title Tag="span" variant="card-title">{berry.name}
                                        <Eye pokemon={berry} onClick={handleShowModal} variant="btn btn-ghost btn-xs">👁</Eye>
                                    </Title>
                                </div>
                                <div className="card-actions">
                                    {berryParty.some(b => b.name === berry.name) ? (
                                        <div className="flex items-center space-x-2">
                                            <button className="btn btn-sm" disabled>
                                                In the Bag ({berryParty.find(b => b.name === berry.name)?.count || 0})
                                            </button>
                                            {berryParty.find(b => b.name === berry.name)?.count < 50 && (
                                                <Button pokemon={berry} variant="btn btn-primary btn-sm" onClick={addToParty}>+</Button>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => addToParty({ ...berry, count: 1 })}
                                        >
                                            Add to Bag
                                        </button>
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

                {showModal && selectedBerry && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <form method="dialog">
                                <Button pokemon={selectedBerry} variant="btn btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseModal}>✕</Button>
                            </form>
                            <Title Tag="h3" variant="font-bold text-lg mb-1">{selectedBerry.name}</Title>
                            <Figure image={selectedBerry.item.image} name={selectedBerry.name} variant=""></Figure>
                            <Title Tag="p" variant="py-4">{selectedBerry.effect}</Title>
                            <Title Tag="p" variant="">{selectedBerry.short_effect}</Title>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BerryList;
