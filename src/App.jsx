import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importar Font Awesome
import WeaponList from './components/WeaponList';
import './App.css'; // Importa el archivo de estilos personalizados

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInitiated, setSearchInitiated] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSearchInitiated(false);  // Resetear la búsqueda si se borra el input
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
            {/* Puedes agregar más rutas si es necesario */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
