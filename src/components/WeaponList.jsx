import React, { useState, useEffect } from 'react';
import { fetchWeapons } from '../api/valorantApi';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import TriviaModal from './TriviaModal';
import 'bootstrap/dist/css/bootstrap.min.css'; // BOOTSTRAP
import '@fortawesome/fontawesome-free/css/all.min.css'; // FONT AWESOME ICONS
import './WeaponList.css';

function WeaponList({ searchTerm, searchInitiated }) {
    const [weapons, setWeapons] = useState([]);
    const [selectedWeapon, setSelectedWeapon] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchCount, setSearchCount] = useState(0);
    const [showTriviaButton, setShowTriviaButton] = useState(false);
    const [showTriviaModal, setShowTriviaModal] = useState(false);
    const [selectedWeapons, setSelectedWeapons] = useState(new Set()); // Para manejar selecciones múltiples

    useEffect(() => {
        const savedWeapons = localStorage.getItem('weapons');
        const savedSearchCount = localStorage.getItem('searchCount');

        if (savedWeapons) {
            const weaponsArray = JSON.parse(savedWeapons);
            setWeapons(weaponsArray);
            setSearchCount(weaponsArray.length);
        }

        if (savedSearchCount) {
            const count = JSON.parse(savedSearchCount);
            if (count >= 3) {
                setShowTriviaButton(true);
            }
        }
    }, []);

    useEffect(() => {
        if (weapons.length > 0) {
            localStorage.setItem('weapons', JSON.stringify(weapons));
        }
        localStorage.setItem('searchCount', JSON.stringify(searchCount));
    }, [weapons, searchCount]);

    useEffect(() => {
        if (searchInitiated && searchTerm.trim() !== '') {
            fetchWeapons().then(data => {
                const newFilteredWeapons = data.filter(weapon =>
                    weapon.displayName.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const updatedWeapons = [
                    ...weapons,
                    ...newFilteredWeapons.filter(newWeapon => !weapons.find(prevWeapon => prevWeapon.uuid === newWeapon.uuid))
                ];
                setWeapons(updatedWeapons);
                setSearchCount(updatedWeapons.length);
            });
        }
    }, [searchInitiated, searchTerm]);

    useEffect(() => {
        if (searchCount >= 3) {
            setShowTriviaButton(true);
        } else {
            setShowTriviaButton(false);
        }
    }, [searchCount]);

    const handleShowDetails = weapon => {
        setSelectedWeapon(weapon);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeleteWeapon = weaponId => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, bórralo!'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedWeapons = weapons.filter(weapon => weapon.uuid !== weaponId);
                setWeapons(updatedWeapons);
                localStorage.setItem('weapons', JSON.stringify(updatedWeapons));
                setSearchCount(updatedWeapons.length);
                Swal.fire(
                    '¡Borrado!',
                    'El arma ha sido borrada.',
                    'success'
                );
            }
        });
    };

    const handleWeaponSelect = uuid => {
        const newSelectedWeapons = new Set(selectedWeapons);
        if (newSelectedWeapons.has(uuid)) {
            newSelectedWeapons.delete(uuid);
        } else {
            newSelectedWeapons.add(uuid);
        }
        setSelectedWeapons(newSelectedWeapons);
    };

    const deleteSelectedWeapons = () => {
        const updatedWeapons = weapons.filter(weapon => !selectedWeapons.has(weapon.uuid));
        setWeapons(updatedWeapons);
        setSelectedWeapons(new Set()); // Clear selections
        localStorage.setItem('weapons', JSON.stringify(updatedWeapons));
        setSearchCount(updatedWeapons.length);
    };

    const handleStartTrivia = () => {
        setShowTriviaModal(true);
        document.getElementById('main-content').classList.add('blurred'); // DESENFOQUE DEL FONDO EN LA VENTANA MODAL
        document.getElementById('overlay').style.display = 'block';
    };

    const handleCloseTrivia = () => {
        setShowTriviaModal(false);
        document.getElementById('main-content').classList.remove('blurred'); // QUITAMOS EL DESENFOQUE
        document.getElementById('overlay').style.display = 'none';
    };

    const handleDeleteWeapon1 = weaponId => {
        if (selectedWeapons.size > 0) {
            const updatedWeapons = weapons.filter(weapon => !selectedWeapons.has(weapon.uuid));
            setWeapons(updatedWeapons);
            setSelectedWeapons(new Set());
        } else {
            setWeapons([]);
        }
        localStorage.setItem('weapons', JSON.stringify([]));
        setSearchCount(0);
    };

    const loadAllWeapons = () => {
        fetchWeapons().then(weaponsData => {
            setWeapons(weaponsData);
            setSearchCount(weaponsData.length);
        }).catch(error => {
            console.error('Error loading all weapons:', error);
        });
    };

    return (
        <div id="main-content" className="row">
            <div className="col-12 text-center my-3">
                <button className="btn btn-info mx-2" onClick={loadAllWeapons}>
                    <i className="fas fa-globe"></i> Mostrar Todas las Armas
                </button>
                <button className="btn btn-danger mx-2" onClick={handleDeleteWeapon1}>
                    <i className="fas fa-times-circle"></i> Borrar Seleccionadas
                </button>
            </div>
            <div id="overlay" className="overlay"></div>
            {weapons.map((weapon, index) => (
                <div className="col-md-4 mb-4" key={index}>
                    <div className="card shadow-sm h-100">
                        <img src={weapon.displayIcon} alt={weapon.displayName} className="card-img-top" style={{ height: '225px', objectFit: 'contain' }} />
                        <div className="card-body">
                            <input
                                type="checkbox"
                                checked={selectedWeapons.has(weapon.uuid)}
                                onChange={() => handleWeaponSelect(weapon.uuid)}
                                className="weapon-checkbox"
                            />
                            <h5 className="card-title">{weapon.displayName}</h5>
                            <div className="btn-group">
                                <button className="btn btn-primary" onClick={() => handleShowDetails(weapon)}>
                                    <i className="fas fa-info-circle"></i> Ver detalles
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDeleteWeapon(weapon.uuid)}>
                                    <i className="fas fa-trash"></i> Borrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {selectedWeapon && (
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedWeapon.displayName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <img src={selectedWeapon.displayIcon} alt={selectedWeapon.displayName} className="img-fluid mb-3" />
                        </div>
                        <p><strong>Categoría:</strong> {selectedWeapon.category}</p>
                        <p><strong>Coste:</strong> {selectedWeapon.shopData ? selectedWeapon.shopData.cost : 'N/A'}</p>
                        <p><strong>Tamaño del cargador:</strong> {selectedWeapon.weaponStats ? selectedWeapon.weaponStats.magazineSize : 'N/A'}</p>
                        <p><strong>Cadencia de fuego:</strong> {selectedWeapon.weaponStats ? selectedWeapon.weaponStats.fireRate : 'N/A'}</p>
                        <p><strong>Tiempo de recarga:</strong> {selectedWeapon.weaponStats ? selectedWeapon.weaponStats.reloadTimeSeconds + " segundos" : 'N/A'}</p>
                        <p><strong>Rango de daño:</strong> {selectedWeapon.weaponStats && selectedWeapon.weaponStats.damageRanges ? selectedWeapon.weaponStats.damageRanges.map(range =>
                            `${range.rangeStartMeters}m - ${range.rangeEndMeters}m: ${range.bodyDamage} daño corporal`
                        ).join(', ') : 'N/A'}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {showTriviaButton && (
                <div className="col-12 text-center mt-4">
                    <button className="btn btn-warning" onClick={handleStartTrivia}>
                        <i className="fas fa-question-circle"></i> Iniciar Trivia
                    </button>
                </div>
            )}

            {showTriviaModal && (
                <TriviaModal weapons={weapons} onClose={handleCloseTrivia} />
            )}
        </div>
    );
}

export default WeaponList;
