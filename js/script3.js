const listaDePersonagens = ["Maria-Madalena", "Jeremias", "Abias"];
let nomeSorteado;
let letras = [];

function sortearNome(lista) {
  const indiceAleatorio = Math.floor(Math.random() * lista.length);
  nomeSorteado = lista[indiceAleatorio];
  console.log(`Nome sorteado: ${nomeSorteado}`);
  return nomeSorteado;
}

function configurarInputsBox() {
  // Divide o nome sorteado em array de letras
  const letrasArray = nomeSorteado.split("");

  // Percorre os inputs de A1 a A18
  for (let i = 1; i <= 18; i++) {
    const input = document.getElementById(`A${i}`);
    //if (!input) continue;  Garante que o elemento existe

    if (i <= letrasArray.length) {
      const letra = letrasArray[i - 1]; // Obtém a letra correspondente ao índice atual
      input.setAttribute("data-letra", letra.toUpperCase()); // Define o atributo data-letra para a validação posterior (em maiúsculas)
      input.disabled = true; // Comando para desabilitar o input
      input.value = ""; // Inicializa o input com valor vazio
      if (letra === "-") { // Se a letra for hífen, ajusta o estilo e mantém o input vazio
        input.value = ""; // 
        input.style.backgroundColor = "transparent";
        input.style.border = "none";
      }
    } else {
      // Esconde os inputs excedentes à quantidade de letras
      input.style.display = "none";
    }
  }
}

let conjuntoInputsVazios = []; // Variável que cria um array para armazenar os inputs vazios
function verificarInputsVazios() {
  const inputsVazios = document.querySelectorAll('input.box-editavel, input.box'); // Pega todos os inputs que têm a classe "box-editavel" ou "box"
  conjuntoInputsVazios = Array.from(inputsVazios).filter(inp => {  // recebe o array de inputs e filtra-os
    const inputsVisiveis = window.getComputedStyle(inp).display !== 'none'; // recebe os inputs que não estão com display none
    const inputsNaoPreenchidos = inp.value.trim() === ''; // recebe os inputs que estão vazios
    const inputsSemHifen = inp.getAttribute('data-letra') !== '-'; // recebe os inputs que não são hífen

    return inputsVisiveis && inputsNaoPreenchidos && inputsSemHifen;
  });
  console.log(`Quantidade de inputs vazios: ${conjuntoInputsVazios.length}`); // Indica a quantidade de inputs vazios que ainda restam.
}

let matches = 0; // Variável que armazena a quantidade de letras acertadas
let score = 100; // pontuação começa com 100 pontos
document.getElementById("indicador").textContent = score;

function acrescentaPontuacao() {
  // só atualiza o <div id="indicador">
  document.getElementById("indicador").textContent = score; // Atualiza o indicador de pontuação
}

//*******CRONOMETRO********
const cronometro = new Cronometro()
setInterval(() => {
  cronometro.atualizaCronometro()
}, 1000);

