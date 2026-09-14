const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuIlPa1Mt36rMVWYJmbQe9RQ59LX4-vlzHpsr9DYo7e53ElAcLmv5oM9TZ4hfKV3iE/exec";

const form = document.getElementById("registrationForm");
const errorBox = document.getElementById("formError");

function showError(message, field) {
  errorBox.textContent = message;
  errorBox.hidden = false;

  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}

function clearError() {
  errorBox.textContent = "";
  errorBox.hidden = true;
  form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
}

form.addEventListener("input", clearError);
form.addEventListener("change", clearError);

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  clearError();

  if (GOOGLE_SCRIPT_URL.includes("COLE_AQUI")) {
    showError("Falta configurar a URL do Google Apps Script no código da página.");
    return;
  }

  const invalidField = Array.from(form.elements).find((field) => field.willValidate && !field.checkValidity());

  if (invalidField) {
    showError("Preencha os campos obrigatórios corretamente antes de enviar.", invalidField);
    return;
  }

  const button = form.querySelector(".submit");
  const originalText = button.textContent;
  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  button.textContent = "Enviando...";

  const data = new FormData(form);
  data.append("evento", "Raízes de Autoridade 2026");
  data.append("data_evento", "17 e 18 de outubro de 2026");

  try {
    await fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body: data });
    form.style.display = "none";
    document.getElementById("success").style.display = "block";
  } catch (error) {
    console.error(error);
    showError("Não foi possível enviar sua inscrição agora. Tente novamente em instantes.");
    button.disabled = false;
    button.removeAttribute("aria-busy");
    button.textContent = originalText;
  }
});
