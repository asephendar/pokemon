import React, { createContext, useState, useContext } from 'react';

const BerryContext = createContext();

export const BerryProvider = ({ children }) => {
    const [berryParty, setBerryParty] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');

    const maxPartySize = 50;

    const addToParty = (berry) => {
        const berryTypeCount = berryParty.find(b => b.name === berry.name)?.count || 0;

        if (berryParty.length < maxPartySize && berryTypeCount < 50) {
            const existingBerry = berryParty.find(b => b.name === berry.name);
            if (!existingBerry) {
                setBerryParty([...berryParty, { ...berry, count: 1 }]);
            } else {
                const updatedBerry = {
                    ...existingBerry,
                    count: existingBerry.count + 1
                };
                const updatedParty = berryParty.map(b => (b.name === berry.name ? updatedBerry : b));
                setBerryParty(updatedParty);
            }
        } else if (berryTypeCount >= 50) {
            setAlertMessage('Maximum 50 berries of the same type allowed in the party!');
        } else {
            setAlertMessage('Party is full!');
        }
    };

    const removeFromParty = (berry) => {
        const updatedParty = berryParty.map(b => (b.name === berry.name ? { ...b, count: b.count - 1 } : b));
        setBerryParty(updatedParty.filter(b => b.count > 0)); // Remove berry if count drops to 0
    };

    return (
        <BerryContext.Provider value={{ berryParty, addToParty, removeFromParty, alertMessage, setAlertMessage }}>
            {children}
        </BerryContext.Provider>
    );
};

export const useBerry = () => useContext(BerryContext);
