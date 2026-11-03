const botaoPrincipiante = document.getElementById("principiante");
const botaoAvancado = document.getElementById("avancado");

if (botaoPrincipiante) {
    botaoPrincipiante.addEventListener("click", () => {
        setTimeout(() => {
            window.location.href = "principiante.html";
        }, 120);
    });
}

if (botaoAvancado) {
    botaoAvancado.addEventListener("click", () => {
        setTimeout(() => {
            window.location.href = "avancado.html";
        }, 120);
    });
}
