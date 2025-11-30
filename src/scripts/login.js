document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const alerta = document.getElementById("alerta");
  const loginBtn = document.getElementById("loginBtn");

  const tokenFake = 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJuYW1lIjoiRW5nLiBDb21wdXRhXHUwMGU3XHUwMGUzbyIsInJvbGUiOiJKV1QiLCJpYXQiOjE3NTk5ODEzMTcsImV4cCI6MTc1OTk4NDkxN30.b1KfcSFInRwYnvRA0Ae5jYuL59KZmCsufPgISNGq0X0";
 
  function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    if (!validarEmail(email)) {
      alerta.textContent = "E-mail inválido";
      alerta.classList.add("show");
      setTimeout(() => alerta.classList.remove("show"), 3000);
      return;
    }
    const senha = document.getElementById("password").value;
    
    if (email && senha) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      if (!userData || userData.email !== email) {
        alerta.textContent = "E-mail não cadastrado.";
        alerta.classList.add("show");
        setTimeout(() => alerta.classList.remove("show"), 3000);
        return;
      }
      
      if (userData.senha !== senha) {
        alerta.textContent = "Senha incorreta.";
        alerta.classList.add("show");
        setTimeout(() => alerta.classList.remove("show"), 3000);
        return;
      }
      
      const nomeUsuario = userData.nome;
      localStorage.setItem("token", tokenFake);
      localStorage.setItem("nomeUsuario", nomeUsuario);

      const success = document.getElementById("success");
      success.textContent = "Login bem-sucedido!";
      success.classList.add("show");

      setTimeout(() => {
        success.classList.remove("show");
        window.location.href = "../pages/tape.html";
      }, 2000);

    } else {
      alerta.textContent = "Preencha e-mail e senha.";
      alerta.classList.add("show");
      setTimeout(() => alerta.classList.remove("show"), 3000);
    }
  });
}
});


