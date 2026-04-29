import { useState, useEffect } from 'react'

/**
 * Hook personnalisé pour charger les offres
 * En SSG (build-time), les offres sont pré-générées dans public/data/offres.json
 * En développement, elles sont chargées depuis Supabase en temps réel
 */
export function useOffres() {
  const [offres, setOffres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchOffres() {
      try {
        const isDev = import.meta.env.DEV
        
        if (isDev) {
          // Mode développement : charger depuis Supabase (Table: offre)
          const { supabase } = await import('../supabase.js')
          const { data, error: supabaseError } = await supabase
            .from('offre')
            .select('*')
            .eq('Afficher_sur_le_site', true)
            .order('Placement_Offre', { ascending: false })
            .order('Date_Creation', { ascending: false })
          
          if (supabaseError) throw supabaseError
          
          // Mapper les colonnes français vers les noms exacts attendus par le code React
          const mappedData = (data || []).map(o => ({
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
            Disponible_actuellement: o.Disponible_actuellement
          }))
          
          setOffres(mappedData)
        } else {
          // Mode production (SSG) : charger depuis le fichier JSON pré-généré
          const response = await fetch('/data/offres.json')
          if (!response.ok) throw new Error('Erreur lors du chargement des offres')
          const data = await response.json()
          setOffres(data || [])
        }
      } catch (err) {
        console.error('Erreur lors du chargement des offres:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOffres()
  }, [])

  return { offres, loading, error }
}
