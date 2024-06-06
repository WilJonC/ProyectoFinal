// src/api/valorantApi.js

// Función existente para obtener todas las armas
export async function fetchWeapons() {
    const url = 'https://valorant-api.com/v1/weapons';
    const response = await fetch(url);
    const data = await response.json();
    return data.data; // Asegúrate de que 'data' es el correcto según la estructura de la API.
}

// Nueva función para obtener detalles de una arma específica
export async function fetchWeaponDetails(uuid) {
    const url = `https://valorant-api.com/v1/weapons/${uuid}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data; // Ajusta según la estructura real de la respuesta de la API.
}