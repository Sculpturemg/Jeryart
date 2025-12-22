# Plans de Construction Strapi (Back-End)

Ce dossier contient les schémas de données (Content Types) pour configurer votre Back-End Strapi afin qu'il corresponde exactement à votre Front-End React.

## Comment les utiliser ?

1. **Installez Strapi** (si ce n'est pas déjà fait) :
   ```bash
   npx create-strapi-app@latest jery-backend --quickstart
   ```

2. **Copiez les fichiers JSON** :
   Une fois votre projet Strapi créé, vous trouverez un dossier `src/api`.
   
   Vous pouvez soit utiliser l'interface d'administration de Strapi ("Content-Type Builder") pour créer les modèles manuellement en suivant les structures ci-dessous, soit copier ces configurations si vous savez manipuler les schémas Strapi directement (avancé).
   
   Pour les débutants, voici ce qu'il faut créer dans l'admin panel de Strapi (http://localhost:1337/admin) pour que cela corresponde aux fichiers JSON ci-joints :

### 1. Collection Type: Sculpture (`sculpture`)
Créez une collection nommée "Sculpture" avec les champs :
*   `title` (Type: JSON) -> Pour stocker {fr, mg, en, ru}
*   `description` (Type: JSON) -> Pour stocker {fr, mg, en, ru}
*   `price` (Type: Number / Decimal)
*   `available` (Type: Boolean)
*   `category` (Type: Enumeration) -> Valeurs: Wood, Stone, Bronze, Other
*   `image` (Type: Media / Single Image)

### 2. Collection Type: Blog Post (`blog-post`)
Créez une collection nommée "Blog Post" avec les champs :
*   `title` (Type: JSON)
*   `content` (Type: JSON)
*   `date` (Type: Date or DateTime)
*   `image` (Type: Media / Single Image)

### 3. Collection Type: Testimonial (`testimonial`)
Créez une collection nommée "Testimonial" avec les champs :
*   `name` (Type: Text)
*   `role` (Type: Text)
*   `content` (Type: JSON)

### 4. Single Type: Site Content (`site-content`)
Créez un "Single Type" nommé "Site Content" pour les textes globaux :
*   `heroTitle` (Type: JSON)
*   `heroSubtitle` (Type: JSON)
*   `heroImage` (Type: Media)
*   `aboutText` (Type: JSON)
*   `commissionTitle` (Type: JSON)
*   `commissionDesc` (Type: JSON)
*   `whatsapp` (Type: Text)
*   `email` (Type: Email)
*   `facebook` (Type: Text)

---
*Note : Nous utilisons le type "JSON" pour les textes multilingues afin de conserver la structure simple de votre application React actuelle (`{fr: "...", mg: "..."}`). Strapi possède un plugin i18n natif, mais l'utiliser demanderait de modifier la logique de votre Front-End.*
