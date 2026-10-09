const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("commission-form");
const statusBox = document.getElementById("form-status");
const submitButton = form.querySelector("button[type=submit]");
form.addEventListener("submit", async event => {
  event.preventDefault();
  statusBox.textContent = "";
  statusBox.classList.remove("error");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  if (!formData.get("consent")) {
    statusBox.textContent = "Please confirm the quote-first terms before submitting.";
    statusBox.classList.add("error");
    return;
  }
  submitButton.disabled = true;
  submitButton.querySelector(".submit-label").textContent = "Sending request…";
  try {
    const response = await fetch("/api/commission", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Your request could not be sent. Please try again.");
    form.reset();
    statusBox.textContent = "Request sent! Your details are in. You’ll be contacted after the request is reviewed.";
  } catch (error) {
    statusBox.textContent = error.message || "Something went wrong. Please try again.";
    statusBox.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector(".submit-label").textContent = "Send commission request";
  }
});
