const btn = document.getElementById("btn");
btn.addEventListener("click", entrar, {once: true});
function entrar(){
    window.location.href = "./pages/tape.html";
}