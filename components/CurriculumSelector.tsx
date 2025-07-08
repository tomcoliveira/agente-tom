import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Copy, MessageCircle, FileDown } from "lucide-react";
import { tomCurriculo } from "@/app/lib/tom_curriculo";

interface CurriculumSelectorProps {
  curriculumAction: {
    should_send: boolean;
    method?: "whatsapp" | "copy" | "both";
  };
}

export const CurriculumSelector: React.FC<CurriculumSelectorProps> = ({ curriculumAction }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    telefone: ''
  });

  if (!curriculumAction.should_send) return null;

  const handleWhatsAppRequest = () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }

    // Validar dados
    if (!formData.nome || !formData.empresa) {
      alert("Por favor, preencha seu nome e empresa");
      return;
    }

    // Montar mensagem para o WhatsApp da PESSOA
    const phoneNumber = formData.telefone.replace(/\D/g, ''); // Remove não-números
    const message = encodeURIComponent(
      `Oi Tom! Sou ${formData.nome} da ${formData.empresa}. ` +
      `Vi seu assistente IA e gostaria de receber seu currículo completo. ` +
      `Meu contato: ${formData.telefone || 'informado no WhatsApp'}`
    );
    
    // Abre WhatsApp da PESSOA para ela enviar mensagem pro Tom
    const whatsappUrl = `https://wa.me/5511987798779?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpa o formulário
    setShowForm(false);
    setFormData({ nome: '', empresa: '', telefone: '' });
  };

  const handleDownload = () => {
    // Link para o PDF hospedado
    window.open('https://tom.entre.wtf/cv-tom-oliveira.pdf', '_blank');
  };

  return (
    <Card className="mt-4 bg-gray-50">
      <CardContent className="pt-4">
        <h3 className="font-semibold mb-2">Currículo do Tom Oliveira</h3>
        
        {showForm ? (
          <div className="space-y-3 mb-4">
            <p className="text-sm text-gray-600">
              Para receber o currículo completo, preciso de algumas informações:
            </p>
            <input
              type="text"
              placeholder="Seu nome *"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Sua empresa *"
              value={formData.empresa}
              onChange={(e) => setFormData({...formData, empresa: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              placeholder="Seu WhatsApp (opcional)"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500">
              * Ao clicar em enviar, o WhatsApp abrirá para você enviar uma mensagem ao Tom
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              O currículo completo do Tom está disponível em PDF. 
              Escolha como prefere receber:
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button
          size="sm"
          onClick={handleWhatsAppRequest}
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          {showForm ? 'Enviar Solicitação' : 'Solicitar por WhatsApp'}
        </Button>
        
        {!showForm && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Baixar PDF
          </Button>
        )}
        
        {showForm && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowForm(false)}
          >
            Cancelar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};