import { Loader } from "@googlemaps/js-api-loader"
const loader = new Loader({
    apiKey: $PUBLIC.GOOGLE_MAP_API_KEY,
    version: "weekly",
    libraries: ["places"],
    language: "en",
    region: "AU"
});
export default loader