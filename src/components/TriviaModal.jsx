import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function TriviaModal({ weapons, onClose }) {
    const [currentWeapon, setCurrentWeapon] = useState(null);
    const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set()); // Almacena los UUIDs de las armas respondidas correctamente

    useEffect(() => {
        selectRandomWeapon();
    }, [weapons, answeredCorrectly]);

    function selectRandomWeapon() {
        let availableWeapons = weapons.filter(weapon => !answeredCorrectly.has(weapon.uuid));
        if (availableWeapons.length === 0) {
            Swal.fire('¡Felicidades!', 'Has respondido correctamente a todas las armas.', 'success').then(onClose);
        } else {
            let randomWeapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
            setCurrentWeapon(randomWeapon);
        }
    }

    function generateOptions(correctWeapon) {
        const allNames = weapons.map(weapon => weapon.displayName);
        const incorrectNames = allNames.filter(name => name !== correctWeapon.displayName);
        const shuffledOptions = [correctWeapon.displayName, ...incorrectNames.sort(() => 0.5 - Math.random()).slice(0, 2)].sort(() => 0.5 - Math.random());
        return shuffledOptions;
    }

    function handleOptionClick(option) {
        if (option === currentWeapon.displayName) {
            setAnsweredCorrectly(new Set(answeredCorrectly.add(currentWeapon.uuid)));
        } else {
            Swal.fire('Incorrecto', 'Respuesta incorrecta. Inténtalo de nuevo.', 'error');
        }
    }

    return (
        <Modal show={true} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Trivia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {currentWeapon && (
                    <div className="text-center">
                        <img src={currentWeapon.displayIcon} alt={currentWeapon.displayName} className="img-fluid mb-3" />
                        <div className="btn-group-vertical w-100">
                            {generateOptions(currentWeapon).map((option, index) => (
                                <Button key={index} variant="outline-primary" className="mb-2" onClick={() => handleOptionClick(option)}>
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TriviaModal;
