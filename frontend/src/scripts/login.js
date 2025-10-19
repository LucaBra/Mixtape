const form = document.getElementById("loginForm");
const alerta = document.getElementById("alerta");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Simulação de validação (substitua por sua lógica real)
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alerta.textContent = "Preencha todos os campos";
    alerta.classList.add("show");
    setTimeout(() => alerta.classList.remove("show"), 3000);
  } else {
    // Se login correto, redireciona para a página inicial
    window.location.href = "../pages/paginaInicial.html";
  }
});
