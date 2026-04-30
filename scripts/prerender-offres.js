import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

async function prerenderOffres() {
  console.log('🔄 Pré-rendu des pages d\'offres individuelles...');
  if (!supabaseUrl || !supabaseKey) {
    console.error('Les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définies.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: offres, error } = await supabase
    .from('offre')
    .select('*')
    .eq('Afficher_sur_le_site', true);

  if (error) {
    console.error(`Erreur Supabase: ${error.message}`);
    process.exit(1);
  }

  const templatePath = path.resolve(__dirname, '../index.html');
  let template = readFileSync(templatePath, 'utf-8');
  const outputDir = path.resolve(__dirname, '../dist/offre');
  mkdirSync(outputDir, { recursive: true });

  for (const offre of offres) {
    const offreId = offre.ID_Technique;
    const pagePath = path.join(outputDir, `${offreId}.html`);

    const mappedOffre = {
      nom: offre.Nom_Offre,
      emoji: offre.Emoji,
      description: offre.Description,
      conditions: offre.Conditions_Detaillees,
      bonus: offre.Prime_Totale,
      code: offre.Code_Parrainage,
      lien: offre.Lien_Parrainage
    };

    const injectedContent = `
      <div id="root">
        <div style="padding: 20px; max-width: 800px; margin: 0 auto; background-color: #0A0B0F; color: #E8EDF5;">
          <h1><LaTex>${mappedOffre.emoji} $</LaTex>{mappedOffre.nom}</h1>
          <p><LaTex>${mappedOffre.description}</p>
          $</LaTex>{mappedOffre.conditions ? `<p><strong>Conditions:</strong> <LaTex>${mappedOffre.conditions}</p>` : ''}
          $</LaTex>{mappedOffre.bonus ? `<p><strong>Bonus:</strong> <LaTex>${mappedOffre.bonus}</p>` : ''}
          $</LaTex>{mappedOffre.lien ? `<p><a href="<LaTex>${mappedOffre.lien}" target="_blank" style="color: #4FFFA0;">Profiter de l'offre</a></p>` : ''}
          <p><a href="/" style="color: #4FFFA0;">Retour à l'accueil</a></p>
        </div>
      </div>`;

    let pageContent = template
      .replace(/<title>.*<\/title>/, `<title>Parrain 4P - $</LaTex>{mappedOffre.nom}</title>`)
      .replace(/<meta name="description" content=".*?"\/>/, `<meta name="description" content="<LaTex>${mappedOffre.description}"/>`)
      .replace(/<div id="root"><\/div>/, injectedContent);

    writeFileSync(pagePath, pageContent);
    console.log(`✅ Page pré-rendue pour /offre/$</LaTex>{offreId}`);
  }
}
prerenderOffres();
