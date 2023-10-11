<template>
    <div class="app-appointment-create-location">
        <div class="app-title">
            <h3>Appointment Location</h3>
        </div>
        <div class="app-content">
            <div class="app-map-wrapper">
                <div class="app-map" ref="mapContainer"></div>
            </div>
            <el-card class="app-map-info">
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
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import GoogleMapLoader from '@/services/map'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
    data: {
        type: Object,
        default: () => { }
    }
});
const emits = defineEmits(['data-update']);

const mapContainer = ref(null);
const searchInput = ref(null);
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
let map;
let searchBox;
let marker;

const triggerSearchBoxAutocompletion = () => {
    const event = new Event('input', {
        'bubbles': true,
        'cancelable': true
    });
    searchInput.value.dispatchEvent(event);
}

const placesChanged = () => {
    const places = searchBox.getPlaces();
    console.log(places)

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
    console.log(selectedLocation.value)
}
const syncDataToParent = () => {
    emits('data-update', 'location', { ...selectedLocation.value });
}
watchEffect(() => {
    if (!selectedLocation.value) return;
    syncDataToParent();
});
watchEffect(() => {
    if (!props.data) return;
    if (!props.data.latitude || !props.data.longitude) return;
    console.log('props.data', props.data)
    Object.assign(selectedLocation.value, props.data);
});

onMounted(async () => {
    await GoogleMapLoader.load()
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(mapContainer.value, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
    searchBox = new google.maps.places.SearchBox(searchInput.value);
    searchBox.addListener('places_changed', placesChanged);
})
</script>

<style scoped>
.app-appointment-create-location {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .app-title {
        height: 36px;
        width: 100%;
        box-sizing: border-box;
        padding: 0;
        text-align: left;

        h3 {
            margin-block-start: 0;
        }
    }

    .app-content {
        height: calc(100% - 36px);
        width: 100%;
        box-sizing: border-box;
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;

        .app-map-wrapper {
            height: 100%;
            width: 70%;
            box-sizing: border-box;
            padding: 0;
        }

        .app-map-info {
            height: 100%;
            width: 28%;
            box-sizing: border-box;
            padding: 10px;
        }
    }
}

.app-map {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
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
}</style>