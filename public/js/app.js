import { OpenStreetMapProvider } from 'leaflet-geosearch';
const provider = new OpenStreetMapProvider();

const lat = document.querySelector('#lat').value || -34.85164193505971;
const lng = document.querySelector('#lng').value || -56.180172630904934;

const map = L.map('mapa').setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;

const colocarPin = (coordenadas, direccion) => {
  marker = new L.marker(coordenadas, {
    draggable: true,
    autoPan: true,
  })
    .addTo(map)
    .bindPopup(direccion)
    .openPopup();

  markers.addLayer(marker);
};

const detectarMov = () => {
  marker.on('moveend', function (ev) {
    marker = ev.target;
    const posicion = marker.getLatLng();

    map.panTo(new L.LatLng(posicion.lat, posicion.lng));
    const pos = [posicion.lat, posicion.lng].toString();
    provider.search({ query: pos }).then((res) => {
      const direccion2 = res[0].label;
      const coord2 = res[0].bounds[0];
      llenarInputs(direccion2, coord2);
      marker.bindPopup(direccion2);
      marker.openPopup();
    });
  });
};

//colocar el pin en edicion meeti
if (lat && lng) {
  colocarPin([lat, lng], document.querySelector('#direccion').value);
  detectarMov();
}

//carga el mapa de forma global
document.addEventListener('DOMContentLoaded', () => {
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //bscar la dir
  const buscador = document.querySelector('#formbuscador');
  buscador.addEventListener('input', buscarDireccion);
});

function buscarDireccion(e) {
  //empieza a buscar una vez se escribieron mas de 8 letras
  if (e.target.value.length > 8) {
    //si existe un pin anterior limpiarlo
    // markers.clearLayers();

    // const geocodeService = L.esri.Geocoding.geocodeService();
    provider.search({ query: e.target.value }).then((res) => {
      const direccion = res[0].label;
      const coord = res[0].bounds[0];

      //mostrar el mapa
      map.setView(coord, 15);

      //colocar pin
      colocarPin(coord, direccion);

      markers.addLayer(marker);
      llenarInputs(direccion, coord);

      //detectar movimiento del pin
      detectarMov();
    });
  }
}

function llenarInputs(direccion, coord) {
  //llena los inputs del html
  document.querySelector('#direccion').value = direccion || '';
  document.querySelector('#lat').value = coord[0] || '';
  document.querySelector('#lng').value = coord[1] || '';
}
