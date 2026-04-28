/**
 * Script de génération statique des offres au moment du build
 * Ce script interroge Supabase et génère un fichier JSON avec les offres actives
 * Ce fichier est ensuite utilisé par le composant React pour le rendu SSG
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://lhvdvfmtjpeyumbybavo.supabase.co'
const supabaseKey = 'sb_publishable_Nc-2z8SR84QV-_lPUqph3g_OTp9AiUh'

async function generateOffres() {
  console.log('🔄 Génération des offres statiques...')
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Récupérer uniquement les offres actives, triées par placement (desc) puis par date (desc)
    const { data, error } = await supabase
      .from('offres')
      .select('*')
      .eq('Afficher_sur_le_site', true)
      .order('Placement_Offre', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(`Erreur Supabase: ${error.message}`)
    }
    
    // Créer le dossier public/data s'il n'existe pas
    const dataDir = path.join(process.cwd(), 'public', 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Écrire les données dans un fichier JSON
    const outputPath = path.join(dataDir, 'offres.json')
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')
    
    console.log(`✅ ${data.length} offres générées avec succès dans ${outputPath}`)
    console.log(`📊 Offres actives: ${data.filter(o => o.is_active).length}`)
    
    return data
  } catch (err) {
    console.error('❌ Erreur lors de la génération des offres:', err.message)
    process.exit(1)
  }
}

// Exécuter le script
generateOffres()
