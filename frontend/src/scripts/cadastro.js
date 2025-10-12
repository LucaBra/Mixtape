const form = document.getElementById("cadastroForm");
const alerta = document.getElementById("alerta");
const submitBtn = document.getElementById("submitBtn");

// Campos
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmar-senha");
const termos = document.getElementById("termos");

// Máscara de telefone
telefone.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 10) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (value.length > 6) {
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (value.length > 2) {
    value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  }

  e.target.value = value;
});

// Verificador de força da senha
senha.addEventListener("input", (e) => {
  const value = e.target.value;
  const strengthBar = document.getElementById("strength-bar");

  let strength = 0;
  if (value.length >= 6) strength++;
  if (value.length >= 8) strength++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) strength++;
  if (/[0-9]/.test(value)) strength++;
  if (/[^A-Za-z0-9]/.test(value)) strength++;

  strengthBar.className = "password-strength-bar";
  if (strength <= 2) strengthBar.classList.add("weak");
  else if (strength <= 3) strengthBar.classList.add("medium");
  else strengthBar.classList.add("strong");
});

// Validação em tempo real
function validateField(field, errorId, validationFn) {
  const errorElement = document.getElementById(errorId);

  field.addEventListener("blur", () => {
    if (!validationFn(field.value)) {
      field.classList.add("error");
      field.classList.remove("success");
      errorElement.classList.add("show");
    } else {
      field.classList.remove("error");
      field.classList.add("success");
      errorElement.classList.remove("show");
    }
  });
}

validateField(nome, "nome-error", (value) => value.trim().length >= 3);
validateField(email, "email-error", (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
);
validateField(
  telefone,
  "telefone-error",
  (value) => value.replace(/\D/g, "").length >= 10
);
validateField(senha, "senha-error", (value) => value.length >= 6);

confirmarSenha.addEventListener("blur", () => {
  const errorElement = document.getElementById("confirmar-error");
  if (confirmarSenha.value !== senha.value) {
    confirmarSenha.classList.add("error");
    confirmarSenha.classList.remove("success");
    errorElement.classList.add("show");
  } else {
    confirmarSenha.classList.remove("error");
    confirmarSenha.classList.add("success");
    errorElement.classList.remove("show");
  }
});

// Submissão do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const isValid =
    nome.value.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
    telefone.value.replace(/\D/g, "").length >= 10 &&
    senha.value.length >= 6 &&
    confirmarSenha.value === senha.value &&
    termos.checked;

  if (!isValid) {
    alerta.textContent = "Por favor, corrija os erros no formulário";
    alerta.classList.add("show");
    setTimeout(() => alerta.classList.remove("show"), 3000);
  } else {
    // Aqui você colocaria sua lógica de cadastro
    console.log("Cadastro realizado:", {
      nome: nome.value,
      email: email.value,
      telefone: telefone.value,
    });

    alerta.style.background = "#4CAF50";
    alerta.textContent = "Cadastro realizado com sucesso!";
    alerta.classList.add("show");
  }
});
