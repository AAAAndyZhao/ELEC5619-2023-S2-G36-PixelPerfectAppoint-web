<template>
    <div class="app-location-edit">
        <div class="app-map-container">
            <map-search :location="location"
            @update:location="handleLocationUpdate" />
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MapSearch from '@/components/map/map-search.vue'
import MapShow from '@/components/map/map-show.vue'
const emits = defineEmits(['update:location']);

const props = defineProps({
    location: {
        type: Object,
        default: () => {}
    }
})

const handleLocationUpdate = (location) => {
    emits('update:location', location)
}
</script>

<style scoped>
</style>