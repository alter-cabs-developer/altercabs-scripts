// Load Google Places Autocomplete on pickup & drop fields
window.addEventListener("load", function () {
  const pickup = document.getElementById('pickup');
  const drop = document.getElementById('drop');

  if (pickup && drop) {
    const options = {
      componentRestrictions: { country: "in" },
      fields: ["place_id", "geometry", "formatted_address"]
    };

    new google.maps.places.Autocomplete(pickup, options);
    new google.maps.places.Autocomplete(drop, options);
  } else {
    console.warn("Pickup/Drop inputs not found.");
  }
});
