document.addEventListener("DOMContentLoaded", () => {
  const doctorsTab = document.getElementById("doctors-tab");
  const appointmentsTab = document.getElementById("appointments-tab");
  const doctorsContent = document.getElementById("doctors-content");
  const appointmentsContent = document.getElementById("appointments-content");
  const doctorsTable = document.getElementById("doctors-list");
  const appointmentsTable = document.getElementById("appointments-list");

  async function fetchDoctorsData() {
    try {
      const response = await fetch("/api/doctors"); // Adjust the API endpoint as needed
      const doctorsData = await response.json();

      // Clear the table body
      doctorsTable.innerHTML = "";

      // Populate the table with doctor data
      doctorsData.forEach((doctor) => {
        const row = document.createElement("tr");

        // Create table cells for ID, First Name, and Last Name
        const idCell = document.createElement("td");
        idCell.textContent = doctor.id;

        const firstNameCell = document.createElement("td");
        firstNameCell.textContent = doctor.firstName;

        const lastNameCell = document.createElement("td");
        lastNameCell.textContent = doctor.lastName;

        const specialityCell = document.createElement("td");
        specialityCell.textContent = doctor.speciality;

        // Append cells to the row
        row.appendChild(idCell);
        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(specialityCell);

        // Append the row to the table body
        doctorsTable.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }

  async function fetchAppointmentsData() {
    try {
      const response = await fetch("/api/appointments");
      const appointmentsData = await response.json();

      appointmentsTable.innerHTML = "";

      appointmentsData.forEach((appointments) => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = appointments.id;

        const firstNameCell = document.createElement("td");
        firstNameCell.textContent = appointments.doctor;

        const NameCell = document.createElement("td");
        NameCell.textContent = appointments.name;

        const lastNameCell = document.createElement("td");
        lastNameCell.textContent = appointments.date;

        const specialityCell = document.createElement("td");
        specialityCell.textContent = appointments.rating;

        // Append cells to the row
        row.appendChild(idCell);
        row.appendChild(firstNameCell);
        row.appendChild(NameCell);
        row.appendChild(lastNameCell);
        row.appendChild(specialityCell);

        // Append the row to the table body
        appointmentsTable.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  function showDoctors() {
    doctorsTab.classList.add("active");
    appointmentsTab.classList.remove("active");
    doctorsContent.classList.add("active");
    appointmentsContent.classList.remove("active");

    // Fetch doctors data when switching to the Doctors tab
    fetchDoctorsData();
  }

  function showAppointments() {
    doctorsTab.classList.remove("active");
    appointmentsTab.classList.add("active");
    doctorsContent.classList.remove("active");
    appointmentsContent.classList.add("active");

    // Fetch appointments data when switching to the Appointments tab
    fetchAppointmentsData();
  }

  // Initial setup: Show the "Doctors" content and fetch doctors data
  showDoctors();

  // Add click event listeners to the tabs
  doctorsTab.addEventListener("click", showDoctors);
  appointmentsTab.addEventListener("click", showAppointments);
});

document
  .getElementById("add-doctor-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const newDoctor = {
      id: document.getElementById("doctor-id").value,
      firstName: document.getElementById("doctor-first-name").value,
      lastName: document.getElementById("doctor-last-name").value,
      speciality: document.getElementById("doctor-speciality").value,
    };

    const response = await fetch("/api/doctors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDoctor),
    });
    console.log("Response received:", response);
    if (response.ok) {
      alert("Doctor added successfully");
      window.location.reload();
       // Refresh the doctors list
    } else {
      const errorResponse = await response.json();
      alert(errorResponse.error || "Failed to add doctor");
    }
  });

  // Add event listener for adding appointments
document.getElementById("add-appointment-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const newAppointment = {
      id: document.getElementById("appointment-id").value,
      doctor: document.getElementById("appointment-doctor-id").value,
      date: document.getElementById("appointment-date").value,
      rating: document.getElementById("appointment-rating").value
  };

  const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(newAppointment),
  });

  if (response.ok) {
      alert("Appointment added successfully");
     window.location.reload(); // Refresh the appointments list
  } else {
      const errorResponse = await response.json();
      alert(errorResponse.error || "Failed to add appointment");
  }
});
