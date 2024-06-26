import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import WeaponList from './components/WeaponList';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInitiated, setSearchInitiated] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSearchInitiated(false);  // RESETEAMOS LA BUSQUEDA SI SE BORRA EL CONTENIDO DEL INPUT
  };

  const performSearch = () => {
    if (searchTerm.trim() !== '') {
      setSearchInitiated(true);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <div className="container mt-5">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search for weapons..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={performSearch}>
                <i className="fas fa-search"></i> Buscar
              </button>
            </div>
          </div>
          <Routes>
            <Route path="/" element={<WeaponList searchTerm={searchTerm} searchInitiated={searchInitiated} />} />
            {/* ¡DE MOMENTO NO AGREGARÉ MÁS! */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
