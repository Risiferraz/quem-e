let nomeSorteado;         // ficará visível em todo o arquivo
const listaDePersonagens = ["Maria-Madalena", "Jeremias", "Abias", "Maer-Salal-Has-Baz"];
let personagemSecreto = "";
let matches = 0; // Variável que armazena a quantidade de letras acertadas
let score = 100;                // pontuação inicial

// Sorteia o personagem e retorna em maiúsculas
function sortearPersonagem() {
  const idx = Math.floor(Math.random() * listaDePersonagens.length);
  personagemSecreto = listaDePersonagens[idx];
  return personagemSecreto.toUpperCase();
}

function configurarInputsBox(nome) {
  const letrasArray = nome.split(""); // Divide o nome sorteado em um array de letras
  for (let i = 1; i <= 18; i++) { // numera sequencialmente os inputs de 1 a 18 (no máximo) conforme quantidade de letras
    const inputBox = document.getElementById(`A${i}`); // especifica o inputBox como A1, A2, A3...
    if (!inputBox) continue; //

    if (i <= letrasArray.length) { // Se o índice for menor ou igual ao número de letras do nome sorteado
      const letra = letrasArray[i - 1]; // Pega a letra correspondente do array (ajustando o índice)
      inputBox.setAttribute("data-letra", letra); // Define o atributo data-letra com a letra correspondente
      inputBox.disabled = true; // Desabilita o inputBox para evitar edição
      inputBox.value = ""; // Limpa o valor do inputBox, evitando assim efeitos colaterais e garantindo que cada inputBox comece sem sobras de valores anteriores.

      if (letra === "-" || letra === " ") { // Se a letra for um hífen ou espaço, define o valor do inputBox como nulo.
        inputBox.value = letra;
        inputBox.style.backgroundColor = "transparent";
        inputBox.style.border = "none"; // Remove a borda para hífen ou espaço
      }
    } else {
      inputBox.closest("td").style.display = "none"; // Esconde os inputs excedentes à quantidade de letras
    }
  }
}

function iniciarJogo() {
  nomeSorteado = sortearPersonagem();
  // Ao iniciar o jogo, são feitas três coisas:
  // 1. Sorteia e exibe no console
  console.log("Personagem sorteado:", personagemSecreto);
  // 2. Exibe a pontuação inicial
  document.getElementById("indicador").textContent = score;
  // 3. Configura os inputs
  configurarInputsBox(nomeSorteado);
}

document.addEventListener("DOMContentLoaded", () => { // Espera o carregamento completo do DOM antes de executar o código
  configurarTeclado();
  iniciarJogo();
  verificarLetraClicada();

  //******* CRONÔMETRO ********
  const cronometro = new Cronometro();
  cronometro.iniciaCronometro();
  setInterval(() => cronometro.atualizaCronometro(), 1000); // Atualiza o cronômetro a cada segundo
});

function configurarTeclado() { // Atribui a cada botão de classe "tecla" a letra do seu próprio id
  const botoesTecla = document.querySelectorAll("button.tecla");
  botoesTecla.forEach(buttonClicado => {
    const letra = buttonClicado.id; // recebe o id do botão
    buttonClicado.textContent = letra; // atribui o id do botão ao seu próprio conteúdo
  });
}

// 1. Função que bloqueia todas as teclas
function bloquearTeclas() {
  const botoesTecla = document.querySelectorAll("button.tecla");
  botoesTecla.forEach(botao => {
    botao.disabled = true;
    botao.style.opacity = "0.5";   // opcional, só para dar feedback visual
    botao.style.cursor = "not-allowed";
  });
}

// Configura o teclado
function configurarTeclado() {
  const botoesTecla = document.querySelectorAll("button.tecla");
  botoesTecla.forEach(buttonClicado => {
    const letra = buttonClicado.id;
    buttonClicado.textContent = letra;

    // Quando qualquer tecla for clicada → bloquear todas
    buttonClicado.addEventListener("click", () => {
      bloquearTeclas();
    });
  });
}

