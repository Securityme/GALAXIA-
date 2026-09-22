import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { Type } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phase, turn, eraId, difficulty, resources, astra, council } = body;

    // Fallback procedural events if Gemini API is unavailable
    const proceduralFallbacks: Record<number, any[]> = {
      1: [
        {
          title: "Écho Tachyonique dans la Ceinture d'Astéroïdes",
          source: "Capteurs Longue Portée ASTRA",
          narrativeText: "Les senseurs supraluminiques détectent une signature énergétique résonante d'origine pré-cataclysmique. Le condensateur de l'ASTRA pulse au diapason.",
          choices: [
            {
              id: "c1",
              label: "Déployer une escadre de sondes de pointe",
              description: "Consomme de l'énergie pour cartographier et extraire les données stellaires.",
              category: "tactical",
              deltaResources: { energy: -35, credits: 60, minerals: 40 },
              councilImpact: { poleId: "scientific", loyaltyDelta: 8 },
              outcomeNarrative: "Les données de vol pré-cataclysmiques enrichissent nos archives cartographiques et révèlent un filon minéral."
            },
            {
              id: "c2",
              label: "Prioriser l'isolation des boucliers du vaisseau-monde",
              description: "Conserver l'énergie et renforcer l'intégrité défensive.",
              category: "defensive",
              deltaResources: { hull: 15, sectorSecurity: 10 },
              councilImpact: { poleId: "military", loyaltyDelta: 6 },
              outcomeNarrative: "Le blindage structurel de l'ASTRA absorbe les perturbations sans dommage."
            },
            {
              id: "c3",
              label: "Transmettre les coordonnées au réseau marchand",
              description: "Vendre l'information aux prospecteurs indépendants.",
              category: "economic",
              deltaResources: { credits: 110, morale: -5 },
              councilImpact: { poleId: "economic", loyaltyDelta: 10 },
              outcomeNarrative: "La transaction gonfle les coffres de l'Union, au détriment de l'enthousiasme populaire."
            }
          ]
        },
        {
          title: "Convoi de Réfugiés de l'Éther Profond",
          source: "Pôle Diplomatique & Civilisationnel",
          narrativeText: "Trois cargos civils délabrés émergent de l'hyperespace aux abords de l'ASTRA. Leurs réserves d'oxygène et de carburant sont critiques.",
          choices: [
            {
              id: "c1",
              label: "Ouvrir les sas de l'ASTRA et ravitailler les survivants",
              description: "Partage de nos rations alimentaires et modules de soutien vital.",
              category: "diplomatic",
              deltaResources: { food: -45, credits: -20, population: 350, morale: 15 },
              councilImpact: { poleId: "civilization", loyaltyDelta: 12 },
              outcomeNarrative: "La population célèbre cet élan d'humanité, injectant de nouvelles compétences techniques."
            },
            {
              id: "c2",
              label: "Orienter le convoi vers les dômes miniers de Nova Paris",
              description: "Affecter directement cette main-d'œuvre à l'effort extractif.",
              category: "economic",
              deltaResources: { minerals: 80, food: -20, credits: 40 },
              councilImpact: { poleId: "logistics", loyaltyDelta: 8 },
              outcomeNarrative: "Les usines planétaires tournent à plein régime avec ces nouveaux ouvriers résolus."
            }
          ]
        }
      ],
      2: [
        {
          title: "Arbitrage Énergétique du Noyau à Fusion ASTRA",
          source: "Directoire de l'Union & Conseil Exécutif",
          narrativeText: "Le rendement des réacteurs à plasma primaire de l'ASTRA nécessite une répartition stricte des flux pour le prochain cycle de simulation.",
          choices: [
            {
              id: "c1",
              label: "Suralimenter les bio-dômes et le confort des citoyens",
              description: "Booste le moral et la croissance démographique au détriment de la recherche.",
              category: "economic",
              deltaResources: { energy: -30, food: 60, morale: 12 },
              councilImpact: { poleId: "civilization", loyaltyDelta: 6 },
              outcomeNarrative: "La stabilité sociétale s'accroît et les rations abondent dans les quartiers civils."
            },
            {
              id: "c2",
              label: "Concentrer le plasma sur les condensateurs FTL et la propulsion",
              description: "Prépare l'ASTRA à des manœuvres tactiques d'évitement rapide.",
              category: "tactical",
              deltaResources: { energy: 40, sectorSecurity: 8, credits: -25 },
              councilImpact: { poleId: "military", loyaltyDelta: 8 },
              outcomeNarrative: "Les réacteurs de saut sont gonflés à bloc, prêts à toute éventualité."
            }
          ]
        }
      ],
      3: [
        {
          title: "Incursion de Frégates Corsaires dans le Secteur Zéro",
          source: "Flotte de Sécurité & Défense Planétaire",
          narrativeText: "Des bâtiments de guerre non identifiés arborant le pavillon des pillards du Vide s'approchent des couloirs de fret planétaires.",
          choices: [
            {
              id: "c1",
              label: "Déployer nos escadres de chasseurs lourds",
              description: "Engager l'ennemi au-delà de la ligne de défense principale.",
              category: "tactical",
              deltaResources: { sectorSecurity: 20, minerals: 50, hull: -10 },
              councilImpact: { poleId: "military", loyaltyDelta: 10 },
              outcomeNarrative: "Nos pilotes repoussent les assaillants avec brio et récupèrent des épaves riches en métaux."
            },
            {
              id: "c2",
              label: "Activer les boucliers planétaires et négocier un péage",
              description: "Payer un tribut pour éviter l'escalade militaire.",
              category: "diplomatic",
              deltaResources: { credits: -75, hull: 0, morale: -8 },
              councilImpact: { poleId: "diplomatic", loyaltyDelta: 5 },
              outcomeNarrative: "Les corsaires encaissent les crédits et se replient vers l'hyperespace."
            }
          ]
        }
      ]
    };

    // Try AI generation via Gemini 3.8 Flash
    try {
      const ai = getGeminiClient();
      const prompt = `Tu es le Maître de Jeu (MJ) procédural de GALAXIA, un jeu de stratégie 4X et de survie spatiale au ton Dark Sci-Fi tactique (cockpit amiral).
Contexte de simulation:
- Phase décisionnelle: Phase ${phase} (${phase === 1 ? 'Scénario Principal & Événements' : phase === 2 ? 'Gestion de l\'Union, ASTRA & Colonies' : 'Crises, Militaire & Diplomatie'})
- Tour actuel: ${turn}
- Époque Narrative: ${eraId}
- Difficulté: ${difficulty}
- Ressources: Crédits=${resources?.credits}, Énergie=${resources?.energy}, Nourriture=${resources?.food}, Minéraux=${resources?.minerals}, Moral=${resources?.morale}%, Sécurité=${resources?.sectorSecurity}%
- Vaisseau-Monde ASTRA: Coque=${astra?.hullCurrent}/${astra?.hullMax}, Boucliers=${astra?.structuralShields}%

Génère un événement d'alerte tactique immersif avec 2 ou 3 choix stratégiques.
Chaque choix doit comporter des deltas de ressources équilibrés et réalistes (positives ou négatives pour credits, energy, food, minerals, morale, hull, sectorSecurity), ainsi qu'un pôle du Conseil impacté (military, scientific, civilization, economic, diplomatic, logistics).`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: "Tu es un ordinateur de bord et Maître de Jeu Sci-Fi militaire et tactique. Réponds exclusivement en JSON valide.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              source: { type: Type.STRING },
              narrativeText: { type: Type.STRING },
              choices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING },
                    outcomeNarrative: { type: Type.STRING },
                    deltaResources: {
                      type: Type.OBJECT,
                      properties: {
                        credits: { type: Type.NUMBER },
                        energy: { type: Type.NUMBER },
                        food: { type: Type.NUMBER },
                        minerals: { type: Type.NUMBER },
                        morale: { type: Type.NUMBER },
                        hull: { type: Type.NUMBER },
                        sectorSecurity: { type: Type.NUMBER }
                      }
                    },
                    councilImpact: {
                      type: Type.OBJECT,
                      properties: {
                        poleId: { type: Type.STRING },
                        loyaltyDelta: { type: Type.NUMBER }
                      }
                    }
                  },
                  required: ["id", "label", "description", "outcomeNarrative", "deltaResources"]
                }
              }
            },
            required: ["title", "source", "narrativeText", "choices"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return NextResponse.json({
          event: {
            ...parsed,
            id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            phase
          },
          generatedBy: "gemini-3.8-flash"
        });
      }
    } catch (aiError) {
      console.warn("Gemini generation skipped or failed, using procedural deterministic engine:", aiError);
    }

    // Procedural deterministic selection
    const pool = proceduralFallbacks[phase] || proceduralFallbacks[1];
    const template = pool[Math.floor(Math.random() * pool.length)];
    return NextResponse.json({
      event: {
        ...template,
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        phase
      },
      generatedBy: "procedural-engine"
    });
  } catch (error) {
    console.error("Scenario generation error:", error);
    return NextResponse.json({ error: "Failed to generate scenario" }, { status: 500 });
  }
}
