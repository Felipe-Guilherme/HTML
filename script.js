/* ==========================================================================
   LEITOR DE VOZ OTIMIZADO (VOZES NATURAIS E LIMPEZA DE TEXTO)
   ========================================================================== */
let melhorVozPT = null;

// Busca e seleciona a voz mais natural disponível no navegador do usuário
function carregarMelhorVoz() {
  const vozes = window.speechSynthesis.getVoices();
  
  // Prioriza vozes neurais/naturais em português (Google, Microsoft ou Apple)
  melhorVozPT = vozes.find(voz => 
    voz.lang.includes('pt') && (
      voz.name.includes('Natural') || 
      voz.name.includes('Google') || 
      voz.name.includes('Online') ||
      voz.name.includes('Luciana') ||
      voz.name.includes('Helena') ||
      voz.name.includes('Francisca')
    )
  ) || vozes.find(voz => voz.lang.startsWith('pt'));
}

// Garante o carregamento das vozes (alguns navegadores carregam de forma assíncrona)
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = carregarMelhorVoz;
  carregarMelhorVoz();
}

function readText(elementId) {
  if (!('speechSynthesis' in window)) {
    alert('Seu navegador não suporta leitura de voz.');
    return;
  }

  // Interrompe qualquer leitura anterior imediatamente
  window.speechSynthesis.cancel();

  const elemento = document.getElementById(elementId);
  if (!elemento) return;

  // Limpa o texto removendo botões e emojis que travam a fluidez da fala
  let textoLimpo = elemento.innerText
    .replace(/🔊 Ouvir esta seção/gi, '')
    .replace(/[🛡️💬📲📖🔗🚨✓📱✉️🎁✅❌⚠️]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const fala = new SpeechSynthesisUtterance(textoLimpo);

  // Aplica a voz otimizada se encontrada
  if (melhorVozPT) {
    fala.voice = melhorVozPT;
  }

  fala.lang = 'pt-BR';
  fala.rate = 0.95; // Velocidade suave (próxima à fala humana normal)
  fala.pitch = 1.0;  // Tom natural da voz

  window.speechSynthesis.speak(fala);
}