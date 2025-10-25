const upload = document.getElementById("uploadBtn")
const profile = document.getElementById("profileBtn")


upload.addEventListener("click", function(e) {
    const token = localStorage.getItem("token");
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    if (!token) {
    window.location.href = "../pages/login.html";
    return;
    }
    window.location.href = "../pages/upload.html";
}); 

profile.addEventListener("click", function(e) {
    const token = localStorage.getItem("token");
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    if (!token) {
        window.location.href = "../pages/login.html";
        return;
    }
    window.location.href = "../pages/user.html";
});


document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    window.location.href = "../pages/album.html";
  });
});