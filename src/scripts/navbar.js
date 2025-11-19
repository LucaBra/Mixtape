const upload = document.getElementById("uploadBtn")
const profile = document.getElementById("profileBtn")
const library = document.getElementById("libraryBtn")

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

library.addEventListener("click", function(e) {
    const token = localStorage.getItem("token");
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    if (!token) {
        window.location.href = "../pages/login.html";
        return;
    }
    window.location.href = "../pages/album.html";
});

function updateProfileButton() {
  const token = localStorage.getItem("token");
  if (token) {
    const profileUrl = "https://via.placeholder.com/50";
    profileBtn.innerHTML = `<img src="${profileUrl}" alt="Profile" class="profile-img">`;
  } else {
    profileBtn.innerHTML = "Log in";
  }
}
