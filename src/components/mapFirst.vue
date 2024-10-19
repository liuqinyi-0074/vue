<template>
  <div>
    <button class="back-button" @click="goHome">Back to HomePage</button>
    <div id="map" class="map-container"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

export default {
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoicWlueWlsaXUiLCJhIjoiY20yYWJ0NjRrMGVvajJrcHlrOTNqZ3FiZCJ9.7f6Qjb8Mk5lGWrf6BKPUXA';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-79.4512, 43.6568],
      zoom: 8
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: {
        color: 'orange'
      },
      placeholder: 'Search for places',
    });

    map.addControl(geocoder);

    geocoder.on('result', (e) => {
      const coords = e.result.geometry.coordinates;
      new mapboxgl.Marker({ color: 'green' })
        .setLngLat(coords)
        .addTo(map);
    });
  },
  methods: {
    goHome() {
      this.$router.push('/HomePage'); // Navigate to the HomePage route
    }
  }
};
</script>

<style scoped>
.map-container {
  position: absolute;
  top: 40px; /* Adjusted for the back button */
  bottom: 0;
  width: 100%;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.back-button:hover {
  background-color: #d32f2f;
}
</style>