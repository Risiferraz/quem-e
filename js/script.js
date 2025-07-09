//1. cria uma lista de nomes a serem sorteados
const listaDePersonagens = ["Maria-Madalena", "Jeremias", "Abias"];
let nomeSorteado; // Variável global para armazenar o nome sorteado
let letras = [];

//2. Sorteia um nome da lista
function sortearNome(lista) {
    const indiceAleatorio = Math.floor(Math.random() * lista.length);
    nomeSorteado = lista[indiceAleatorio];
    console.log(`Nome sorteado: ${nomeSorteado}`); // Log para verificar o nome sorteado
    return nomeSorteado;
}
// 3. configura os inputs da table id="palavra-secreta"
// 3.1 sorteia um nome para começar o jogo
// 3.2 atribui uma letra a cada input
// 3.3 atribui estilo a cada input e também se a letra for um hífen e esconde os inputs vazios
// 3.4 desabilita o input para que não seja clicado nem editado

function configurarInputsBox() {
  // Divide o nome sorteado em array de letras
  const letrasArray = nomeSorteado.split("");

  // Percorre os inputs de A1 a A18
  for (let i = 1; i <= 18; i++) {
    const input = document.getElementById(`A${i}`);
    //if (!input) continue;  Garante que o elemento existe

    if (i <= letrasArray.length) {
      const letra = letrasArray[i - 1];
      // Define o atributo data-letra para a validação posterior (em maiúsculas)
      input.setAttribute("data-letra", letra.toUpperCase());
      input.disabled = true; // Comando para desabilitar o input
      // Inicializa o input com valor vazio
      input.value = "";
      // Se a letra for hífen, ajusta o estilo e mantém o input vazio
      if (letra === "-") {
        input.value = "";
        input.style.backgroundColor = "transparent";
        input.style.border = "none";
      }
    } else {
      // Esconde os inputs excedentes à quantidade de letras
      input.style.display = "none";
    }
  }
}

// 4. configura os butons da table id="teclado" - ao clicar em um buton aciona os comandos:
// 4.1 - adiciona em evento "click a cada button "tecla" 
// 4.2 - Remove a classe tecla -> muda o estilo do button "tecla"
// 4.3 - Adiciona a classe tecla-clicada -> muda o background, a cor da letra e a opacidade do button "tecla"
// 4.4 - Obtém o valor da tecla clicada
// 4.5 - Seleciona todos os inputs que possuem o mesmo valor de ID que a letra
// 4.6 - Escreve a mesma letra clicada nos inputs de mesmo valor
// 4.7 - Muda o background, a borda e a cor da letra do input com mesma letra clicada

function configurarTeclado() {
    let contadorCliques = 0; // Contador global para os cliques nas teclas
    const teclas = document.querySelectorAll(".tecla"); // Seleciona todos os elementos com a classe "tecla".

    teclas.forEach(tecla => {
        tecla.addEventListener("click", () => {
            contadorCliques++; // Incrementa o contador a cada clique
            const letra = tecla.textContent.trim().toUpperCase(); // Extrai e padroniza a letra da tecla clicada.
            const inputs = document.querySelectorAll(`input[data-letra="${letra}"]`); // Seleciona os inputs (da palavra-secreta) que correspondem à letra clicada (no teclado).

            // Abaixo configura OS INPUTS (BOX) DA PALAVRA SECRETA
            if (inputs.length > 0) { // verifica se essa lista (length) contém pelo menos um elemento (ou seja, se inputs.length é maior que zero).
                inputs.forEach(input => { // percorre cada elemento da lista inputs e SE encontrado, executa o bloco de código dentro das chaves
                    if (input.value === "") { // SE o input está vazio ...
                        input.value = letra; // Preenche os inputs vazios com a letra clicada.
                        input.style.background = "rgb(186, 150, 43)"; // muda a cor do background do input
                        input.style.border = "outset 3px rgb(252, 237, 177)"; // muda a borda do input
                        input.style.color = "black"; // muda a cor da letra inserida no input
                        console.log(`Letra "${letra}" inserida no input: ${input.id}`); // aparece mensagem no console dizendo qual letra foi inserida no input
                        input.classList.remove("box-editavel");
                        input.classList.add("box-nao-editavel"); // Muda a classe do input de "box-editavel" para "box-nao-editavel"
                    }
                });
            } else {
                // Se nenhum input corresponde à letra, adiciona o efeito visual para letra errada
                tecla.classList.add("efeito-letra-errada");
            }

            // Verifica a condição dos inputs vazios para possivelmente desabilitar o teclado
            verificarInputsVazios();

            if (contadorCliques <= 4) { // Chama acionaBotaoDica somente se o contador de cliques for 4 ou menor
                acionaBotaoDica();
            } else {
                const mensagemDica = document.getElementById("mensagem-dica");
                mensagemDica.style.opacity = '0';
                setTimeout(() => {
                    mensagemDica.style.opacity = '1';
                }, 2500);
            }
            tecla.classList.remove("tecla");
            tecla.classList.add("tecla-clicada");
        });
    });
}

