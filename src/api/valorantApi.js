// DIRECCION DE LA API: src/api/valorantApi.js


export async function fetchWeapons() {
    const url = 'https://valorant-api.com/v1/weapons';
    const response = await fetch(url);
    const data = await response.json();
    return data.data; 
}

// FUNCION PARA OBTENER LOS DETALLES DE UNA ARMA EN ESPECIFICO
export async function fetchWeaponDetails(uuid) {
    const url = `https://valorant-api.com/v1/weapons/${uuid}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data; 
}