/**
 * Script de génération statique des offres au moment du build
 * Ce script interroge Supabase (table: offre) et génère un fichier JSON avec les offres actives
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://lhvdvfmtjpeyumbybavo.supabase.co'
const supabaseKey = 'sb_publishable_Nc-2z8SR84QV-_lPUqph3g_OTp9AiUh'

async function generateOffres() {
  console.log('🔄 Génération des offres statiques depuis la table "offre"...')
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Récupérer uniquement les offres actives, triées par placement (desc) puis par date (desc)
    const { data, error } = await supabase
      .from('offre')
      .select('*')
      .eq('Afficher_sur_le_site', true)
      .order('Placement_Offre', { ascending: false })
      .order('Date_Creation', { ascending: false })
    
    if (error) {
      throw new Error(`Erreur Supabase: ${error.message}`)
    }
    
    // Mapper les noms de colonnes français vers les noms attendus par le code React pour éviter de tout casser
    const mappedData = data.map(o => ({
      id: o.ID_Technique,
      nom: o.Nom_Offre,
      categorie: o.Categorie,
      emoji: o.Emoji,
      couleur: o.Couleur_Design,
      bonus: o.Prime_Totale,
      bonusFilleul: o.Prime_Filleul,
      bonusParrain: o.Prime_Parrain,
      description: o.Description,
      conditions: o.Conditions_Detaillees,
      type: o.Type_Lien_ou_Code,
      contact: o.Contact_Instagram,
      code: o.Code_Parrainage,
      lien: o.Lien_Parrainage,
      note: o.Note_Interne,
      shareText: o.Texte_Partage,
      shareUrl: o.URL_Partage,
      offresdumoment: o.Offre_du_moment,
      boostLabel: o.Label_Boost,
      dateFin: o.Date_Expiration,
      disponible: o.Disponible_actuellement
    }))
    
    // Créer le dossier public/data s'il n'existe pas
    const dataDir = path.join(process.cwd(), 'public', 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Écrire les données dans un fichier JSON
    const outputPath = path.join(dataDir, 'offres.json')
    fs.writeFileSync(outputPath, JSON.stringify(mappedData, null, 2), 'utf-8')
    
    console.log(`✅ ${mappedData.length} offres générées avec succès dans ${outputPath}`)
    
    return mappedData
  } catch (err) {
    console.error('❌ Erreur lors de la génération des offres:', err.message)
    process.exit(1)
  }
}

// Exécuter le script
generateOffres()
