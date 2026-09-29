// ============================================================
// AI CAREER COUNSELLING & DESIGN THINKING - FEEDBACK FORM
// GOOGLE SHEETS READY
// ============================================================


// ============================================================
// 0. CONFIGURATION
// ============================================================

// Paste your deployed Google Apps Script Web App URL here.
// Example:
// const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtZpkrBqvr7DKMv-oyhqLmrt1i-TLH9bbvBJfgx2zWGKGCSCr8FPkcLq8qrzgdhaep/exec";


// Optional: ACIC public logo URL.
// If you already set the image URL directly in index.html,
// you can leave this unchanged.

const ACIC_PUBLIC_LOGO_URL = "YOUR_ACIC_PUBLIC_LOGO_URL_HERE";

const acicLogo = document.getElementById("acicLogo");

if (
  acicLogo &&
  ACIC_PUBLIC_LOGO_URL &&
  !ACIC_PUBLIC_LOGO_URL.includes("YOUR_ACIC")
) {
  acicLogo.src = ACIC_PUBLIC_LOGO_URL;
}


// ============================================================
// 1. SCHOOL DROPDOWN
// ============================================================

const schoolList = [
  "Evergreen Sr. Sec. School",
  "N.K.B Sr. Sec. School",
  "Immortal Public School",
  "Other / Not Listed"
];

const schoolSelect = document.getElementById("school");

// HTML already contains the schools as a fallback.
// Only add missing schools, so options are never duplicated.
if (schoolSelect) {
  schoolList.forEach((school) => {
    const exists = Array.from(schoolSelect.options).some(
      (option) => option.value === school
    );

    if (!exists) {
      const option = document.createElement("option");
      option.value = school;
      option.textContent = school;
      schoolSelect.appendChild(option);
    }
  });
}


// ============================================================
// 2. PARTICIPANT TYPE - STUDENT / TEACHER
// ============================================================

const participantType = document.getElementById("participantType");
const teacherFields = document.getElementById("teacherFields");
const studentFields = document.getElementById("studentFields");
const classLevel = document.getElementById("classLevel");
const classField = document.getElementById("classField");

const designation = document.getElementById("designation");
const subject = document.getElementById("subject");

function setTeacherRequired(required) {
  designation.required = required;
  subject.required = required;
}

participantType.addEventListener("change", function () {

  teacherFields.hidden = true;
  studentFields.hidden = true;

  setTeacherRequired(false);

  if (this.value === "teacher") {
    teacherFields.hidden = false;
    setTeacherRequired(true);

    classLevel.required = false;
    classField.style.display = "none";
  }

  if (this.value === "student") {
    studentFields.hidden = false;

    classLevel.required = true;
    classField.style.display = "";
  }

});


// ============================================================
// 3. OTHER SESSION
// ============================================================

const otherSessionBox = document.getElementById("otherSessionBox");
const otherSessionInputs = document.querySelectorAll(
  'input[name="otherSession"]'
);

otherSessionInputs.forEach((input) => {

  input.addEventListener("change", function () {

    if (this.value === "Yes" || this.value === "Maybe") {
      otherSessionBox.hidden = false;
    } else {
      otherSessionBox.hidden = true;
      document.getElementById("requiredSession").value = "";
    }

  });

});


// ============================================================
// 4. MOBILE NUMBER
// ============================================================

const phone = document.getElementById("phone");

phone.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").slice(0, 10);
});


// ============================================================
// 5. GOOGLE SHEETS SUBMISSION
// ============================================================

const form = document.getElementById("feedbackForm");
const successBox = document.getElementById("successBox");
const editResponse = document.getElementById("editResponse");
const submitBtn = document.getElementById("submitBtn");
const submitStatus = document.getElementById("submitStatus");

function showStatus(message, type = "") {
  submitStatus.textContent = message;
  submitStatus.className = "submit-status " + type;
}

form.addEventListener("submit", async function (event) {

  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Prevent accidental submission without Apps Script URL
  if (
    !GOOGLE_SCRIPT_URL ||
    GOOGLE_SCRIPT_URL.includes("PASTE_YOUR_GOOGLE")
  ) {
    showStatus(
      "Google Sheets connection is not configured yet. Add your Apps Script Web App URL in script.js.",
      "error"
    );
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = "Submitting...";

  showStatus("Submitting your feedback...", "");

  const formData = new FormData(form);

  // Add useful metadata automatically
  formData.append("submittedAt", new Date().toISOString());
  formData.append("pageTitle", document.title);

  try {

    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    // Google Apps Script accepts the POST.
    // With no-cors, the browser cannot read the response,
    // so we show success after the request is sent.

    form.hidden = true;
    successBox.hidden = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } catch (error) {

    console.error("Submission error:", error);

    showStatus(
      "Unable to submit right now. Please check your internet connection and try again.",
      "error"
    );

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit Feedback <span>→</span>';
  }

});


// ============================================================
// 6. SUBMIT ANOTHER RESPONSE
// ============================================================

editResponse.addEventListener("click", function () {

  form.reset();

  teacherFields.hidden = true;
  studentFields.hidden = true;
  otherSessionBox.hidden = true;

  classLevel.required = true;
  classField.style.display = "";

  setTeacherRequired(false);

  submitBtn.disabled = false;
  submitBtn.innerHTML = 'Submit Feedback <span>→</span>';

  showStatus("");

  form.hidden = false;
  successBox.hidden = true;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});
