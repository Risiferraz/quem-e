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

    return inputsVisiveis && inputsNaoPreenchidos && inputsSemHifen; // retorna apenas os inputs que são visíveis, não preenchidos e não contem hífen-
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

  function exibeMensagens(id, showClass, delay = 1500) {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = "block";
      el.classList.add(showClass);
    }, delay);
  }

  teclas.forEach(tecla => {
    tecla.addEventListener("click", () => {
      cronometro.iniciaCronometro();
      contadorCliques++; // Incrementa o contador de cliques a cada clique na tecla

      const letra = tecla.textContent.trim().toUpperCase();
      const inputs = Array.from(
        document.querySelectorAll(`input[data-letra="${letra}"]`)
      );
      const acertouLetra = inputs.length > 0; // Verifica se a letra existe na palavra

      if (acertouLetra) {
        // Preenche inputs vazios, estiliza e atualiza pontuação
        score--;
        inputs.forEach(input => {
          if (input.value === "") {
            input.value = letra;
            input.style.background = "rgb(186,150,43)";
            input.style.border = "outset 3px rgb(252,237,177)";
            input.style.color = "black";
            input.classList.replace("box-editavel", "box-nao-editavel");
            matches++;
            acrescentaPontuacao();
          }
        });
        exibeMensagens("mensagem-letra-certa", "mensagem-letra-certa-show");
      } else {
        // Marca erro, aplica efeito e penaliza
        tecla.classList.add("efeito-letra-errada");
        score -= 2;
        acrescentaPontuacao();
        exibeMensagens("mensagem-letra-errada", "mensagem-letra-errada-show");
      }

      // Atualiza quantidade de espaços vazios
      verificarInputsVazios();
      const casasVazias = conjuntoInputsVazios.length;
      const limiteCasasVazias =
        (nomeSorteado.length < 6 && casasVazias > 2) ||
        (nomeSorteado.length >= 6 && casasVazias > 3); // constante recebe informação se o número de casas vazias for maior que 2 ou 3, dependendo do tamanho da palavra
      const dica2 = document.getElementById("mensagem-dica2");

      // Lógica extra após 5 cliques
      if (contadorCliques >= 5) { // Após o 5º clique
        setTimeout(() => { // Espera 1 segundo antes de executar a lógica abaixo
          if (acertouLetra) { // Se a letra foi acertada
            if (limiteCasasVazias) {
            } else {
              if (dica2) dica2.style.display = "block";
            }
          } else {
            exibeMensagens("mensagem-letra-errada", "mensagem-letra-errada-show", 1000);
          }
        }, 1000);
      }

      // Desabilita teclado se restarem poucas casas vagas e exibe dica final
      if (
        (nomeSorteado.length < 6 && casasVazias <= 2) ||
        (nomeSorteado.length >= 6 && casasVazias <= 3)
      ) {
        const dica2 = document.getElementById("mensagem-dica2");
        if (dica2) dica2.style.display = "block";
        desabilitarTeclado();
      }

      // Ação da dica antes/depois do 4º clique
      if (contadorCliques <= 4) {
        acionaBotaoDica();
      } else {
        const msgDica = document.getElementById("mensagem-dica");
        if (msgDica) {
          msgDica.style.opacity = "0";
          setTimeout(() => (msgDica.style.opacity = "1"), 2500);
        }
      }

      digitarPalavraCerta();

      // Marca a tecla como usada
      tecla.classList.replace("tecla", "tecla-clicada");
    });
  });
}   // fecha configurarTeclado

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
}

function clicarOk4() {
  const mensagemLetraErrada = document.getElementById("mensagem-letra-errada");
  mensagemLetraErrada.style.display = 'none'; // Esconde a mensagem-letra-errada
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


function validarLetraDigitada(input) {
  input.addEventListener("input", () => {
    const letraCorreta = input.getAttribute("data-letra");
    const valorDigitado = input.value.toUpperCase();

    if (valorDigitado === letraCorreta) {
      // ✅ Acertou
      input.style.background = "rgb(186,150,43)";
      input.style.border = "outset 3px rgb(252,237,177)";
      input.style.color = "black";
      input.classList.remove("box", "box-editavel");
      input.classList.add("box-nao-editavel");
      input.disabled = true;

      const inputs = Array.from(document.querySelectorAll(".box-editavel"));

      // Descobre o índice do input atual na lista original (mesmo que ele já tenha perdido a classe)
      const todosInputs = Array.from(document.querySelectorAll("input[data-letra]"));
      const indexAtual = todosInputs.indexOf(input);

      // Foca no próximo input editável
      const proximo = todosInputs[indexAtual + 1];
      if (proximo && proximo.classList.contains("box-editavel")) {
        proximo.focus();
      }
    } else {
      // ❌ Errou
      input.style.backgroundColor = "red";
      input.style.color = "white";
      input.style.border = "none";
      cronometro.pararCronometro();

      setTimeout(() => {
        document.getElementById("mensagem-game-over-erro").style.display = "block";
        // document.getElementById("dicas").style.display = "none";
        // document.getElementById("palavra-secreta").style.display = "none";
        // document.getElementById("teclado").style.display = "none";
      }, 2000);
    }
  });
}
// Inicializa a função em todos os inputs editáveis
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".box-editavel");
  inputs.forEach(inp => validarLetraDigitada(inp));
});

