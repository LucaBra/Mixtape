document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    window.location.href = "../pages/album.html";
  });
});