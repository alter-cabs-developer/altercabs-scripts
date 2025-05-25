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
