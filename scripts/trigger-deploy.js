#!/usr/bin/env node

/**
 * Script pour déclencher un redéploiement sur Vercel
 * Utile pour regénérer les offres après une modification dans Supabase
 * 
 * Usage: node scripts/trigger-deploy.js
 * 
 * Prérequis:
 * - Variable d'environnement VERCEL_DEPLOY_HOOK_URL configurée
 */

const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL

if (!hookUrl) {
  console.error('❌ Erreur: VERCEL_DEPLOY_HOOK_URL non configurée')
  console.error('   Configurez cette variable dans Vercel → Settings → Environment Variables')
  process.exit(1)
}

console.log('🚀 Déclenchement du redéploiement Vercel...')
console.log(`📍 URL du hook: ${hookUrl.substring(0, 50)}...`)

fetch(hookUrl, { method: 'POST' })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  })
  .then(data => {
    console.log('✅ Redéploiement déclenché avec succès!')
    console.log('📊 Détails:', data)
    console.log('⏱️  Le site sera à jour dans 1-2 minutes...')
  })
  .catch(error => {
    console.error('❌ Erreur lors du déploiement:', error.message)
    process.exit(1)
  })
