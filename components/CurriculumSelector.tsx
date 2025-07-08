import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Copy, MessageCircle } from "lucide-react";
import { tomCurriculo } from "@/app/lib/tom_curriculo";

interface CurriculumSelectorProps {
  curriculumAction: {
    should_send: boolean;
    method?: "whatsapp" | "copy" | "both";
  };
}

export const CurriculumSelector: React.FC<CurriculumSelectorProps> = ({ curriculumAction }) => {
  if (!curriculumAction.should_send) return null;

  const handleWhatsApp = () => {
    const phoneNumber = "5511987798779";
    const message = encodeURIComponent(tomCurriculo.formato_whatsapp);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tomCurriculo.formato_texto);
    alert("Currículo copiado! Cole onde precisar.");
  };

  return (
    <Card className="mt-4 bg-gray-50">
      <CardContent className="pt-4">
        <h3 className="font-semibold mb-2">Currículo do Tom Oliveira</h3>
        
        {(curriculumAction.method === "copy" || curriculumAction.method === "both") && (
          <div className="mb-4">
            <pre className="text-xs bg-white p-4 rounded border overflow-x-auto max-h-96">
              {tomCurriculo.formato_texto}
            </pre>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {(curriculumAction.method === "whatsapp" || curriculumAction.method === "both" || !curriculumAction.method) && (
          <Button
            size="sm"
            onClick={handleWhatsApp}
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Enviar por WhatsApp
          </Button>
        )}
        
        {(curriculumAction.method === "copy" || curriculumAction.method === "both" || !curriculumAction.method) && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copiar Texto
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};