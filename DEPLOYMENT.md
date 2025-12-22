# Guide de déploiement rapide sur Netlify

Votre site est prêt. Voici comment le mettre en ligne en 2 minutes :

## Étape 1 : Préparation du dossier
Assurez-vous d'avoir tous ces fichiers dans un seul dossier sur votre ordinateur :
- `index.html`
- `index.tsx`
- `App.tsx`
- `constants.ts`
- `types.ts`
- `metadata.json`
- `netlify.toml` (Ajouté maintenant)
- Dossier `services/` (contenant `dataService.ts` et `geminiService.ts`)

## Étape 2 : Mise en ligne (Méthode simple)
1. Connectez-vous sur [Netlify](https://app.netlify.com/).
2. Allez dans l'onglet **"Sites"**.
3. En bas de la page, vous verrez une zone pointillée : **"Want to deploy a new site without connecting to Git? Drag and drop your site folder here"**.
4. Glissez votre dossier complet dans cette zone.
5. Votre site est en ligne ! Netlify vous donnera une adresse (ex: `jery-sculpture.netlify.app`).

## Étape 3 : Configuration de l'IA (Gemini)
Si vous voulez que le bouton "Traduire par IA" fonctionne dans l'Admin :
1. Dans Netlify, allez dans **Site Settings** > **Environment variables**.
2. Ajoutez une variable nommée `API_KEY`.
3. Mettez votre clé API Google Gemini comme valeur.

## Étape 4 : Gestion des images et données
- Le site utilise actuellement le "LocalStorage" : les photos que Jery ajoute sont stockées dans son propre navigateur.
- **Pour une version pro partagée** : Suivez les instructions `strapi_blueprints` pour connecter le site à une base de données réelle (Strapi).