function configurarTeclado() {
  const teclas = document.querySelectorAll(".tecla");
  let contadorCliques = 0;

  teclas.forEach(tecla => {
    tecla.addEventListener("click", () => {
      cronometro.iniciaCronometro() // Inicia o cronômetro ao clicar na tecla
      contadorCliques++; // Incrementa o contador de cliques
      const letra = tecla.textContent.trim().toUpperCase();
      const inputs = Array.from(
        document.querySelectorAll(`input[data-letra="${letra}"]`)
      );
      const acertouLetra = inputs.length > 0;
      if (acertouLetra) { // Se acertou a letra
        score--; // Perde 1 ponto se clicou numa letra certa
        inputs.forEach(input => {  // Percorre os inputs que correspondem à letra clicada
          if (input.value === "") { // Se o input estiver vazio
            input.value = letra; // Preenche o input com a letra clicada
            input.style.background = "rgb(186,150,43)";  // Altera o fundo do input
            input.style.border = "outset 3px rgb(252,237,177)"; // Altera a borda do input
            input.style.color = "black"; // Altera a cor do texto do input
            input.classList.remove("box-editavel"); // Remove a classe "box-editavel" do input
            input.classList.add("box-nao-editavel"); // Adiciona a classe "box-nao-editavel" ao input
            matches++;  // Incrementa o contador de letras acertadas
            acrescentaPontuacao();
            setTimeout(() => {
              const mensagemLetraErrada = document.getElementById("mensagem-letra-certa"); // seleciona a div de id="mensagem-letra-certa"
              if (!mensagemLetraErrada) return;
              mensagemLetraErrada.style.display = 'block'; // faz aparecer a div "mensagem-letra-certa"
              mensagemLetraErrada.classList.add("mensagem-letra-certa-show"); // Adiciona a classe "show" para exibir a mensagem
            }, 1500);
          }
        });
      } else {
        tecla.classList.add("efeito-letra-errada");
        score -= 2; // Perde 2 pontos se clicou numa letra errada
        acrescentaPontuacao();
        setTimeout(() => {
          const mensagemLetraErrada = document.getElementById("mensagem-letra-errada"); // seleciona a div de id="mensagem-letra-errada"
          if (!mensagemLetraErrada) return;
          mensagemLetraErrada.style.display = 'block'; // faz aparecer a div "mensagem-letra-errada"
          mensagemLetraErrada.classList.add("mensagem-letra-errada-show"); // Adiciona a classe "show" para exibir a mensagem
        }, 1500);
      }
      verificarInputsVazios(); // Verifica se o input está vazio após cada clique
      if (contadorCliques >= 5) { // Se o número de cliques for maior ou igual a 5
        setTimeout(() => { // Aguarda 1 segundo antes de exibir a mensagem
          const msgCerta = document.getElementById("mensagem-letra-certa");// Obtém o elemento de id = "mensagem-letra-certa"
          const msgDica2 = document.getElementById("mensagem-dica2"); // Obtém o elemento de id = "mensagem-dica2"
          const casasVazias = conjuntoInputsVazios.length; // Obtém a quantidade de inputs vazios
          const limiteCasasVazias =
            (nomeSorteado.length < 6 && casasVazias > 2) || // Verifica se o número de inputs vazios é maior que 2 se o nome sorteado tiver menos de 6 letras
            (nomeSorteado.length >= 6 && casasVazias > 3); // Verifica se o número de inputs vazios é maior que 3 se o nome sorteado tiver 6 letras ou mais

          if (acertouLetra) { // Se acertou a letra
            if (msgCerta && limiteCasasVazias) { // Se a mensagem de letra certa existe e o número de inputs vazios é maior que o limite
              msgCerta.style.display = "block";
            } else {
              if (msgDica2) {
                msgDica2.style.display = "block";
              }
            }
          } else {
            setTimeout(() => {
              const msgErrada = document.getElementById("mensagem-letra-errada");
              if (msgErrada) {
                msgErrada.style.display = "block";
              }
            }, 1000);
          }
        }, 1000);
      }

      const casasVazias = conjuntoInputsVazios.length;
      if (
        (nomeSorteado.length < 6 && casasVazias <= 2) ||
        (nomeSorteado.length >= 6 && casasVazias <= 3)
      ) {
        document.getElementById("mensagem-dica2").style.display = "block";
        desabilitarTeclado();
      }

      if (contadorCliques <= 4) {  // até o 4º clique → mostra dica
        acionaBotaoDica();
      } else {    // depois “pisca” a dica
        const msgDica = document.getElementById("mensagem-dica");
        if (msgDica) {
          msgDica.style.opacity = "0";
          setTimeout(() => (msgDica.style.opacity = "1"), 2500);
        }
      }
      digitarPalavraCerta(); // Chama a função que configura os inputs
      // ------------------------------------------------------
      // Marca a tecla como usada
      // ------------------------------------------------------
      tecla.classList.remove("tecla");
      tecla.classList.add("tecla-clicada");
    });                // fecha addEventListener
  });                  // fecha forEach
}                      // fecha configurarTeclado

// document.addEventListener("DOMContentLoaded", () => {
//   const botaoMostraDicas = document.getElementById("mostra-dicas");
//   const botaoOk2         = document.getElementById("ok2");

//   if (botaoMostraDicas) {
//     botaoMostraDicas.addEventListener("click", () => {
//       console.log("clicou em mostra-dicas");
//       score -= 2;
//       acrescentaPontuacao();
//       acionaBotaoDica();
//     });
//   }
//   if (botaoOk2) {
//     botaoOk2.addEventListener("click", (event) => {
//       console.log("clicou em ok2", event);
//       clicarOk2();        // sua lógica de esconder mensagem e habilitar botão
//       acionaBotaoDica();  // a função que mostra as dicas
//     });
//   }
// });

function clicarOk4() {
  console.log(">> entrar em clicarOk4()");
  const mensagemLetraErrada = document.getElementById("mensagem-letra-errada");
  const botaoMostraDicas    = document.getElementById("mostra-dicas");

  mensagemLetraErrada.style.display = 'none';
  if (botaoMostraDicas.disabled) {
    console.log(">> habilitando #mostra-dicas");
    botaoMostraDicas.disabled = false;
  }

  setTimeout(() => {
    console.log(">> exibindo #mostra-dicas após 1s");
    botaoMostraDicas.style.display = 'flex';
  }, 1000);
}