function verificarInputsVazios() {
    // Seleciona todos os inputs que possam ser parte da palavra
    const inputsDaPalavra = Array.from(
        document.querySelectorAll(".box, .box-editavel, .box-nao-editavel")
    ).filter(input => window.getComputedStyle(input).display !== "none");

    // Filtra os inputs visíveis que estão vazios
    const inputsVazios = inputsDaPalavra.filter(
        input => input.value.trim() === ""
    );
    console.log(`Quantidade de inputs vazios: ${inputsVazios.length}`);

    // Se o nome sorteado tiver menos de 6 letras, a condição para TECLADO desabilitado é de 2 inputs vazios;
    // Caso contrário, 3 inputs vazios.
    if (
        (nomeSorteado.length < 6 && inputsVazios.length === 2) ||
        (nomeSorteado.length >= 6 && inputsVazios.length === 3)
    ) {
        console.log(
            "Quantidade de inputs vazios atingiu a condição necessária. Desabilitando o teclado."
        );
        desabilitarTeclado();
    }
}

function desabilitarTeclado() {
    const teclas = document.querySelectorAll('.tecla, .tecla-clicada');

    teclas.forEach(tecla => {  // Para cada elemento (botão) encontrado, aplicamos as alterações:
        tecla.disabled = true;  // Define o botão como desabilitado
        tecla.style.opacity = "0.5";   // Reduz a opacidade do botão em 30%
        tecla.style.cursor = "not-allowed";
        tecla.style.pointerEvents = "none";
    });
    setTimeout(() => {
        document.getElementById("mensagem-dica2").style.display = "flex";
    }, 2000);
}

function digitarPalavraCerta() {
    const inputs = document.querySelectorAll(".box"); // Seleciona todos os inputs com a classe "box"
    // const teclas = document.querySelectorAll(".tecla"); // Seleciona todos os botões com a classe "tecla"

    inputs.forEach(input => { // percorre o array inputs selecioando seus elementos (input)
        input.classList.remove("box"); // Remove a classe "box"
        input.classList.add("box-editavel"); // Adiciona a classe "box-editavel"
    });

    // Colocar o foco no primeiro input vazio
    const primeiroInputVazio = Array.from(inputs).find(input => input.value === "");
    if (primeiroInputVazio) {
        primeiroInputVazio.focus(); // Foca no primeiro input vazio
    }
    // Configurar comportamento de foco para o próximo input com background-color: gray
    inputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            if (input.value.length === 1) { // Verifica se o input recebeu uma letra
                verificaPalavraSecreta(input);
                // Desabilitar os botões (tecla) ao digitar a primeira letra
                // teclas.forEach(tecla => {
                //     tecla.disabled = true; // Desabilita os botões
                //     tecla.style.opacity = "0.3"; // Reduz a opacidade para 30%
                // });
                let proximoInput = inputs[index + 1]; // Focar no próximo input
                // Continua procurando até encontrar um input com background-color: gray
                while (proximoInput) {
                    const backgroundColor = window.getComputedStyle(proximoInput).backgroundColor;

                    // Verifica se o input tem background-color: gray
                    if (backgroundColor === "gray" || backgroundColor === "rgb(128, 128, 128)") {
                        break; // Encontra o input correto e interrompe o loop
                    }

                    // Avança para o próximo input
                    idx++;
                    proximoInput = inputs[idx + 1];
                }
                if (proximoInput) {
                    proximoInput.focus();
                }
            }
        });
        input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace") {
                event.preventDefault(); // Impede a ação padrão de apagar caracteres
            }
        });
    });
}

