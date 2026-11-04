const botaoPrincipiante = document.getElementById("principiante");
const botaoAvancado = document.getElementById("avancado");
const botaoOrientacoes = document.getElementById("orientacoes");
const tooltip = document.getElementById("tooltip");
const botaoFecharTooltip = document.getElementById("fechar-tooltip");

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

if (botaoOrientacoes && tooltip) {
    botaoOrientacoes.addEventListener("click", () => {
        tooltip.classList.add("tooltip-visivel");
    });
}

if (botaoFecharTooltip && tooltip) {
    botaoFecharTooltip.addEventListener("click", () => {
        tooltip.classList.remove("tooltip-visivel");
    });
}
