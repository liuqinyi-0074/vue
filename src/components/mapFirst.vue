<template>
  <div id="map" class="map-container"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

export default {
  mounted() {
    // Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoicWlueWlsaXUiLCJhIjoiY20yYWJ0NjRrMGVvajJrcHlrOTNqZ3FiZCJ9.7f6Qjb8Mk5lGWrf6BKPUXA';

    // Initialize the map
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // map style
      center: [-79.4512, 43.6568], // starting position [lng, lat]
      zoom: 8 // starting zoom
    });

    // Add Mapbox Geocoder (for place search)
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: {
        color: 'orange'
      },
      placeholder: 'Search for places',
    });

    // Add geocoder to the map
    map.addControl(geocoder);


    // Add more markers dynamically from search results
    geocoder.on('result', (e) => {
      const coords = e.result.geometry.coordinates;
      new mapboxgl.Marker({ color: 'green' })
        .setLngLat(coords)
        .addTo(map);
    });
  }
};
</script>

<style scoped>
.map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>