function acionaBotaoDica() {
    document.getElementById('orientacoes').style.display = 'none'; // Ocultar o elemento "orientacoes"
    document.getElementById("titulo").style.display = "none";  //  Ocultar o elemento "título"
    // document.getElementById("teclado").style.gridArea = "4 / 1";
    document.getElementById("dicas").style.gridArea = "1 / 1"; //Posiciona a div "dicas" no grid 1 / 1
}

const botao = document.getElementById("mostra-dicas");
botao.addEventListener("click", () => { // Adiciona um evento de clique ao botão "mostra-dicas"
    score -= 2;            // penaliza 2 pontos sempre que o botão for clicado
    acrescentaPontuacao();  // atualiza o indicador na tela
});

// variável global para controlar quantas dicas já foram exibidas
let dicaAtual = 0;

function exibirDicas(nomeSorteado) {
    console.log('Exibir dicas chamada com personagem:', nomeSorteado);
}
  
//   // 1. Se não houver um personagem válido, encerra a execução
//   if (!nomeSorteado) return;

//   // 2. Desabilita e esconde o botão de mostrar dicas, se existir
//   const botaoMostraDicas = document.getElementById('mostra-dicas');
//   if (botaoMostraDicas) {
//     botaoMostraDicas.style.opacity  = '0';
//     botaoMostraDicas.style.cursor   = 'none';
//     botaoMostraDicas.disabled        = true;
//   }

//   // 3. Pega o array de dicas conforme o personagem sorteado
//   const dicasPersonagem = dicas[nomeSorteado];
//   if (!dicasPersonagem || dicaAtual >= dicasPersonagem.length) return;

//   // 4. Exibe a próxima dica na tela
//   const divDicas = document.getElementById('dicas');
//   divDicas.style.display    = 'flex';
//   divDicas.innerHTML       += `${dicasPersonagem[dicaAtual]}<br/>`;

//   // 5. Configura a mensagem que aparece com efeito de fade-in
//   const mensagemDica = document.getElementById('mensagem-dica');
//   if (mensagemDica && dicaAtual < 5) {
//     mensagemDica.style.display = 'grid';
//     mensagemDica.style.opacity = '0';

//     setTimeout(() => {
//       mensagemDica.style.opacity = '1';

//       // Foca no primeiro input editável vazio
//       const inputs              = document.querySelectorAll('.box-editavel');
//       const primeiroInputVazio  = Array.from(inputs).find(i => i.value === '');
//       if (primeiroInputVazio) primeiroInputVazio.focus();
//     }, 2500);
//   }

//   // 6. Prepara para a próxima dica
//   dicaAtual++;
// }


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

