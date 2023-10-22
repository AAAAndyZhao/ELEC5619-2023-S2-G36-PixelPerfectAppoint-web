<template>
    <div class="app-map-show" ref="mapContainer">
        
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import GoogleMapLoader from '@/services/map'
import { ElMessage } from 'element-plus';

const mapContainer = ref(null);
let map;
let marker;
const props = defineProps({
    location: {
        type: Object,
        default: () => {}
    }
});

onMounted(async () => {
    const { Map } = await GoogleMapLoader.importLibrary('maps');
    map = new Map(mapContainer.value, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
    if (props.location.googleMapPlaceId){
        const geocoder = new google.maps.Geocoder();
        const { results } = await geocoder.geocode({
            placeId: props.location.googleMapPlaceId
        })
        if (results.length > 0){
            map.setCenter(results[0].geometry.location);
            map.setZoom(17);
            marker = new google.maps.Marker({map: map});
            marker.setPlace({
                placeId: props.location.googleMapPlaceId,
                location: results[0].geometry.location
            });
            marker.setVisible(true);
        }else{
            ElMessage.error('No location found');
        }
    }else{
        // todo
    }


});
</script>

<style scoped>
.app-map-show{
    width: 100%;
    min-height: 50vh;
    box-sizing: border-box;
}
</style>