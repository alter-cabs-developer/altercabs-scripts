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

function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`error-${fieldId}`);
  if (field && error) {
    field.classList.add("invalid");
    error.textContent = message;
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`error-${fieldId}`);
  if (field && error) {
    field.classList.remove("invalid");
    error.textContent = "";
  }
}

function validateFormFields() {
  const button = document.getElementById('submitBtn');
  const feedback = document.getElementById('global-feedback');
  let isValid = true;

  const fields = [
    { id: 'pickup', msg: 'Pickup location is required.' },
    { id: 'drop', msg: 'Drop location is required.' },
    { id: 'date', msg: 'Please select a date.' },
    { id: 'time', msg: 'Please select a time.' },
    { id: 'phone', msg: 'Enter a valid phone number.' },
    { id: 'name', msg: 'Enter your name.' }
  ];

  fields.forEach(f => {
    const value = document.getElementById(f.id)?.value.trim();
    if (!value) {
      setError(f.id, f.msg);
      isValid = false;
    } else {
      clearError(f.id);
    }
  });

  if (!isValid) {
    feedback.textContent = "Please fix the highlighted fields.";
    button.disabled = true;
    return false;
  }

  // Geofencing
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

  feedback.textContent = "";
  button.disabled = false;
  return true;
}

function checkGeofence() {
  validateFormFields();
}

window.addEventListener("load", () => {
  ['pickup', 'drop', 'date', 'time', 'phone', 'name'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.addEventListener('input', validateFormFields);
  });
  validateFormFields();
});

document.getElementById("rideForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validateFormFields()) return;

  const data = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    pickup: document.getElementById('pickup').value.trim(),
    drop: document.getElementById('drop').value.trim(),
    date: document.getElementById('date').value.trim(),
    time: document.getElementById('time').value.trim(),
    distance: pickupCoords && dropCoords
      ? haversineDistance(pickupCoords.lat(), pickupCoords.lng(), dropCoords.lat(), dropCoords.lng()).toFixed(2)
      : null
  };

  // ✅ Console output to debug
  console.log("Submitting booking data:", data);

  fetch("/submit/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(response => {
    const feedback = document.getElementById("global-feedback");
    if (response.status === 'success') {
      feedback.textContent = "✅ Ride request submitted. Our team will contact you soon.";
      document.getElementById("rideForm").reset();
      document.getElementById("submitBtn").disabled = true;
    } else {
      feedback.textContent = "❌ Failed to submit booking. Please try again.";
    }
  })
  .catch(() => {
    const feedback = document.getElementById("global-feedback");
    feedback.textContent = "❌ Network error. Please check your connection.";
  });
});

function initBookingSubmitHandler() {
  const form = document.getElementById("rideForm");
  if (!form) {
    console.warn("Booking form not found. Retry in 100ms...");
    return setTimeout(initBookingSubmitHandler, 100); // Wait and retry
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateFormFields()) return;

    const data = {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      pickup: document.getElementById('pickup').value.trim(),
      drop: document.getElementById('drop').value.trim(),
      date: document.getElementById('date').value.trim(),
      time: document.getElementById('time').value.trim(),
      distance: pickupCoords && dropCoords
        ? haversineDistance(pickupCoords.lat(), pickupCoords.lng(), dropCoords.lat(), dropCoords.lng()).toFixed(2)
        : null
    };

    console.log("Submitting booking data:", data);

    fetch("/submit/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(response => {
      const feedback = document.getElementById("global-feedback");
      if (response.status === 'success') {
        feedback.textContent = "✅ Ride request submitted. Our team will contact you soon.";
        form.reset();
        document.getElementById("submitBtn").disabled = true;
      } else {
        feedback.textContent = "❌ Failed to submit booking. Please try again.";
      }
    })
    .catch(() => {
      const feedback = document.getElementById("global-feedback");
      feedback.textContent = "❌ Network error. Please check your connection.";
    });
  });
}

window.addEventListener("load", () => {
  initBookingSubmitHandler();
});