// 2. Função que libera as teclas que ainda não foram clicadas
function liberarTeclas() {
  document.querySelectorAll("button.tecla").forEach(btn => {
    if (!btn.classList.contains("tecla-clicada")) {
      btn.disabled = false;
      btn.style.opacity = "";
      btn.style.pointerEvents = "";
      btn.style.cursor = "";
    }
  });
}
function verificarLetraClicada() {
  const botoesTecla = document.querySelectorAll("button.tecla"); // Seleciona todos os botões com a classe "tecla"

  botoesTecla.forEach(buttonClicado => { // Para cada botão, adiciona um listener para o evento de clique
    buttonClicado.addEventListener("click", () => { // Quando o botão é clicado, executa a função
      acionaBotaoDica();
      bloquearTeclas();
      const letra = buttonClicado.id;
      let acertou = false;
      let countMatches = 0;

      // 🔧 ALTERAÇÃO: antes era "input.box", agora usamos "input[data-letra]"
      // Isso garante que mesmo após mudar a classe (box → box-editavel), 
      // os inputs ainda sejam encontrados, pois todos têm o atributo data-letra.
      document.querySelectorAll("input[data-letra]").forEach(inputBox => {
        if (inputBox.dataset.letra === letra) {
          inputBox.value            = letra;
          inputBox.style.background = "rgb(186,150,43)";
          inputBox.style.border     = "outset 3px rgb(252,237,177)";
          inputBox.style.color      = "black";
          inputBox.classList.replace("box", "box-nao-editavel");
          acertou = true; 
          countMatches++; 
        }
      });

      if (acertou) {
        document.getElementById("mensagem-letra-certa").style.display = "flex";
        score -= 1;               
        matches += countMatches;  
      } else {
        document.getElementById("mensagem-letra-errada").style.display = "flex";
        score -= 2;               
      }

      acrescentaPontuacao();      
      desabilitarTecla(buttonClicado);
    });
  });
}

function desabilitarTecla(buttonClicado) {
  buttonClicado.disabled = true;
  buttonClicado.style.opacity = "0.5";
  buttonClicado.style.cursor = "not-allowed";
  buttonClicado.style.pointerEvents = "none";
  buttonClicado.classList.add("tecla-clicada");
}

function desabilitarTecla(buttonClicado) {
  buttonClicado.disabled = true;
  buttonClicado.style.opacity = "0.5";
  buttonClicado.style.cursor = "not-allowed";
  buttonClicado.style.pointerEvents = "none";
  buttonClicado.classList.add("tecla-clicada");
}

function acrescentaPontuacao() { // só atualiza o <div id="indicador">
  document.getElementById("indicador").textContent = score; // Atualiza o indicador de pontuação
}

function clicarOk3() {
  const mensagemLetraCerta = document.getElementById("mensagem-letra-certa");
  mensagemLetraCerta.style.display = 'none'; // Esconde a mensagem-letra-certa
  const botaoMostraDicas = document.getElementById('mostra-dicas')
  setTimeout(() => { // Define um tempo de espera de 5 segundos antes de mostrar o botão "mostra-dicas"
    if (!botaoMostraDicas) return; //
    botaoMostraDicas.style.display = 'flex'; // Mostra o botão "mostra-dicas"
  }, 500);
  if (botaoMostraDicas.disabled) {
    botaoMostraDicas.disabled = false; // Habilita o botão "mostra-dicas" se estiver desabilitado
  }
  if (botaoMostraDicas.style.cursor === "none") {
    botaoMostraDicas.style.cursor = "pointer"; // Alterar o cursor para "pointer" se estiver "none"
  }
  botaoMostraDicas.style.opacity = "1";    // Ajustar a opacidade do botão para 1
  liberarTeclas(); // Restaura todas as teclas não clicadas ao estado habilitado
}

function clicarOk4() {
  const mensagemLetraErrada = document.getElementById("mensagem-letra-errada");
  mensagemLetraErrada.style.display = 'none'; // Esconde a mensagem-letra-errada
  const botaoMostraDicas = document.getElementById('mostra-dicas')
  setTimeout(() => { // Define um tempo de espera de 5 segundos antes de mostrar o botão "mostra-dicas"
    if (!botaoMostraDicas) return; 
    botaoMostraDicas.style.display = 'flex'; // Mostra o botão "mostra-dicas"
  }, 500);
  if (botaoMostraDicas.disabled) {
    botaoMostraDicas.disabled = false; // Habilita o botão "mostra-dicas" se estiver desabilitado
  }
  if (botaoMostraDicas.style.cursor === "none") {
    botaoMostraDicas.style.cursor = "pointer"; // Alterar o cursor para "pointer" se estiver "none"
  }
  botaoMostraDicas.style.opacity = "1";    // Ajustar a opacidade do botão para 1
  liberarTeclas(); // Restaura todas as teclas não clicadas ao estado habilitado
}

