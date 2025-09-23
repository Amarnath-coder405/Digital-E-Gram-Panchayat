// Sidebar navigation toggle
const links = document.querySelectorAll(".sidebar nav ul li a[data-target]");
const sections = document.querySelectorAll(".section");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const target = link.getAttribute("data-target");
    sections.forEach(sec => {
      sec.classList.remove("active");
      if (sec.id === target) sec.classList.add("active");
    });
  });
});

// Manage Services Data
let serviceId = 1;
const services = [];
const servicesTable = document.querySelector("#servicesTable tbody");
const addServiceForm = document.getElementById("addServiceForm");
const addServiceMessage = document.getElementById("addServiceMessage");

// Add service
addServiceForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("serviceName").value.trim();
  const desc = document.getElementById("serviceDesc").value.trim();

  if (name && desc) {
    const newService = { id: serviceId++, name, desc };
    services.push(newService);
    renderServices();
    addServiceMessage.textContent = "✅ Service added successfully!";
    addServiceMessage.style.color = "green";
    addServiceForm.reset();
  } else {
    addServiceMessage.textContent = "⚠ Please fill all fields.";
    addServiceMessage.style.color = "red";
  }
});

// Render services in table
function renderServices() {
  servicesTable.innerHTML = "";
  services.forEach(service => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${service.id}</td>
      <td><input type="text" value="${service.name}" class="edit-name"></td>
      <td><input type="text" value="${service.desc}" class="edit-desc"></td>
      <td>
        <button class="btn-sm btn-edit" onclick="updateService(${service.id})">Update</button>
        <button class="btn-sm btn-delete" onclick="deleteService(${service.id})">Delete</button>
      </td>
    `;
    servicesTable.appendChild(row);
  });
}

// Update service
window.updateService = function(id) {
  const row = [...servicesTable.children].find(r => r.children[0].textContent == id);
  const name = row.querySelector(".edit-name").value.trim();
  const desc = row.querySelector(".edit-desc").value.trim();
  const service = services.find(s => s.id === id);
  if (service) {
    service.name = name;
    service.desc = desc;
    alert("✅ Service updated successfully!");
  }
}

// Delete service
window.deleteService = function(id) {
  const index = services.findIndex(s => s.id === id);
  if (index > -1) {
    services.splice(index, 1);
    renderServices();
    alert("🗑 Service deleted.");
  }
}
