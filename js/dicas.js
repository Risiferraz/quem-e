function acionaBotaoDica() {
    document.getElementById('orientacoes').style.display = 'none'; // Ocultar o elemento "orientacoes"
    document.getElementById("titulo").style.display = "none";  //  Ocultar o elemento "título"
    document.getElementById("dicas").style.gridArea = "1 / 1"; //Posiciona a div "dicas" no grid 1 / 1
}

let botaoExibeDicas = document.getElementById("mostra-dicas");
botaoExibeDicas.addEventListener("click", () => { // Ao clicar no botão "mostra-dicas" acontece:
    score -= 2;
    acrescentaPontuacao();
    exibirDicas();
    bloquearTeclas();

    // aguarda 5 segundos antes de aplicar o style e desabilitar
    setTimeout(() => {
        botaoExibeDicas.style.opacity = '0';
        botaoExibeDicas.style.cursor = 'none';
        botaoExibeDicas.disabled = true;
    }, 200);
});


let dicaAtual = 0;
function exibirDicas() {
    const divDicas = document.getElementById("dicas"); // div onde as dicas serão exibidas
    const dicasPersonagem = dicas[personagemSecreto];  // pega a lista de dicas do personagem

    if (dicaAtual < dicasPersonagem.length && dicaAtual < 5) { // se ainda houver dicas e menos de 5 mostradas
        divDicas.style.display = 'flex';  // exibe a próxima dica
        divDicas.innerHTML += `${dicasPersonagem[dicaAtual]}<br/>`; // adiciona a dica atual à div
        const msgDica = document.getElementById("mensagem-dica");  // Mensagem de dica
        setTimeout(() => {
            msgDica.style.display = 'flex'; // Mostra a mensagem de dica
        }, 2000);

        dicaAtual++;
    }
}


// Ocultar mensagem de dica
function clicarOk() {
    const mensagemDica = document.getElementById("mensagem-dica");
    mensagemDica.style.display = 'none'; // Esconde a mensagem de dica
    liberarTeclas(); 
}

// Ocultar mensagem de dica2
function clicarOk2() {
    const mensagemDica = document.getElementById("mensagem-dica2");
    mensagemDica.style.display = 'none'; // Esconde a mensagem de dica2
}


