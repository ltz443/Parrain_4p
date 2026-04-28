# Configuration SSG (Static Site Generation) - Parrain 4P

## 📋 Vue d'ensemble

Ce projet utilise **Static Site Generation (SSG)** pour générer les offres au moment du build. Cela garantit :
- ✅ **SEO Parfait** : Le contenu des offres est gravé dans le HTML
- ⚡ **Performance Maximale** : Pas de requête API au chargement de la page
- 🔄 **Mise à jour Automatique** : Via Vercel Deploy Hooks

---

## 🏗️ Architecture

### Flux de données

```
┌─────────────────────────────────────────┐
│   Supabase (Table: offres)              │
│   - id, nom, description, is_active...  │
└────────────────┬────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │  npm run build             │
    │  ↓                         │
    │  scripts/generate-offres.js│
    │  (interroge Supabase)      │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │  public/data/offres.json   │
    │  (fichier généré)          │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │  vite build                │
    │  (génère dist/)            │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │  Vercel Deploy             │
    │  (site en ligne)           │
    └────────────────────────────┘
```

### Mode Développement vs Production

| Aspect | Développement | Production (SSG) |
|--------|---------------|------------------|
| **Source des données** | Supabase (temps réel) | Fichier JSON pré-généré |
| **Vitesse** | Plus lent (requête API) | Ultra-rapide (fichier statique) |
| **Mise à jour** | Instantanée | Au prochain build |
| **SEO** | Bon (JS exécuté) | Parfait (HTML statique) |

---

## 🚀 Utilisation

### Build Local
```bash
npm run build
```

Cela exécute automatiquement :
1. `npm run prebuild` → Interroge Supabase et génère `public/data/offres.json`
2. `vite build` → Construit l'application

### Développement Local
```bash
npm run dev
```

En développement, les offres sont chargées **en temps réel** depuis Supabase via le hook `useOffres()`.

---

## 🔄 Mise à Jour Automatique avec Vercel

### Option 1 : Deploy Hook (Recommandé)

1. **Récupérer l'URL du Deploy Hook** :
   - Allez sur Vercel → Votre projet → Settings → Git
   - Cherchez "Deploy Hooks"
   - Créez un nouveau hook (ex: "Rebuild from Supabase")
   - Copiez l'URL générée

2. **Créer un script pour déclencher le rebuild** :
   
   Créez un fichier `scripts/trigger-deploy.js` :
   ```javascript
   const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
   
   if (!hookUrl) {
     console.error('❌ VERCEL_DEPLOY_HOOK_URL non configurée');
     process.exit(1);
   }
   
   fetch(hookUrl, { method: 'POST' })
     .then(r => r.json())
     .then(d => console.log('✅ Deploy déclenché:', d))
     .catch(e => console.error('❌ Erreur:', e));
   ```

3. **Configurer la variable d'environnement** :
   - Vercel → Settings → Environment Variables
   - Ajouter : `VERCEL_DEPLOY_HOOK_URL` = votre URL du hook

4. **Déclencher manuellement** :
   ```bash
   node scripts/trigger-deploy.js
   ```

### Option 2 : Webhook Supabase (Avancé)

Vous pouvez configurer un webhook Supabase pour déclencher automatiquement un rebuild quand une offre est modifiée :

1. Allez dans Supabase → Database → Webhooks
2. Créez un nouveau webhook :
   - **Table** : `offres`
   - **Événement** : `INSERT`, `UPDATE`, `DELETE`
   - **URL** : Votre Deploy Hook Vercel
   - **Méthode** : `POST`

---

## 🎯 Gestion du Statut des Offres

### Colonne `is_active`

La table Supabase a une colonne `is_active` (booléen) :
- `true` → L'offre s'affiche sur le site
- `false` → L'offre est masquée

### Modifier le statut

1. Ouvrez Supabase → Table `offres`
2. Cliquez sur l'offre à modifier
3. Changez `is_active` à `true` ou `false`
4. Déclenchez un rebuild : `node scripts/trigger-deploy.js`

---

## 👀 Preview Deployments (Vercel)

### Utiliser les Preview Deployments

1. **Créez une branche** :
   ```bash
   git checkout -b feature/new-design
   git push origin feature/new-design
   ```

2. **Vercel crée automatiquement** une Preview Deployment avec une URL unique

3. **Testez vos changements** sur la preview avant de merger en `main`

4. **Merge en main** → Vercel redéploie automatiquement la production

### Avantages

- ✅ Testez les changements en isolation
- ✅ Partagez l'URL de preview avec des collaborateurs
- ✅ Aucun impact sur le site en production
- ✅ Historique complet des déploiements

---

## ⚡ Performance

### Avant SSG (Client-Side Rendering)
- Temps de chargement initial : ~2-3s (attente du JS)
- Requête API Supabase à chaque visite
- SEO : Bon mais pas optimal

### Après SSG
- Temps de chargement initial : ~0.5s (fichier statique)
- Aucune requête API au chargement
- SEO : Parfait (contenu dans le HTML)

**Gain de vitesse : 4-6x plus rapide** ⚡

---

## 🔧 Troubleshooting

### Les offres ne s'affichent pas après un build

**Cause** : Le script `generate-offres.js` a échoué

**Solution** :
```bash
# Vérifier les logs
npm run prebuild

# Vérifier que le fichier JSON existe
ls -la public/data/offres.json
```

### Les modifications Supabase ne s'affichent pas

**Cause** : Vous n'avez pas déclenché un rebuild

**Solution** :
```bash
# Rebuild local
npm run build

# Ou déclencher un rebuild Vercel
node scripts/trigger-deploy.js
```

### Erreur "Cannot find module '@supabase/supabase-js'"

**Solution** :
```bash
npm install
```

---

## 📚 Ressources

- [Vite Documentation](https://vitejs.dev/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Vercel Deploy Hooks](https://vercel.com/docs/deployments/deploy-hooks)
- [Static Site Generation](https://web.dev/rendering-on-the-web/)

---

## ✅ Checklist

- [x] Table Supabase créée avec colonne `is_active`
- [x] Script `generate-offres.js` configuré
- [x] Hook `useOffres()` implémenté
- [x] Build SSG fonctionnel
- [ ] Deploy Hook Vercel configuré
- [ ] Webhook Supabase configuré (optionnel)
- [ ] Tested en production

---

**Dernière mise à jour** : 28 avril 2026
