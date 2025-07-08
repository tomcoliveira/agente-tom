export const tomCurriculo = {
  pdf_url: "https://drive.google.com/file/d/1QgcxWDfX-PpcTRNuJWa3EfaDyeLXFXrC/view?usp=sharing",
  
  mensagens_envio: {
    solicitar: "Para receber meu currículo completo, preciso de algumas informações suas.",
    whatsapp: "Vou abrir o WhatsApp para você enviar uma solicitação ao Tom!",
    download: "Você pode baixar o PDF do currículo completo.",
    confirmacao: "Perfeito! O WhatsApp vai abrir para você enviar a mensagem."
  },
  
  template_mensagem: (nome: string, empresa: string, telefone?: string) => {
    return `Oi Tom! Sou ${nome} da ${empresa}. Vi seu assistente IA e gostaria de receber seu currículo completo. ${telefone ? `Meu contato: ${telefone}` : ''}`;
  }
};

export const detectarPedidoCurriculo = (mensagem: string): boolean => {
  const palavrasChave = [
    "currículo", "curriculo", "cv", "resume", 
    "enviar currículo", "manda o cv", "manda o currículo",
    "preciso do seu currículo", "me envia seu cv",
    "compartilha seu currículo", "seu curriculum"
  ];
  
  const mensagemLower = mensagem.toLowerCase();
  return palavrasChave.some(palavra => mensagemLower.includes(palavra));
};