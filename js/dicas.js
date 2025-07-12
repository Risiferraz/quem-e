function acionaBotaoDica() {
    document.getElementById('orientacoes').style.display = 'none'; // Ocultar o elemento "orientacoes"
    document.getElementById("titulo").style.display = "none";  //  Ocultar o elemento "título"
    document.getElementById("mostra-dicas").style.top = "45%";
    document.getElementById("teclado").style.gridArea = "3 / 1 / span 2 / span 1";
    document.getElementById("dicas").style.gridArea = "1 / 1";

    const botaoMostraDicas = document.getElementById('mostra-dicas')
    botaoMostraDicas.style.display = 'flex'; // Mostra o botão "mostra-dicas"
    if (botaoMostraDicas.disabled) {
        botaoMostraDicas.disabled = false; // Habilita o botão quando for desabilitado
    }
    if (botaoMostraDicas.style.cursor === "none") {
        botaoMostraDicas.style.cursor = "pointer"; // Alterar o cursor para "pointer" se estiver "none"
    }
    botaoMostraDicas.style.opacity = "1";    // Ajustar a opacidade do botão para 1
}

const botao = document.getElementById("mostra-dicas");
botao.addEventListener("click", () => { // Adiciona um evento de clique ao botão "mostra-dicas"
  score -= 2;            // penaliza 2 pontos sempre que o botão for clicado
  acrescentaPontuacao();  // atualiza o indicador na tela
  exibirDica();           // mostra a dica
});

let dicaAtual = 0; // Variável para rastrear o índice da dica atual

function exibirDica() {
    if (nomeSorteado) {
        const dicasPersonagem = dicas[nomeSorteado]; // Obtém o array de dicas do personagem sorteado
        const botaoMostraDicas = document.getElementById('mostra-dicas');
        // ao clicar no botaoMostraDicas acontece isto:
        botaoMostraDicas.style.opacity = "0"; // Altera a opacidade do botão, ocultando-o
        botaoMostraDicas.style.cursor = "none"; //faz o cursor desaparecer
        botaoMostraDicas.disabled = true; // Desabilita o botão "mostra-dicas"

        if (dicaAtual < dicasPersonagem.length) { // Verifica se o número atual de dicas é menor que a quantidade total de dicas
            const dica = dicasPersonagem[dicaAtual]; // Obtém a dica atual
            const divDicas = document.getElementById("dicas"); // seleciona a div de id="dicas"
            divDicas.style.display = "block"; // faz aparecer a div "dicas"
            divDicas.innerHTML += `${dica}<br/>`; // modifica o conteúdo da constante divDicas que recebe a div id="dicas".

            const mensagemDica = document.getElementById("mensagem-dica"); // seleciona a div de id="mensagem-dica"
            if (dicaAtual < 4) {
                mensagemDica.style.display = 'grid'; // faz aparecer a div "mensagem-dica"
                botaoMostraDicas.style.display = "block"; //faz aparecer o botaoMostraDicas
                mensagemDica.style.opacity = '0'; // dá o valor inicial da opacidade para a mensagemDica de 0 possibilitando o efeito do setTimeOut a seguir

                setTimeout(() => {
                    mensagemDica.style.opacity = '1'; // faz aparecer a mensagemDica após alguns segundos
                    const inputs = document.querySelectorAll(".box-editavel"); // Certifica-se de que está pegando inputs editáveis
                    const primeiroInputVazio = Array.from(inputs).find(input => input.value === "");
                    if (primeiroInputVazio) {
                        primeiroInputVazio.focus(); // Aplica o foco no primeiro input vazio
                    }
                }, 2500); // estipula um tempo de demora para aparecer a div "mensagem-dica"
            }
            dicaAtual++; // Incrementa o índice para exibir a próxima dica no próximo clique
        }
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