function verificaPalavraSecreta(input) {
    // Obtém o valor correto do atributo "data-letra"
    const valorCorreto = input.getAttribute("data-letra");
    // Converte o valor atual do input (input.value) para letras maiúsculas com toUpperCase() e compara com valorCorreto.
    if (input.value.toUpperCase() === valorCorreto) {
        input.style.backgroundColor = "rgb(186, 150, 43)"; //Altera a cor de fundo do input para indicar que o valor é correto.
        input.style.border = "outset 3px rgb(252, 237, 177)"; // Altera a borda do input para indicar que o valor é correto.
        input.style.color = "black"; // Altera a cor do texto do input para indicar que o valor é correto.
    } else { // Se o valor do input não for igual ao valor correto, executa o seguinte bloco de código:
        input.style.backgroundColor = "red";
        input.style.color = "white";
        input.style.border = "none";
        setTimeout(() => { // Após 3 segundos ...
            document.getElementById("mensagem-game-over-erro").style.display = "block"; // Exibe a mensagem de erro.
            document.getElementById("dicas").style.display = "none"; // Esconde a div dicas.
            document.getElementById("palavra-secreta").style.display = "none"; // Esconde a div palavra-secreta.
            document.getElementById("teclado").style.display = "none"; // Esconde a div teclado.
        }, 3000);
        
        const boxes = document.querySelectorAll(".box-editavel"); // Seleciona todos os inputs com a classe "box-editavel"
        boxes.forEach(box => {
            box.className = "box-nao-editavel"; // Muda a classe de "box-editavel" para "box-nao-editavel"
        });
        // Adiciona a classe "efeitoflash" ao botão com ID "sair"
        document.getElementById("sair").classList.add("flash-effect-tip");
        return; // Se o valor estiver incorreto, finalizamos a função aqui.
    }
    const inputsDaPalavra = Array.from(document.querySelectorAll("input[data-letra]"));

    // Consideramos apenas os inputs visíveis. Se o display for "none", ignoramos.
    const todosPreenchidos = inputsDaPalavra.every(inp => {
        if (window.getComputedStyle(inp).display === "none") {
            return true;
        }
        return inp.value.trim() !== "";
    });

    if (todosPreenchidos) {
        setTimeout(() => {
            document.getElementById("mensagem-game-over-acerto").style.display = "block";
            document.getElementById("sair").classList.add("flash-effect-tip");
            document.getElementById("dicas").style.display = "none";
            document.getElementById("palavra-secreta").style.display = "none";
            document.getElementById("teclado").style.display = "none";
        }, 2500);
    }
}
function acionaBotaoDica() {
    console.log("Botão dica acionado!");
}
sortearNome(listaDePersonagens); //Sorteia um nome da lista
configurarInputsBox();   //atribui as letras aos inputs correspondentes.
configurarTeclado();    //Ajusta os botões do teclado para chamar a função verificaLetra quando clicados.
digitarPalavraCerta(); //Configura os inputs da palavra secreta para serem editáveis