function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function validateFormFields() {
  const fields = ['pickup', 'drop', 'date', 'time', 'phone', 'name'];
  const feedback = document.getElementById('feedback');
  const button = document.getElementById('submitBtn');
  const allFilled = fields.every(id => document.getElementById(id)?.value.trim() !== '');

  if (!allFilled) {
    feedback.textContent = "Please fill all fields to proceed.";
    button.disabled = true;
    return false;
  } else {
    feedback.textContent = "";
  }

  if (pickupCoords && dropCoords) {
    const distance = haversineDistance(
      pickupCoords.lat(), pickupCoords.lng(),
      dropCoords.lat(), dropCoords.lng()
    );
    if (distance > 50) {
      feedback.textContent = "Drop location is too far. We serve within 50 km.";
      button.disabled = true;
      return false;
    }
  }

  button.disabled = false;
  feedback.textContent = "";
  return true;
}

function useCurrentLocation() {
  const feedback = document.getElementById('feedback');
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
          feedback.textContent = "Unable to retrieve location address.";
        }
      });
    }, () => {
      feedback.textContent = "Location access denied.";
    });
  } else {
    feedback.textContent = "Geolocation is not supported.";
  }
}

function checkGeofence() {
  validateFormFields(); // includes distance check
}

window.addEventListener("load", () => {
  ['pickup', 'drop', 'date', 'time', 'phone', 'name'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.addEventListener('input', validateFormFields);
  });

  validateFormFields(); // initial state
});
