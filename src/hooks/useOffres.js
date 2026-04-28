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
        // En production (SSG), charger depuis le fichier JSON pré-généré
        // En développement, charger depuis Supabase
        const isDev = import.meta.env.DEV
        
        if (isDev) {
          // Mode développement : charger depuis Supabase
          const { supabase } = await import('../supabase.js')
          const { data, error: supabaseError } = await supabase
            .from('offres')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
          
          if (supabaseError) throw supabaseError
          setOffres(data || [])
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
