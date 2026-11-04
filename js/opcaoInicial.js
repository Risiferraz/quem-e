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
    botaoOrientacoes.addEventListener("click", () => { // ao clicar no botão "orientacoes"...
        tooltip.classList.add("tooltip-visivel"); // exibe o tooltip
    });
}

if (botaoFecharTooltip && tooltip) {
    botaoFecharTooltip.addEventListener("click", () => { // ao clicar no botão "fechar-tooltip"...
        tooltip.classList.remove("tooltip-visivel"); // oculta o tooltip
    });
}
