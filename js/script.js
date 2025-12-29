let nomeSorteado;         // ficará visível em todo o arquivo
let personagemSecreto = "";
let matches = 0; // Variável que armazena a quantidade de letras acertadas
let score = 100;                // pontuação inicial

// Sorteia o personagem e retorna em maiúsculas
// let listaDisponivel = [...listaDePersonagens];
// let sorteados = carregarSorteados();
let sorteados = JSON.parse(localStorage.getItem("sorteados")) || [];
let listaDisponivel = listaDePersonagens.filter(p => !sorteados.includes(p));

function sortearPersonagem() {
  // se a lista auxiliar estiver vazia, recomeça
  if (listaDisponivel.length === 0) {
    listaDisponivel = [...listaDePersonagens];
    sorteados = [];
  }
  // O código abaixo sorteia um personagem aleatório de listaDisponivel, remove-o da lista para não ser repetido, guarda-o em sorteados, persiste esse histórico no localStorage,
  const idx = Math.floor(Math.random() * listaDisponivel.length); // gera um número aleatório entre 0 e 1 (exclusivo).
  personagemSecreto = listaDisponivel.splice(idx, 1)[0]; // remove um item da lista auxiliar
  sorteados.push(personagemSecreto); // adiciona à lista de já sorteados
  salvarSorteados(sorteados); // salva o array sorteados no localStorage do navegador. 👉 Isso garante que, mesmo recarregando a página, os sorteados anteriores não se percam.
  console.log("Já sorteados:", sorteados); // exibe no console a lista atualizada de sorteados
  return personagemSecreto.toUpperCase(); // retorna o nome sorteado em maiúsculas
}

