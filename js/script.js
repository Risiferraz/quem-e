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
  for (let i = 1; i <= 18; i++) { // numera sequencialmente os digitar de 1 a 18 (no máximo) conforme quantidade de letras
    const inputBox = document.getElementById(`A${i}`); // especifica o inputBox como A1, A2, A3...
    if (!inputBox) continue; //

    if (i <= letrasArray.length) { // Se o índice for menor ou igual ao número de letras do nome sorteado
      const letra = letrasArray[i - 1]; // Pega a letra correspondente do array (ajustando o índice)
      inputBox.setAttribute("data-letra", letra); // Define o atributo data-letra com a letra correspondente
      inputBox.disabled = true; // Desabilita o inputBox para evitar edição
      inputBox.value = ""; // Limpa o valor do inputBox, evitando assim efeitos colaterais e garantindo que cada inputBox comece sem sobras de valores anteriores.

      if (letra === "-" || letra === " ") { // Se a letra for um hífen ou espaço, define o valor do inputBox como nulo.
        inputBox.value = letra;
        inputBox.classList.add("box-hifen");
        inputBox.classList.remove("box", "box-editavel", "box-nao-editavel");
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
  // 3. Configura os digitar
  configurarInputsBox(nomeSorteado);
}

document.addEventListener("DOMContentLoaded", () => { // Espera o carregamento completo do DOM antes de executar o código
  configurarTeclado();
  iniciarJogo();
  verificarLetraClicada();

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
  const botoesTecla = document.querySelectorAll("button.tecla"); // Seleciona todos os botões com a classe "tecla"
  botoesTecla.forEach(botao => { // Para cada botão, desabilita e aplica estilos de bloqueio
    botao.disabled = true; // Desabilita o botão
    botao.style.opacity = "0.2"; // Aplica opacidade para indicar que está desabilitado
    botao.style.cursor = "not-allowed"; // Muda o cursor para indicar que não pode ser clicado
  });
}

// Configura o teclado
function configurarTeclado() {
  const botoesTecla = document.querySelectorAll("button.tecla");
  botoesTecla.forEach(buttonClicado => {
    const letra = buttonClicado.id;
    buttonClicado.textContent = letra;

    buttonClicado.addEventListener("click", () => { // Quando qualquer tecla for clicada → bloquear todas as teclas
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

      document.querySelectorAll("input[data-letra]").forEach(inputBox => {
        if (inputBox.dataset.letra === letra) { // Compara a letra do botão clicado com o atributo data-letra do inputBox
          inputBox.value = letra;
          inputBox.style.background = "rgb(186,150,43)";
          inputBox.style.border = "outset 3px rgb(252,237,177)";
          inputBox.style.color = "black";
          inputBox.classList.remove("box", "box-editavel");
          inputBox.classList.add("box-nao-editavel");
          inputBox.disabled = true;
          acertou = true;
          countMatches++;
        }
      });

      if (acertou) { // Se acertou, mostra a mensagem de acerto e atualiza a pontuação
        document.getElementById("mensagem-letra-certa").style.display = "flex";
        score -= 1; // Deduz 1 ponto por letra certa
        matches += countMatches;
      } else {
        document.getElementById("mensagem-letra-errada").style.display = "flex";
        score -= 3; // Deduz 3 pontos por letra errada
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

function acrescentaPontuacao() { // só atualiza a div id="indicador"
  document.getElementById("indicador").textContent = score; // Atualiza o indicador de pontuação
}

let contadorCliques = 0; // contador de cliques no botão "mostra-dicas"
const botaoMostraDicas = document.getElementById("mostra-dicas");

botaoMostraDicas.addEventListener("click", () => {
  contadorCliques++;

  if (contadorCliques >= 5) {
    console.log("Limite atingido: o botão não será mais exibido.");
    botaoMostraDicas.style.display = "none"; // esconde de vez a partir do 5º clique
  }
});

// 🔹 Função que apenas exibe o botão (sem contar cliques)
function exibirBotaoMostraDicas() {
  setTimeout(() => {
    if (!botaoMostraDicas) return;
    botaoMostraDicas.style.display = "flex";
  }, 500);

  if (botaoMostraDicas.disabled) {
    botaoMostraDicas.disabled = false;
  }
  if (botaoMostraDicas.style.cursor === "none") {
    botaoMostraDicas.style.cursor = "pointer";
  }
  botaoMostraDicas.style.opacity = "1";
}

function clicarOk3() {
  const mensagemLetraCerta = document.getElementById("mensagem-letra-certa");
  if (mensagemLetraCerta) {
    mensagemLetraCerta.style.display = "none";
  }

  if (contadorCliques < 5) {
    exibirBotaoMostraDicas();
  } else {
  }

  liberarTeclas();
  digitarPalavraSecreta(); // Chama a função que configura os inputs
}

function clicarOk4() {
  const mensagemLetraErrada = document.getElementById("mensagem-letra-errada");
  if (mensagemLetraErrada) {
    mensagemLetraErrada.style.display = "none";
  }

  if (contadorCliques < 5) { // mesma lógica de limite
    exibirBotaoMostraDicas();
  } else {
  }

  liberarTeclas();
  digitarPalavraSecreta(); // Chama a função que configura os inputs
}

function digitarPalavraSecreta() {
  document.querySelectorAll("input.box").forEach(input => { // Seleciona todos os inputs com a classe "box"
    if (!input.classList.contains("box-nao-editavel")) { // Se o input não for "box-nao-editavel"
      input.classList.remove("box", "box-nao-editavel", "box-editavel"); // Remove todas as classes relacionadas
      input.classList.add("box-editavel"); // Adiciona a classe "box-editavel"
      input.disabled = false; // permitir digitação
      input.addEventListener("click", () => {
        bloquearTeclas();
        // validarLetraDigitada(input);
        const mostraDicas = document.getElementById("mostra-dicas");
        if (mostraDicas) {
          mostraDicas.disabled = true;
          mostraDicas.style.opacity = "0";
          mostraDicas.style.cursor = "not-allowed";
        }
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Opcional: limite cada input a 1 caractere via atributo HTML
  document.querySelectorAll('input.box-editavel').forEach(inp => {
    inp.setAttribute('maxlength', '1');
    inp.autocomplete = 'off';
    inp.spellcheck = false;
  });

  // Captura teclas para o input atualmente focado
  document.addEventListener('keydown', (e) => {
    const input = document.activeElement;

    // Só processa se o foco atual estiver em um input editável do jogo
    if (!input || !input.classList || !input.classList.contains('box-editavel')) return;
    if (e.key.length !== 1) return; // ignora teclas de controle (Enter, Tab, etc.)

    e.preventDefault(); // evita inserir mais de 1 caractere por padrão

    const tecla = e.key.toUpperCase();
    const letraCorreta = (input.getAttribute('data-letra') || '').toUpperCase();

    // Escreve a tecla no campo (garante 1 caractere)
    input.value = tecla;

    if (tecla === letraCorreta) {
      // ✅ Acertou
      input.style.background = "rgb(186,150,43)";
      input.style.border = "outset 3px rgb(252,237,177)";
      input.style.color = "black";
      input.classList.remove("box", "box-editavel");
      input.classList.add("box-nao-editavel");
      input.disabled = true;

      // Vai para o próximo input da sequência
      const todosInputs = Array.from(document.querySelectorAll('input[data-letra]'));
      const indexAtual = todosInputs.indexOf(input);

      for (let i = indexAtual + 1; i < todosInputs.length; i++) {
        const proximo = todosInputs[i];
        if (proximo.classList.contains('box-editavel') && !proximo.disabled) {
          proximo.focus();
          break;
        }
      }
      verificarPalavraPreenchida();
    } else {
      // ❌ Errou
      input.style.backgroundColor = "red";
      input.style.color = "white";
      input.style.border = "none";
      cronometro.pararCronometro();
      pontuacaoFinalErro();
      setTimeout(() => {
        document.getElementById("mensagem-game-over-erro").style.display = "grid";
        document.getElementById("sair").classList.add("flash-effect-tip");
      }, 2000);
    }
  });

  document.addEventListener('paste', (e) => {
    const input = document.activeElement;
    if (input && input.classList && input.classList.contains('box-editavel')) {
      e.preventDefault();
    }
  });

  const primeiroBoxEditavel = document.querySelector('input.box-editavel:not([disabled])'); // Seleciona o primeiro input editável não desabilitado
  if (primeiroBoxEditavel) primeiroBoxEditavel.focus(); // coloca foco no primeiro input editável
});

function verificarPalavraPreenchida() {
  const inputsDaPalavra = Array.from(document.querySelectorAll("input[data-letra]"));

  const todosPreenchidos = inputsDaPalavra.every(inp => { // Verifica se todos os inputs visíveis (não escondidos) já têm valor

    if (window.getComputedStyle(inp).display === "none") return true; // Se o input está escondido (display:none), ignora
    if (inp.classList.contains("box-hifen")) return true;  // Se o conteúdo do input é hífen
    return inp.value.trim() !== ""; // Verifica se o input tem valor (não vazio)
  });

  if (todosPreenchidos) {
    console.log("[STATUS] Todos os inputs visíveis foram preenchidos! Finalizando jogo...");
    cronometro.pararCronometro();

    setTimeout(() => {
      document.getElementById("mensagem-game-over-acerto").style.display = "grid";
      document.getElementById("sair").classList.add("flash-effect-tip");
      document.getElementById("dicas").style.display = "none";
      document.getElementById("teclado").style.display = "none";
    }, 1000);

    // pontuacaoFinalAcerto();
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


