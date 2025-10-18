// recuperar ao abrir
window.addEventListener("load", () => {
  const recuperado = localStorage.getItem("listaSalva");
  if (recuperado) {
    listaSalva = JSON.parse(recuperado);
  }
});

function sortearPersonagem() {
  if (listaDisponivel.length === 0) {
    listaDisponivel = [...listaDePersonagens];
  }

  const idx = Math.floor(Math.random() * listaDisponivel.length);
  personagemSecreto = listaDisponivel.splice(idx, 1)[0];

  // atualiza histórico e salva
  listaSalva.push(personagemSecreto);
  localStorage.setItem("listaSalva", JSON.stringify(listaSalva));

  console.log("Já listaSalva:", listaSalva);

  return personagemSecreto.toUpperCase();
}

// Funções utilitárias para salvar e carregar
function salvarSorteados(lista) {
  localStorage.setItem("listaSalva", JSON.stringify(lista));
}

function carregarSorteados() {
  const recuperado = localStorage.getItem("listaSalva");
  return recuperado ? JSON.parse(recuperado) : [];
}

