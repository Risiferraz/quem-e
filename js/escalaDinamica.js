// Função para dimensionamento proporcional de toda a área de jogo
// Essa função é uma IIFE auto-contida — não depende de nenhuma variável ou função definida
// em outro lugar (ou arquivo).
// Ela usa apenas APIs nativas do DOM (getElementById, window.addEventListener).
(function escalaDinamicaPagina() {
  const MAX_VISUAL_WIDTH = 800;
  const MOBILE_BREAKPOINT = 414;
  const STAGE_SELECTOR = '.stage';
  const CONTAINER_ID = 'container';
  let frameDeEscala = null;

  function limpaTransformacao(elemento) {
    elemento.style.transform = '';
    elemento.style.transformOrigin = '';
  }

  function aplicaEscala(elemento, larguraDisponivel, alturaDisponivel) {
    limpaTransformacao(elemento);

    const larguraBase = elemento.offsetWidth;
    const alturaBase = elemento.offsetHeight;

    if (!larguraBase || !alturaBase) {
      return;
    }

    const larguraLimite = Math.min(larguraDisponivel, MAX_VISUAL_WIDTH);
    const escala = Math.min(larguraLimite / larguraBase, alturaDisponivel / alturaBase);

    if (!Number.isFinite(escala) || escala >= 1) {
      return;
    }

    const larguraEscalada = larguraBase * escala;
    const deslocamentoX = Math.max(0, (larguraDisponivel - larguraEscalada) / 2);

    elemento.style.transformOrigin = 'top left';
    elemento.style.transform = `translate(${deslocamentoX}px, 0) scale(${escala})`;
  }

  function scaleStage() {
    const stageWrapper = document.querySelector(STAGE_SELECTOR);
    const container = document.getElementById(CONTAINER_ID);

    if (!stageWrapper || !container) {
      return;
    }

    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      limpaTransformacao(container);
      return;
    }

    const larguraDisponivel = stageWrapper.clientWidth;
    const alturaDisponivel = stageWrapper.clientHeight;
    aplicaEscala(container, larguraDisponivel, alturaDisponivel);
  }

  function agendaEscala() {
    if (frameDeEscala !== null) {
      cancelAnimationFrame(frameDeEscala);
    }

    frameDeEscala = window.requestAnimationFrame(() => {
      frameDeEscala = null;
      scaleStage();
    });
  }

  window.atualizarEscalaDinamica = agendaEscala;

  window.addEventListener('resize', agendaEscala);
  window.addEventListener('DOMContentLoaded', agendaEscala);
  window.addEventListener('load', agendaEscala);
  window.addEventListener('escala-dinamica:atualizar', agendaEscala);

  const observadorDeTela = new MutationObserver(() => {
    agendaEscala();
  });

  window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById(CONTAINER_ID);

    if (!container) {
      return;
    }

    observadorDeTela.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  });
})();