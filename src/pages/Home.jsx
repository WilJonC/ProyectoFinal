import React, { useState, useEffect } from 'react';
import { fetchWeapons } from '../api/valorantApi'; // Asegúrate de que el path sea correcto

function Home() {
    const [weapons, setWeapons] = useState([]);

    useEffect(() => {
        fetchWeapons().then(data => setWeapons(data));
    }, []);

    return (
        <div>
            {weapons.map(weapon => (
                <div key={weapon.uuid}>
                    <h3>{weapon.displayName}</h3>
                    <img src={weapon.displayIcon} alt={weapon.displayName} />
                </div>
            ))}
        </div>
    );
}

export default Home;
