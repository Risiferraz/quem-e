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
  document.getElementById("indicador").textContent = score;
}

function configurarTeclado() {
  const teclas = document.querySelectorAll(".tecla");
  let contadorCliques = 0;

  teclas.forEach(tecla => {
    tecla.addEventListener("click", () => {
      contadorCliques++;
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
          }
        });
      } else {
        tecla.classList.add("efeito-letra-errada");
        score -= 2; // Perde 2 pontos se clicou numa letra errada
        acrescentaPontuacao();
      }
      verificarInputsVazios();

      if (contadorCliques >= 5) {
        setTimeout(() => {
          const msgCerta = document.getElementById("mensagem-letra-certa");
          const msgDica2 = document.getElementById("mensagem-dica2");
          const casasVazias = conjuntoInputsVazios.length;
          const limiteCasasVazias =
            (nomeSorteado.length < 6 && casasVazias > 2) ||
            (nomeSorteado.length >= 6 && casasVazias > 3);

          if (acertouLetra) {
            if (msgCerta && limiteCasasVazias) {
              msgCerta.style.display = "block";
            } else {
              if (msgDica2) msgDica2.style.display = "block";
            }
          } else {
            // após o 5º clique, se errou a letra
            setTimeout(() => { // aguarda 1 segundo para exibir a mensagem de erro
              const msgErrada = document.getElementById("mensagem-letra-errada");
              if (msgErrada) {
                msgErrada.style.display = "block";
              }
            }, 2000);
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
      // ------------------------------------------------------
      // Marca a tecla como usada
      // ------------------------------------------------------
      tecla.classList.remove("tecla");
      tecla.classList.add("tecla-clicada");
    });                // fecha addEventListener
  });                  // fecha forEach
}                      // fecha configurarTeclado

function clicarOk3() {
  const mensagemLetraCerta = document.getElementById("mensagem-letra-certa");
  mensagemLetraCerta.style.display = 'none'; // Esconde a mensagem-letra-certa
}

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
    // Após 2,5 segundos, exibe a mensagem de dica e programa o desaparecimento de "mostra-dicas"
    setTimeout(() => {
      const mostraDicas = document.getElementById("mostra-dicas");
      if (mostraDicas) {
        mostraDicas.style.opacity = "0"; // Diminui a opacidade do botão "mostra-dicas"
      }
    }, 1000);
  }, 5000);
}

function verificaPalavraSecreta(input) { // Função para verificar se a palavra secreta foi digitada corretamente
  const valorCorreto = input.getAttribute("data-letra"); // Obtém o valor correto da letra do atributo data-letra do input

  if (input.value.toUpperCase() === valorCorreto) { // Compara o valor do input com o valor correto, ambos em maiúsculas, neste caso ...
    input.style.backgroundColor = "rgb(186, 150, 43)";
    input.style.border = "outset 3px rgb(252, 237, 177)";
    input.style.color = "black";
    pontuacaoFinal(input); // Chama a função para calcular a pontuação final
  } else {
    input.style.backgroundColor = "red";
    input.style.color = "white";
    input.style.border = "none";
    setTimeout(() => {
      document.getElementById("mensagem-game-over-erro").style.display = "block";
      document.getElementById("dicas").style.display = "none";
      document.getElementById("palavra-secreta").style.display = "none";
      document.getElementById("teclado").style.display = "none";
    }, 2000);
    const boxes = document.querySelectorAll(".box-editavel");// faz com que inputsVazios os inputs já preenchidos não possam mais ser editados
    boxes.forEach(box => {
      box.className = "box-nao-editavel";
    });
    document.getElementById("sair").classList.add("flash-effect-tip");
    return;
  }

  const inputsDaPalavra = Array.from(document.querySelectorAll("input[data-letra]"));
  // Verifica se inputsVazios os inputs visíveis já foram preenchidos
  const inputsVaziosPreenchidos = inputsDaPalavra.every(inp => { // verifica se todos os inputs visíveis estão preenchidos
    if (window.getComputedStyle(inp).display === "none") { // Se o input não está visível, ignora a verificação
      return true;
    }
    return inp.value.trim() !== ""; //Retorna true se o input estiver preenchido
  });

  // Se a palavra estiver completa, exibe a mensagem de acerto após 2,5 segundos
  if (inputsVaziosPreenchidos) {
    setTimeout(() => {
      document.getElementById("mensagem-game-over-acerto").style.display = "block";
      document.getElementById("sair").classList.add("flash-effect-tip");
      document.getElementById("dicas").style.display = "none";
      document.getElementById("palavra-secreta").style.display = "none";
      document.getElementById("teclado").style.display = "none";
    }, 1000);
  }
}

function pontuacaoFinal(input) {
  // 1) se veio um input válido
  if (input) {
    input.style.backgroundColor = "rgb(186,150,43)";
    input.style.border          = "outset 3px rgb(252,237,177)";
    input.style.color           = "black";
  }

  // 2) desabilita teclado
  desabilitarTeclado();

  // 3) conta vazios e log
  const vazios = Array.from(
    document.querySelectorAll("input.box-editavel")
  ).filter(i => i.value.trim() === "");
  console.log(`Ainda há ${vazios.length} inputs vazios.`);

  // 4/5) multiplica score
  const casas = vazios.length;
  const mul3 = (nomeSorteado.length < 6 && casas > 2) ||
               (nomeSorteado.length >= 6 && casas >= 3);
  score *= (mul3 ? 3 : 2);
  acrescentaPontuacao();
}

// Chamadas das funções na ordem correta para que a variável nomeSorteado seja definida antes
sortearNome(listaDePersonagens);
configurarInputsBox();
configurarTeclado();
