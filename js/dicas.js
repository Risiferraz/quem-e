function acionaBotaoDica() {
    document.getElementById('orientacoes').style.display = 'none'; // Ocultar o elemento "orientacoes"
    document.getElementById("titulo").style.display = "none";  //  Ocultar o elemento "título"
    document.getElementById("dicas").style.gridArea = "1 / 1"; //Posiciona a div "dicas" no grid 1 / 1
}

const botaoMostraDicas = document.getElementById("mostra-dicas");

botaoMostraDicas.addEventListener("click", () => {
    score -= 2;
    acrescentaPontuacao();
    exibirDicas();

    // aguarda 5 segundos antes de aplicar o style e desabilitar
    setTimeout(() => {
        botaoMostraDicas.style.opacity = '0';
        botaoMostraDicas.style.cursor = 'none';
        botaoMostraDicas.disabled = true;
    }, 100);
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
        }, 5000);

        dicaAtual++;
    }
}


// Ocultar mensagem de dica
function clicarOk() {
    const mensagemDica = document.getElementById("mensagem-dica");
    mensagemDica.style.display = 'none'; // Esconde a mensagem de dica
    digitarPalavraCerta(); // Chama a função que configura os inputs
}

// Ocultar mensagem de dica2
function clicarOk2() {
    const mensagemDica = document.getElementById("mensagem-dica2");
    mensagemDica.style.display = 'none'; // Esconde a mensagem de dica2
}

function digitarPalavraCerta() {
    // Recupera os inputs que representam a palavra (inicialmente com classe "box")
    const inputs = document.querySelectorAll("input.box");
    // Para cada input com a classe "box", remova-a e adicione a classe "box-editável"
    inputs.forEach(input => {
        input.classList.remove("box");
        input.classList.add("box-editavel");
        input.disabled = false; // Comando para desabilitar o input
    });

    // Foca no primeiro input vazio
    const primeiroInputVazio = Array.from(inputs).find(
        input => input.value === ""
    );
    if (primeiroInputVazio) {
        primeiroInputVazio.focus();
    }

    inputs.forEach((input, index) => { // Adiciona o evento de input para cada input
        input.addEventListener("input", () => {
            if (input.value.length === 1) { // Verifica se o input tem exatamente um caractere
                verificaPalavraSecreta(input);

                // Procura o próximo input para dar foco
                let proximoInput = inputs[index + 1];
                let idx = index;
                while (proximoInput) {
                    const backgroundColor = window.getComputedStyle(proximoInput).backgroundColor;
                    if (
                        backgroundColor === "gray" ||
                        backgroundColor === "rgb(128, 128, 128)"
                    ) {
                        break;
                    }
                    idx++;
                    proximoInput = inputs[idx + 1];
                }
                if (proximoInput) {
                    proximoInput.focus();
                }
            }
        });

        // Desabilita o uso da tecla Backspace para os inputs
        input.addEventListener("keydown", event => {
            if (event.key === "Backspace") {
                event.preventDefault();
            }
        });
    });
}

