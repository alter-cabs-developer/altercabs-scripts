function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function checkGeofence() {
  const button = document.getElementById('submitBtn');
  const pickupInput = document.getElementById('pickup');
  const dropInput = document.getElementById('drop');
  const feedback = document.getElementById("global-feedback");

  if (pickupCoords && dropCoords) {
    const distance = haversineDistance(
      pickupCoords.lat(), pickupCoords.lng(),
      dropCoords.lat(), dropCoords.lng()
    );

    if (distance > 50) {
      button.disabled = true;
      feedback.textContent = "❌ Pickup and drop locations must be within 50 km.";
    } else {
      button.disabled = false;
      feedback.textContent = "";
    }
  }
}

let pickupCoords = null;
let dropCoords = null;

function initAutocomplete() {
  const pickupInput = document.getElementById('pickup');
  const dropInput = document.getElementById('drop');

  if (!pickupInput || !dropInput) return;

  const options = {
    componentRestrictions: { country: "in" },
    fields: ["place_id", "geometry", "formatted_address"]
  };

  const pickupAC = new google.maps.places.Autocomplete(pickupInput, options);
  const dropAC = new google.maps.places.Autocomplete(dropInput, options);

  pickupAC.addListener("place_changed", () => {
    const place = pickupAC.getPlace();
    if (place.geometry) {
      pickupCoords = place.geometry.location;
      checkGeofence();
    }
  });

  dropAC.addListener("place_changed", () => {
    const place = dropAC.getPlace();
    if (place.geometry) {
      dropCoords = place.geometry.location;
      checkGeofence();
    }
  });
}

window.addEventListener("load", initAutocomplete);