function clicarOk3() { //Esconde a mensagem de acerto, habilita e exibe o botão de dicas.
  const mensagemLetraErrada = document.getElementById("mensagem-letra-certa");
  const botaoMostraDicas   = document.getElementById("mostra-dicas");
  mensagemLetraErrada.style.display = 'none'; // Esconde a mensagem de letra certa

  if (botaoMostraDicas.disabled) { // Habilita o botão "mostra-dicas" se estiver desabilitado
    botaoMostraDicas.disabled = false;
  }
  setTimeout(() => {   // Após 1s, exibe o botão "mostra-dicas"
    botaoMostraDicas.style.display = 'flex';
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => { // Garante que o DOM esteja completamente carregado antes de adicionar os eventos
  const botaoMostraDicas = document.getElementById("mostra-dicas"); // seleciona o botão de id="mostra-dicas"
  const botaoOk2         = document.getElementById("ok3"); // seleciona o botão de id="ok3"

  if (!botaoMostraDicas || !botaoOk2) return; // Garante que os botões existam antes de adicionar os eventos
  botaoMostraDicas.addEventListener("click", () => {   // Quando o jogador clicar em "Mostrar Dicas":
    score -= 2;             // penaliza 2 pontos
    acrescentaPontuacao();   // atualiza o indicador
    acionaBotaoDica();       // chama a função correta
  });

  // Quando o jogador clicar em "OK" na mensagem de acerto:
  botaoOk2.addEventListener("click", () => {
    clicarOk3();             // esconde a mensagem e exibe o botão de dicas
    acionaBotaoDica();       // chama a função correta
  });
});



function clicarOk4() {
  const mensagemLetraErrada = document.getElementById("mensagem-letra-errada");
  mensagemLetraErrada.style.display = 'none'; // Esconde a mensagem-letra-errada
}

function desabilitarTeclado() {
  const teclas = document.querySelectorAll('.tecla, .tecla-clicada'); // Seleciona todas as teclas, tanto as normais quanto as já clicadas
  teclas.forEach(tecla => { // Itera (percorre cada elemento) sobre cada tecla executando as funções abaixo
    tecla.disabled = true; // Desabilita a tecla/tecla-clicada
    tecla.style.opacity = "0.5"; // Diminui a opacidade da tecla
    tecla.style.cursor = "not-allowed"; // Muda o cursor para indicar que a tecla não pode ser clicada
    tecla.style.pointerEvents = "none"; // Faz sumir o cursor do evento hover
  });
}

function verificaPalavraSecreta(input) {

  verificarInputsVazios();
  const todosInputs = document.querySelectorAll('input[data-letra]');
  const valorCorreto = input.getAttribute("data-letra");
  if (input.value.toUpperCase() === valorCorreto) {
    input.style.backgroundColor = "rgb(186, 150, 43)";
    input.style.border = "outset 3px rgb(252, 237, 177)";
    input.style.color = "black";
    input.style.cursor = "not-allowed";
    input.style.userSelect = "none";
    input.style.webkitUserSelect = "none";
    input.style.MozUserSelect = "none";
    input.style.msUserSelect = "none";
  } else {
    input.style.backgroundColor = "red";
    input.style.color = "white";
    input.style.border = "none";
    cronometro.pararCronometro();
    pontuacaoFinalErro(input);
    setTimeout(() => {
      document.getElementById("mensagem-game-over-erro").style.display = "block";
      document.getElementById("dicas").style.display = "none";
      document.getElementById("palavra-secreta").style.display = "none";
      document.getElementById("teclado").style.display = "none";
    }, 2000);

    document.querySelectorAll(".box-editavel")
      .forEach(box => box.className = "box-nao-editavel");

    document.getElementById("sair").classList.add("flash-effect-tip");
    return;
  }

  const inputsDaPalavra = Array.from(document.querySelectorAll("input[data-letra]"));
  const inputsVaziosPreenchidos = inputsDaPalavra.every(inp => {
    if (window.getComputedStyle(inp).display === "none") return true;
    return inp.value.trim() !== "";
  });

  if (inputsVaziosPreenchidos) {
    cronometro.pararCronometro();

    // 0.1) Exibe novamente a quantidade de vazios antes do cálculo final
    console.log(`Inputs vazios antes do acerto final: ${conjuntoInputsVazios.length}`);
    setTimeout(() => {
      document.getElementById("mensagem-game-over-acerto").style.display = "block";
      document.getElementById("sair").classList.add("flash-effect-tip");
      document.getElementById("dicas").style.display = "none";
      document.getElementById("palavra-secreta").style.display = "none";
      document.getElementById("teclado").style.display = "none";
    }, 1000);
    pontuacaoFinalAcerto();
  }
}

function pontuacaoFinalErro() {
  score *= 0; // Zera a pontuação atual multiplicando por zero
  acrescentaPontuacao();  // Atualiza a exibição da pontuação zerada
}

function pontuacaoFinalAcerto() {
  //   verificarInputsVazios();
  //     const todosInputs = document.querySelectorAll('input[data-letra]');
  //     const inputsVazios = Array.from(todosInputs)
  //     const condicaoQCV =
  //         (letras < 6 && inputsVazios > 2) ||
  //         (letras >= 6 && inputsVazios >= 3);

  //     if (condicaoQCV) {
  //         score += 20;
  //     } else {
  //         score += 10;
  //     }

  //     acrescentaPontuacao();
}

// Chamadas das funções na ordem correta para que a variável nomeSorteado seja definida antes
sortearNome(listaDePersonagens);
configurarInputsBox();
configurarTeclado();
