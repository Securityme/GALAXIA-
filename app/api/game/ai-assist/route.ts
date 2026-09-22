import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { Type } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { task, eraId, currentConfig } = body;

    try {
      const ai = getGeminiClient();
      const prompt = `Tu es l'IA Tactique d'État-Major de l'Union Galactique pour le jeu 4X GALAXIA.
Tâche demandée: ${task}
Contexte d'Époque choisie: ${eraId || 'post_cataclysm'}
Données actuelles: ${JSON.stringify(currentConfig || {})}

Génère une proposition stratégique d'optimisation d'amorce T_0 (Traits psychologiques du LEADER, ajustements du Vaisseau-Monde ASTRA, recommandations pour le Conseil à 6 pôles, et coordonnées d'implantation dans le Secteur Zéro).`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: "Tu es un stratège amiral militaire Dark Sci-Fi. Réponds en JSON structuré.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              recommendedUnionName: { type: Type.STRING },
              recommendedLoreNotes: { type: Type.STRING },
              leaderAdvice: { type: Type.STRING },
              astraOptimizations: {
                type: Type.OBJECT,
                properties: {
                  hullRecommendation: { type: Type.STRING },
                  reactorFocus: { type: Type.STRING },
                  tacticalRole: { type: Type.STRING }
                }
              },
              recommendedSector: { type: Type.STRING }
            },
            required: ["summary", "recommendedUnionName", "recommendedLoreNotes", "leaderAdvice"]
          }
        }
      });

      if (response.text) {
        return NextResponse.json({
          analysis: JSON.parse(response.text.trim()),
          source: 'gemini-3.8-flash'
        });
      }
    } catch (err) {
      console.warn("Gemini assist error, returning procedural advice:", err);
    }

    // Procedural fallback advice
    return NextResponse.json({
      analysis: {
        summary: "Analyse tactique automatisée du Directoire de l'ASTRA. Configuration recommandée selon les doctrines stellaires d'urgence.",
        recommendedUnionName: eraId === 'phoenix_awakening' ? "Fédération du Phénix Astral" : "Union Souveraine de Kepler",
        recommendedLoreNotes: "Dernière flotte rescapée du grand basculement gravitationnel, en quête de sanctuaires habitables dans le Secteur Zéro.",
        leaderAdvice: "Privilégiez les traits 'Stratège Implacable' et 'Visionnaire Stellaire' pour amortir les chocs énergétiques des premiers tours.",
        astraOptimizations: {
          hullRecommendation: "Coque standard renforcée à 1200 unités",
          reactorFocus: "Sur-régulation des bobines magnétiques pour alimenter les bio-dômes",
          tacticalRole: "Plateforme défensive et laboratoire itinérant"
        },
        recommendedSector: "Secteur Zéro - Quadrant Boréal (densité d'astéroïdes riche en métaux lourds)"
      },
      source: 'tactical-heuristics'
    });
  } catch (error) {
    console.error("AI assist error:", error);
    return NextResponse.json({ error: "Failed AI assistance" }, { status: 500 });
  }
}
