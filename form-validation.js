function validateFormFields() {
  const required = ['pickup', 'drop', 'date', 'time', 'phone', 'name'];
  const allFilled = required.every(id => document.getElementById(id)?.value.trim() !== '');
  const button = document.getElementById('submitBtn');
  if (button) button.disabled = !allFilled;
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function checkGeofence() {
  const button = document.getElementById('submitBtn');
  if (pickupCoords && dropCoords) {
    const distance = haversineDistance(
      pickupCoords.lat(), pickupCoords.lng(),
      dropCoords.lat(), dropCoords.lng()
    );

    if (distance > 50) {
      alert("Pickup and drop locations must be within 50 km.");
      if (button) button.disabled = true;
    } else {
      validateFormFields();
    }
  }
}

function useCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const latlng = { lat, lng };

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results[0]) {
          document.getElementById('pickup').value = results[0].formatted_address;
          pickupCoords = new google.maps.LatLng(lat, lng);
          checkGeofence();
        } else {
          alert("Unable to retrieve address from location.");
        }
      });
    }, () => {
      alert("Location permission denied.");
    });
  } else {
    alert("Geolocation is not supported.");
  }
}

window.addEventListener("load", () => {
  ['pickup', 'drop', 'date', 'time', 'phone', 'name'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.addEventListener('input', validateFormFields);
  });
  validateFormFields();
});