function salvarSorteados(lista) {
  localStorage.setItem("sorteados", JSON.stringify(lista));
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

function configurarInputsBox(nome) {
  const letrasArray = nome.split("");

  for (let i = 1; i <= 18; i++) {
    const inputBox = document.getElementById(`A${i}`);
    if (!inputBox) continue;

    // Oculta inputs não utilizados
    if (i > letrasArray.length) {
      inputBox.closest("td").style.display = "none";
      continue;
    }

    const letra = letrasArray[i - 1];
    inputBox.setAttribute("data-letra", letra);
    inputBox.disabled = true;

    if (letra === "1") {
      inputBox.value = "I";
      inputBox.style.backgroundImage = "url('imagens/um.jpg')";
      inputBox.style.backgroundRepeat = "no-repeat";
      inputBox.style.backgroundSize = "cover";
      inputBox.style.backgroundPosition = "center";
      inputBox.readOnly = true;
      inputBox.classList.remove("box-editavel");
      inputBox.classList.add("box-nao-editavel");
    } else if (letra === "2") {
      inputBox.value = "II";
      inputBox.style.backgroundImage = "url('imagens/dois.jpg')";
      inputBox.style.backgroundRepeat = "no-repeat";
      inputBox.style.backgroundSize = "cover";
      inputBox.style.backgroundPosition = "center";
      inputBox.readOnly = true;
      inputBox.classList.remove("box-editavel");
      inputBox.classList.add("box-nao-editavel");
    } else if (letra === "-") {
      inputBox.value = letra;
      inputBox.classList.add("box-hifen");
      inputBox.classList.remove("box", "box-editavel", "box-nao-editavel");

    } else if (letra === " ") {
      inputBox.value = letra;
      inputBox.classList.add("box-hifen");
      inputBox.classList.remove("box", "box-editavel", "box-nao-editavel");

    } else if (["3", "4", "5", "6"].includes(letra)) {
      inputBox.value = letra;
      // inputBox.classList.add("box-casa-vazia");
      inputBox.classList.remove("box", "box-editavel", "box-nao-editavel");
      inputBox.style.display = "none";
      inputBox.closest("td").style.display = "none";
    } else {
      inputBox.value = "";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => { // Espera o carregamento completo do DOM antes de executar o código
  configurarTeclado();
  iniciarJogo();
  verificarLetraClicada();

  cronometro.iniciaCronometro();
  setInterval(() => cronometro.atualizaCronometro(), 1000); // Atualiza o cronômetro a cada segundo
});

// Configura o teclado
function configurarTeclado() {
  const botoesTecla = document.querySelectorAll("button.tecla"); // Seleciona todos os botões com a classe "tecla"
  botoesTecla.forEach(buttonClicado => { // Para cada botão, atribui o id como conteúdo do botão
    const letra = buttonClicado.id; // recebe o id do botão
    buttonClicado.textContent = letra; // atribui o id do botão ao seu próprio conteúdo

    buttonClicado.addEventListener("click", () => { // Quando qualquer tecla for clicada → bloquear todas as teclas
      bloquearTeclas();
    });
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

const botaoMostraDicas = document.getElementById("mostra-dicas");
function verificarLetraClicada() {
  const botoesTecla = document.querySelectorAll("button.tecla"); // Seleciona todos os botões com a classe "tecla"

  botoesTecla.forEach(buttonClicado => { // Para cada botão "tecla", adiciona um listener para o evento de clique
    buttonClicado.addEventListener("click", () => { // Quando qualquer botão "tecla" é clicado, executa a função:
      acionaBotaoDica();
      bloquearTeclas();

      const letra = buttonClicado.id; // obtém a letra do id do botão "tecla" clicado
      let acertou = false; // variável para rastrear se houve acerto
      let countMatches = 0; // contador de correspondências para esta letra

      document.querySelectorAll("input[data-letra]").forEach(inputBox => { // Seleciona todos os inputs que possuem o atributo data-letra
        if (inputBox.dataset.letra === letra) { // Compara a letra do botão clicado com o atributo data-letra do inputBox
          inputBox.value = letra; // Preenche o input com a letra correta
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

      if (acertou) {
        const conjuntoInputsVazios = Array.from(document.querySelectorAll("input[data-letra]")) // Seleciona todos os inputs que possuem o atributo data-letra
          .filter(inp => inp.value.trim() === "");  // Filtra apenas os inputs que estão vazios

        const casasVazias = conjuntoInputsVazios.length; // Conta quantos inputs ainda estão vazios
        const tamanhoPalavra = nomeSorteado.length; // Armazena a quantidade total de letras da palavra sorteada

        let limitePermitido = 0; // variável para armazenar o limite de casas vazias permitido

        if (tamanhoPalavra <= 5) { // Se a quantidade total de letras da palavra sorteada for até 5
          limitePermitido = 0; // se a palavra tem até 5 letras, só termina quando todas as letras forem preenchidas
        } else if (tamanhoPalavra === 6) {
          limitePermitido = 1; // se a palavra tem 6 letras, termina quando restar 1 letra vazia
        } else if (tamanhoPalavra >= 7 && tamanhoPalavra <= 9) {
          limitePermitido = 2; // se a palavra tem entre 7 a 9 letras, termina quando restarem 2 letras vazias
        } else if (tamanhoPalavra > 9) {
          limitePermitido = 3; // se a palavra tem mais de 10 letras ou mais, termina quando restarem 3 letras vazias
        }

        if (casasVazias === 0) {
          verificarPalavraPreenchida();
          const mostraDicasVisivel = document.getElementById("mostra-dicas");
          if (mostraDicasVisivel && getComputedStyle(mostraDicasVisivel).display === "flex") {
            mostraDicasVisivel.style.display = "none";
          }
        } else if (casasVazias <= limitePermitido) {
          if (tamanhoPalavra <= 4) {
            verificarPalavraPreenchida();
            const mostraDicasVisivel = document.getElementById("mostra-dicas");
            if (mostraDicasVisivel && getComputedStyle(mostraDicasVisivel).display === "flex") {
              mostraDicasVisivel.style.display = "none";
            }
          } else { // só mostrar mensagem-dica2 se houver pelo menos 1 casa vazia
            if (casasVazias >= 1) {
              document.getElementById("mensagem-dica2").style.display = "grid";
              botaoMostraDicas.style.display = "none";
              bloquearTeclas();
            }
          }
        } else {
          document.getElementById("mensagem-letra-certa").style.display = "flex";
        }

        score -= 1;
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

function clicarOk2() { // Ocultar mensagem de dica2
  const mensagemDica = document.getElementById("mensagem-dica2");
  mensagemDica.style.display = 'none'; // Esconde a mensagem de dica2
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

function digitarPalavraSecreta() { // Configura os inputs para permitir digitação
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

document.addEventListener("DOMContentLoaded", () => { // Espera o carregamento completo do DOM antes de executar o código 
  document.querySelectorAll('input.box-editavel').forEach(inp => { // Seleciona todos os inputs com a classe "box-editavel"
    inp.setAttribute('maxlength', '1'); // Limita a 1 caractere
    inp.autocomplete = 'off'; // Desativa o autocomplete (preventivo)
    inp.spellcheck = false; // Desativa o corretor ortográfico (preventivo)
  });

  document.addEventListener('keydown', (e) => {
    const input = document.activeElement; // Obtém o elemento atualmente em foco

    if (!input || !input.classList || !input.classList.contains('box-editavel')) return;
    if (e.key.length !== 1) return; // ignora teclas de controle (Enter, Tab, etc.)

    e.preventDefault(); // evita inserir mais de 1 caractere por padrão

    const tecla = e.key.toUpperCase(); // Converte a tecla pressionada para maiúscula
    const letraCorreta = (input.getAttribute('data-letra') || '').toUpperCase(); // Pega a letra correta do atributo data-letra

    input.value = tecla; // Preenche o input com a letra digitada

    if (tecla === letraCorreta) { // ✅ Acertou
      const inputsVaziosAntes = document.querySelectorAll("input.box-editavel:not([disabled])").length; // Conta quantos inputs editáveis ainda estão vazios antes de preencher este
      input.style.background = "rgb(186,150,43)";
      input.style.border = "outset 3px rgb(252,237,177)";
      input.style.color = "black";
      input.classList.remove("box", "box-editavel");
      input.classList.add("box-nao-editavel");
      input.disabled = true; // desabilita o input após acertar

      const todosInputs = Array.from(document.querySelectorAll('input[data-letra]')); // Seleciona todos os inputs com atributo data-letra
      const indexAtual = todosInputs.indexOf(input); // procura dentro da lista (array) "todosInput", o valor que corresponde ao input atual

      for (let i = indexAtual + 1; i < todosInputs.length; i++) { // Percorre os inputs a partir do próximo índice
        const proximo = todosInputs[i];
        if (proximo.classList.contains('box-editavel') && !proximo.disabled) { // Se o próximo input for editável e não desabilitado, então ...
          proximo.focus(); // coloca o foco no próximo input editável
          break; // Sai do loop após encontrar o próximo input editável
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
  const inputsDaPalavra = Array.from(document.querySelectorAll("input[data-letra]")); // Seleciona todos os inputs que possuem o atributo data-letra e transforma o resultado em um array
  const todosPreenchidos = inputsDaPalavra.every(inp => { // Verifica se todos os inputs visíveis (não escondidos) já têm valor (se já foram preenchidos)

    if (window.getComputedStyle(inp).display === "none") return true; // Se o input está escondido (display:none), ignora
    if (inp.classList.contains("box-hifen")) return true;  // Se o conteúdo do input é hífen, ignora.
    return inp.value.trim() !== ""; // Evita falsos positivos: sem trim(), um campo contendo apenas espaços " " seria considerado preenchido;
  });

  if (todosPreenchidos) { // Se todos os inputs visíveis foram preenchidos
    console.log("[STATUS] Todos os inputs visíveis foram preenchidos! Finalizando jogo...");
    cronometro.pararCronometro();
    pontuacaoFinal();

    setTimeout(() => {
      document.getElementById("mensagem-game-over-acerto").style.display = "grid";
      document.getElementById("sair").classList.add("flash-effect-tip");
      document.getElementById("dicas").style.display = "none";
      document.getElementById("teclado").style.display = "none";
    }, 1000);
  }
}

function pontuacaoFinalErro() {
  score *= 0; // Zera a pontuação atual multiplicando por zero
  acrescentaPontuacao();  // Atualiza a exibição da pontuação zerada
}

function pontuacaoFinal() {
  const indicadorEl = document.getElementById('indicador');
  const cronometroEl = document.getElementById('cronometro');

  if (!indicadorEl || !cronometroEl) {
    console.error('Elemento indicador ou cronometro não encontrado.');
    return;
  }
  const rawIndicador = indicadorEl.textContent.trim();
  const indicadorNum = Number(rawIndicador.replace(',', '.')); // aceita vírgula como decimal
  if (Number.isNaN(indicadorNum)) {
    console.error('Valor do indicador não é um número válido:', rawIndicador);
    return;
  }

  const valorMultiplicado = indicadorNum * 1000; // Multiplica o valor do indicador por 1000
  const rawCrono = cronometroEl.textContent.trim();  // Remove tudo que não for dígito e converte para inteiro
  const cronometroDigits = rawCrono.replace(/\D/g, ''); // extrai apenas os dígitos
  if (cronometroDigits === '') {
    console.error('Cronômetro não contém dígitos válidos:', rawCrono);
    return;
  }
  const cronometroNum = parseInt(cronometroDigits, 10);  // Calcula: (valorMultiplicado - cronometroNum) / 100
  const resultado = (valorMultiplicado - cronometroNum) / 100;  // Formata o resultado (opcional: duas casas decimais)
  const resultadoFormatado = Number.isInteger(resultado) ? String(resultado) : resultado.toFixed(2);

  indicadorEl.textContent = resultadoFormatado;  // Atualiza o elemento indicador com o novo resultado
}



