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

window.addEventListener("load", function () {
  const form = document.getElementById("rideForm");
  const button = document.getElementById("submitBtn");
  const feedback = document.getElementById("global-feedback");

  if (!form || !button) {
    console.error("Form or button not found.");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const pickup = document.getElementById("pickup")?.value.trim();
    const drop = document.getElementById("drop")?.value.trim();
    const date = document.getElementById("date")?.value.trim();
    const time = document.getElementById("time")?.value.trim();

    if (!name || !phone || !pickup || !drop || !date || !time) {
      feedback.textContent = "❌ Please fill all fields.";
      return;
    }

    const distance = pickupCoords && dropCoords
      ? haversineDistance(pickupCoords.lat(), pickupCoords.lng(), dropCoords.lat(), dropCoords.lng()).toFixed(2)
      : null;

    const data = {
      records: [
        {
          fields: {
            Name: name,
            Phone: phone,
            Pickup: pickup,
            Drop: drop,
            Date: date,
            Time: time,
            Distance: distance
          }
        }
      ]
    };

    console.log("📤 Sending booking to Airtable:", data);

    fetch("https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE_NAME", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
      console.log("✅ Airtable response:", response);
      feedback.textContent = "✅ Booking submitted! Our team will confirm shortly.";
      form.reset();
      button.disabled = true;
    })
    .catch(error => {
      console.error("❌ Airtable error:", error);
      feedback.textContent = "❌ Booking failed. Please try again.";
    });
  });
});
