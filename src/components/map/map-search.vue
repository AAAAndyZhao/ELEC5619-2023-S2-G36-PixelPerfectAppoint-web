<template>
    <div class="app-map-edit">
        <div class="app-map-container" ref="mapContainer">
            
        </div>
        <div class="app-search-container">
            <div class="app-map-search">
                <div class="app-place-search-input-wrapper">
                    <input class="app-place-search-input" ref="searchInput" type="text" placeholder="Search location" />
                </div>
                <el-button class="app-place-search-button" :icon="Search"
                    @click="triggerSearchBoxAutocompletion"></el-button>
            </div>
            <div class="app-search-result">
                <h3>Selected Location</h3>
                <el-input v-model="selectedDisplayedLocation" readonly />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import GoogleMapLoader from '@/services/map'
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue'

const emits = defineEmits(['update:location']);

const mapContainer = ref(null);
const searchInput = ref(null);
let map;
let marker;
let searchBox;
const props = defineProps({
    location: {
        type: Object,
        default: () => {}
    }
});
const selectedLocation = ref({
    apartmentNo: '',
    streetNo: '',
    streetName: '',
    city: '',
    state: '',
    stateCode: '',
    country: '',
    countryCode: '',
    zipCode: '',
    latitude: 0,
    longitude: 0,
    googleMapPlaceId: ''
});
const selectedDisplayedLocation = computed(() => {
    if (!selectedLocation.value.apartmentNo && !selectedLocation.value.streetNo && !selectedLocation.value.streetName && !selectedLocation.value.city && !selectedLocation.value.state && !selectedLocation.value.country && !selectedLocation.value.zipCode) {
        return 'No location selected';
    }
    return `${selectedLocation.value.apartmentNo ? selectedLocation.value.apartmentNo + '/ ' : ''}`
        + `${selectedLocation.value.streetNo ? selectedLocation.value.streetNo + ' ' : ''}`
        + `${selectedLocation.value.streetName ? selectedLocation.value.streetName + ', ' : ''}`
        + `${selectedLocation.value.city}, ${selectedLocation.value.state} ${selectedLocation.value.zipCode}, ${selectedLocation.value.country}`;
})

const markerPositionInMapFromLocation = async (location) => {
    // check if google is defined
    if (!map){
        return
    }
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
}
watchEffect(() => {
    if (!props.location) return;
    // sync selected location
    selectedLocation.value = props.location;
    if (props.location.googleMapPlaceId){
        markerPositionInMapFromLocation()
    }else{
        // todo
    }
})
onMounted(async () => {
    const { Map } = await GoogleMapLoader.importLibrary('maps');
    map = new Map(mapContainer.value, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
    if (props.location.googleMapPlaceId){
        markerPositionInMapFromLocation()
    }else{
        // todo
    }
    searchBox = new google.maps.places.SearchBox(searchInput.value);
    searchBox.addListener('places_changed', placesChanged);
});

const triggerSearchBoxAutocompletion = () => {
    const event = new Event('input', {
        'bubbles': true,
        'cancelable': true
    });
    searchInput.value.dispatchEvent(event);
}

const placesChanged = () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
        return;
    }

    // For demonstration purposes: zoom to the first place in the list
    const firstPlace = places[0];
    if (firstPlace.geometry.viewport) {
        map.fitBounds(firstPlace.geometry.viewport);
    } else {
        map.setCenter(firstPlace.geometry.location);
        map.setZoom(17);
    }
    // remove previous marker
    if (marker) {
        marker.setMap(null);
    }
    // add marker
    marker = new google.maps.Marker({
        map: map,
        position: firstPlace.geometry.location,
    });
    // update selected location
    if (firstPlace.address_components) {
        const addressComponents = firstPlace.address_components;
        selectedLocation.value.apartmentNo = addressComponents.find(component => component.types.includes('subpremise'))?.long_name || '';
        selectedLocation.value.streetNo = addressComponents.find(component => component.types.includes('street_number'))?.long_name || '';
        selectedLocation.value.streetName = addressComponents.find(component => component.types.includes('route'))?.long_name || '';
        selectedLocation.value.city = addressComponents.find(component => component.types.includes('locality'))?.long_name || '';
        selectedLocation.value.state = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '';
        selectedLocation.value.stateCode = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.short_name || '';
        selectedLocation.value.country = addressComponents.find(component => component.types.includes('country'))?.long_name || '';
        selectedLocation.value.countryCode = addressComponents.find(component => component.types.includes('country'))?.short_name || '';
        selectedLocation.value.zipCode = addressComponents.find(component => component.types.includes('postal_code'))?.long_name || '';
        // update latitude and longitude
        selectedLocation.value.latitude = firstPlace.geometry.location.lat();
        selectedLocation.value.longitude = firstPlace.geometry.location.lng();
        // update google map place id
        selectedLocation.value.googleMapPlaceId = firstPlace.place_id;
    }
}
watchEffect(() => {
    if (!selectedLocation.value) return;
    emits('update:location', selectedLocation.value);
});
</script>

<style scoped>
.app-map-edit{
    width: 100%;
    height: 100%;
    min-height: 50vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
}
.app-map-container{
    width: 70%;
    height: 100%;
    min-height: 50vh;
}

.app-search-container{
    width: 30%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
}
.app-place-search-input-wrapper {
    height: 40px;
    width: calc(100% - 50px);
    display: inline-flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
    background-image: none;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    cursor: text;
    transition: var(--el-transition-box-shadow);
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    --el-input-height: var(--el-component-size-large);
    font-size: 14px;
    box-sizing: border-box;
    padding: 1px 15px;
    margin-bottom: 10px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 999;
}

.app-place-search-input-wrapper:focus {
    outline: 0;
}

.app-place-search-input {
    height: calc(100% - 2px);
    width: 100%;
    border: none;
}

/* change input placeholder font color */
.app-place-search-input::-webkit-input-placeholder {
    color: #a8abb2;
}

.app-place-search-button {
    height: 40px;
}

.app-place-search-input:focus {
    outline: 0;
}

.app-place-search-input-wrapper:focus-within {
    box-shadow: 0 0 0 1px #409EFF inset;
}
</style>