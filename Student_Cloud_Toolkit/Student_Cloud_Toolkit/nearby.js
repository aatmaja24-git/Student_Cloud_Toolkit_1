async function searchNearby() {
const lat = document.getElementById("latitude").value;
const lon = document.getElementById("longitude").value;
const type = document.getElementById("placeType").value;
let radius = document.getElementById("radius").value;

// Convert km → meters
if (radius) radius = radius * 1000;

if (!lat || !lon) {
alert("Enter latitude and longitude");
return;
}

const apiUrl = `http://nearby-api-env.eba-z23r7ruf.us-east-1.elasticbeanstalk.com/nearby?lat=${lat}&lon=${lon}${type ? `&type=${type}` : ''}${radius ? `&radius=${radius}` : ''}`;

try {
const res = await fetch(apiUrl);
if (!res.ok) throw new Error("API not responding");

const data = await res.json();
displayNearbyResults(data);

} catch (error) {
console.error(error);
document.getElementById("nearbyResults").innerText = "Error fetching nearby places (check console)";
}
}

// Display results
function displayNearbyResults(data) {
let html = `<p><b>Weather:</b> ${data.weather.temperature}°C | ${data.weather.description}</p>`;
html += `<h3>Nearby Places (from my API)</h3>`;

if (data.places.length === 0) {
html += `<p>No places found.</p>`;
} else {
data.places.forEach(place => {
html += `
<div class="assignment-card">
<h4>${place.name}</h4>
<p>${place.distanceMeters.toFixed(1)} m · ${place.placeType || 'N/A'}</p>
<p>Lat: ${place.lat.toFixed(5)}, Lon: ${place.lon.toFixed(5)} · Source: ${place.source}</p>
<p>${place.address || ''}</p>
</div>
`;
});
}

document.getElementById("nearbyResults").innerHTML = html;
}

// Use current location
function useCurrentLocation() {
if (!navigator.geolocation) {
alert("Geolocation not supported");
return;
}
navigator.geolocation.getCurrentPosition(position => {
document.getElementById("latitude").value = position.coords.latitude;
document.getElementById("longitude").value = position.coords.longitude;
});
}

// Clear results
function clearNearbyResults() {
document.getElementById("nearbyResults").innerHTML = "";
}