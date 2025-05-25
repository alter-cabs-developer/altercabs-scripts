window.addEventListener("load", function () {
  const form = document.getElementById("rideForm");
  const button = document.getElementById("submitBtn");

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
      alert("❌ Please fill all fields.");
      return;
    }

    const data = {
      name, phone, pickup, drop, date, time,
      distance: pickupCoords && dropCoords
        ? haversineDistance(pickupCoords.lat(), pickupCoords.lng(), dropCoords.lat(), dropCoords.lng()).toFixed(2)
        : null
    };

    console.log("🚀 Submitting booking data:", data);

    fetch("/submit/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(response => {
      console.log("✅ Response from Odoo:", response);
      if (response.status === 'success') {
        alert("Booking submitted successfully!");
        form.reset();
      } else {
        alert("Something went wrong. " + (response.message || ""));
      }
    })
    .catch(error => {
      console.error("❌ Network or server error:", error);
      alert("Network error. Check console.");
    });
  });
});
