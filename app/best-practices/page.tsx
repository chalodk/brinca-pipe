"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"

export default function BestPracticesPage() {
  const bestPractices = [
    {
      stage: "Prospección",
      practices: [
        {
          title: "Investigación previa",
          description:
            "Investiga la empresa y el contacto antes de la primera comunicación. Revisa su sitio web, LinkedIn y noticias recientes.",
        },
        {
          title: "Personalización",
          description:
            "Personaliza tu acercamiento basado en la investigación. Menciona logros específicos o desafíos de la empresa.",
        },
        {
          title: "Valor desde el inicio",
          description: "Ofrece valor desde el primer contacto. Comparte un insight relevante o un recurso útil.",
        },
      ],
    },
    {
      stage: "Calificación",
      practices: [
        {
          title: "BANT",
          description:
            "Evalúa Budget (presupuesto), Authority (autoridad), Need (necesidad) y Timeline (tiempo) para calificar adecuadamente.",
        },
        {
          title: "Preguntas abiertas",
          description: "Utiliza preguntas abiertas para entender mejor las necesidades y desafíos del cliente.",
        },
        {
          title: "Escucha activa",
          description: "Practica la escucha activa. Toma notas y haz preguntas de seguimiento para profundizar.",
        },
      ],
    },
    {
      stage: "Presentación",
      practices: [
        {
          title: "Soluciones, no productos",
          description: "Enfócate en soluciones a problemas específicos, no en características de productos.",
        },
        {
          title: "Historias de éxito",
          description: "Comparte casos de éxito relevantes para el sector o problema del cliente.",
        },
        {
          title: "Involucra al cliente",
          description: "Haz que la presentación sea interactiva. Involucra al cliente con preguntas y confirmaciones.",
        },
      ],
    },
    {
      stage: "Propuesta",
      practices: [
        {
          title: "Personalización",
          description: "Personaliza cada propuesta. Evita plantillas genéricas.",
        },
        {
          title: "ROI claro",
          description: "Incluye un cálculo claro del retorno de inversión esperado.",
        },
        {
          title: "Opciones estratégicas",
          description: "Presenta 2-3 opciones para dar al cliente sensación de control y elección.",
        },
      ],
    },
    {
      stage: "Negociación",
      practices: [
        {
          title: "Valor vs. precio",
          description: "Enfócate en el valor entregado, no en justificar el precio.",
        },
        {
          title: "Concesiones estratégicas",
          description: "Prepara concesiones de antemano. Nunca hagas concesiones sin obtener algo a cambio.",
        },
        {
          title: "Silencio estratégico",
          description: "Usa el silencio como herramienta de negociación. No tengas miedo a las pausas.",
        },
      ],
    },
    {
      stage: "Cierre",
      practices: [
        {
          title: "Señales de compra",
          description: "Identifica señales de compra como preguntas sobre implementación o plazos.",
        },
        {
          title: "Próximos pasos claros",
          description: "Establece próximos pasos claros y fechas específicas.",
        },
        {
          title: "Manejo de objeciones",
          description: "Anticipa objeciones comunes y prepara respuestas efectivas.",
        },
      ],
    },
    {
      stage: "Seguimiento",
      practices: [
        {
          title: "Cadencia planificada",
          description: "Establece una cadencia de seguimiento planificada y consistente.",
        },
        {
          title: "Valor en cada contacto",
          description: "Aporta valor en cada seguimiento (artículo relevante, insight de industria).",
        },
        {
          title: "Múltiples canales",
          description: "Utiliza diferentes canales: email, llamada, LinkedIn, etc.",
        },
      ],
    },
  ]

  return (
    <ProtectedRoute>
      <div className="py-6">
        <Card>
          <CardHeader>
            <CardTitle>Buenas Prácticas</CardTitle>
            <CardDescription>Consulta las mejores prácticas para cada etapa del proceso comercial</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {bestPractices.map((stage, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="font-medium">{stage.stage}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {stage.practices.map((practice, practiceIndex) => (
                        <div key={practiceIndex} className="border-l-2 border-blue-500 pl-4">
                          <h4 className="font-medium">{practice.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{practice.description}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
