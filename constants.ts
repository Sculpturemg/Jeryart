
import { Dictionary, Language, Sculpture, SiteContent, BlogPost, Testimonial } from './types';

export const ADMIN_PASSWORD_HASH = "jery2024"; 
export const EUR_TO_MGA = 4800; 

export const UI_TRANSLATIONS: Dictionary = {
  [Language.FR]: {
    nav: { home: "Accueil", gallery: "Galerie", blog: "Journal", about: "À Propos", contact: "Contact", admin: "Admin" },
    hero: { cta: "Voir la Collection" },
    commission: { cta: "Commander une œuvre" },
    gallery: { title: "Œuvres Récentes", filterAll: "Tout", details: "Détails", order: "Commander", unavailable: "Vendu", back: "Retour" },
    blog: { title: "Journal de l'Atelier", readMore: "Lire la suite", back: "Retour au journal" },
    testimonials: { title: "Ce que disent nos collectionneurs" },
    contact: { title: "Contactez l'Artiste", desc: "Pour toute commande personnalisée ou question sur une œuvre.", emailLabel: "Par Email", whatsappLabel: "Sur WhatsApp", facebookLabel: "Sur Facebook", sendEmail: "Envoyer un mail", sendWhatsapp: "Discuter", visitFacebook: "Voir le profil" },
    footer: { rights: "Tous droits réservés.", followUs: "Suivez Jery", quickLinks: "Liens Rapides", contactUs: "Nous Contacter" },
    admin: { 
      title: "Espace Jery", login: "Connexion", dashboard: "Tableau de Bord", tabSculptures: "Sculptures", tabBlog: "Blog", tabReviews: "Avis", tabSettings: "Paramètres", 
      addSculpture: "Ajouter une œuvre", addPost: "Nouvel Article", addReview: "Nouvel Avis", edit: "Modifier", generateAI: "Traduire (IA)", save: "Enregistrer", 
      cancel: "Annuler", delete: "Supprimer", password: "Mot de passe", logout: "Déconnexion", uploadImage: "Importer une photo", orPasteUrl: "Ou coller une URL",
      settingsHero: "Image d'Accueil", settingsContact: "Coordonnées", settingsAbout: "Texte À Propos", settingsCommission: "Texte Commande",
      settingsPassword: "Changer le mot de passe", newPasswordPlaceholder: "Nouveau mot de passe"
    }
  },
  [Language.MG]: {
    nav: { home: "Fandraisana", gallery: "Tahiry", blog: "Vaovao", about: "Mombamomba", contact: "Fifandraisana", admin: "Admin" },
    hero: { cta: "Hijery ireo Sary" },
    commission: { cta: "Hanafatra manokana" },
    gallery: { title: "Asa Tanana Vaovao", filterAll: "Rehetra", details: "Antsipiriany", order: "Hanafatra", unavailable: "Efa lafo", back: "Miverina" },
    blog: { title: "Vaovao avy ao amin'ny Atelier", readMore: "Hamaky tohiny", back: "Miverina" },
    testimonials: { title: "Hevitry ny mpanjifa" },
    contact: { title: "Ifandraiso amin'ny Mpanao Sary", desc: "Raha hanafatra manokana na hanontany.", emailLabel: "Email", whatsappLabel: "WhatsApp", facebookLabel: "Facebook", sendEmail: "Alefaso Email", sendWhatsapp: "Hiresaka", visitFacebook: "Hijery profil" },
    footer: { rights: "Zo rehetra voatokana.", followUs: "Araho i Jery", quickLinks: "Rohy Haingana", contactUs: "Fifandraisana" },
    admin: { 
      title: "Fitantanana", login: "Hiditra", dashboard: "Dashboard", tabSculptures: "Sary Sokitra", tabBlog: "Blaogy", tabReviews: "Hevitra", tabSettings: "Fanovana", 
      addSculpture: "Hampiditra", addPost: "Lahatsoratra", addReview: "Hevitra Vaovao", edit: "Hanova", generateAI: "Handika (IA)", save: "Hitahiry", 
      cancel: "Hanafoana", delete: "Hamafa", password: "Teny miafina", logout: "Hivoaka", uploadImage: "Hampiditra sary", orPasteUrl: "Na rohy sary",
      settingsHero: "Sary Fandraisana", settingsContact: "Fifandraisana", settingsAbout: "Soratra Mombamomba", settingsCommission: "Soratra Fanafarana",
      settingsPassword: "Hanova Teny miafina", newPasswordPlaceholder: "Teny miafina vaovao"
    }
  },
  [Language.EN]: {
    nav: { home: "Home", gallery: "Gallery", blog: "Journal", about: "About", contact: "Contact", admin: "Admin" },
    hero: { cta: "View Collection" },
    commission: { cta: "Request a Quote" },
    gallery: { title: "Recent Works", filterAll: "All", details: "Details", order: "Order Now", unavailable: "Sold Out", back: "Back" },
    blog: { title: "Studio Journal", readMore: "Read more", back: "Back to journal" },
    testimonials: { title: "Collector Reviews" },
    contact: { title: "Contact the Artist", desc: "For custom orders or inquiries about pieces.", emailLabel: "By Email", whatsappLabel: "On WhatsApp", facebookLabel: "On Facebook", sendEmail: "Send Email", sendWhatsapp: "Chat now", visitFacebook: "Visit Profile" },
    footer: { rights: "All rights reserved.", followUs: "Follow Jery", quickLinks: "Quick Links", contactUs: "Contact Us" },
    admin: { 
      title: "Jery's Admin", login: "Login", dashboard: "Dashboard", tabSculptures: "Sculptures", tabBlog: "Blog", tabReviews: "Reviews", tabSettings: "Settings", 
      addSculpture: "Add Sculpture", addPost: "New Post", addReview: "Add Review", edit: "Edit", generateAI: "AI Translate", save: "Save", 
      cancel: "Cancel", delete: "Delete", password: "Password", logout: "Logout", uploadImage: "Upload Photo", orPasteUrl: "Or paste URL",
      settingsHero: "Home Image", settingsContact: "Contact Info", settingsAbout: "About Text", settingsCommission: "Commission Text",
      settingsPassword: "Change Password", newPasswordPlaceholder: "New Password"
    }
  },
  [Language.RU]: {
    nav: { home: "Главная", gallery: "Галерея", blog: "Блог", about: "О нас", contact: "Контакты", admin: "Админ" },
    hero: { cta: "Смотреть коллекцию" },
    commission: { cta: "Заказать" },
    gallery: { title: "Последние работы", filterAll: "Все", details: "Детали", order: "Заказать", unavailable: "Продано", back: "Назад" },
    blog: { title: "Дневник мастерской", readMore: "Читать далее", back: "Назад" },
    testimonials: { title: "Отзывы" },
    contact: { title: "Связаться с художником", desc: "Для индивидуальных заказов или вопросов.", emailLabel: "Email", whatsappLabel: "WhatsApp", facebookLabel: "Facebook", sendEmail: "Отправить", sendWhatsapp: "Чат", visitFacebook: "Перейти" },
    footer: { rights: "Все права защищены.", followUs: "Следите за Jery", quickLinks: "Ссылки", contactUs: "Контакты" },
    admin: { 
      title: "Администрация", login: "Вход", dashboard: "Панель", tabSculptures: "Скульптуры", tabBlog: "Блог", tabReviews: "Отзывы", tabSettings: "Настройки", 
      addSculpture: "Добавить", addPost: "Новый пост", addReview: "Добавить отзыв", edit: "Изменить", generateAI: "AI Перевод", save: "Сохранить", 
      cancel: "Отмена", delete: "Удалить", password: "Пароль", logout: "Выйти", uploadImage: "Загрузить фото", orPasteUrl: "Или ссылка",
      settingsHero: "Главное фото", settingsContact: "Контакты", settingsAbout: "О нас", settingsCommission: "Текст заказа",
      settingsPassword: "Сменить пароль", newPasswordPlaceholder: "Новый пароль"
    }
  }
};

export const INITIAL_CONTENT: SiteContent = {
  heroTitle: {
    fr: "L'Âme du Bois & de la Pierre",
    mg: "Ny Fanahin'ny Hazo sy Vato",
    en: "The Soul of Wood & Stone",
    ru: "Душа Дерева и Камня"
  },
  heroSubtitle: {
    fr: "Sculptures contemporaines inspirées par la nature et la culture Malagasy.",
    mg: "Sary sokitra aingam-panahy avy amin'ny zavaboary sy ny kolontsaina Malagasy.",
    en: "Contemporary sculptures inspired by nature and Malagasy culture.",
    ru: "Современные скульптуры, вдохновленные природой и культурой Мадагаскара."
  },
  heroImageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=2000",
  aboutText: {
    fr: "Jery est un artiste passionné basé à Madagascar. Il transforme la matière brute en émotions tangibles, puisant son inspiration dans les traditions ancestrales et la beauté sauvage de l'île.",
    mg: "Mpanakanto tia karokaroka i Jery, monina eto Madagasikara. Mamadika ny akora ho fihetseham-po azo tsapain-tanana, ary maka aingam-panahy avy amin'ny fomban-drazana sy ny hakanton'ny nosy.",
    en: "Jery is a passionate artist based in Madagascar. He transforms raw matter into tangible emotions, drawing inspiration from ancestral traditions and the wild beauty of the island.",
    ru: "Джери — увлеченный художник, живущий на Мадагаскаре. Он превращает сырую материю в осязаемые эмоции, черпая вдохновение в традициях предков и дикой красоте острова."
  },
  commission: {
    title: {
      fr: "Créations Sur Mesure",
      mg: "Manafatra Sary Sokitra",
      en: "Custom Commissions",
      ru: "Индивидуальный Заказ"
    },
    desc: {
      fr: "Vous avez une vision ? Jery donne vie à vos idées dans le bois ou la pierre. Offrez-vous une pièce unique.",
      mg: "Manana hevitra manokana ve ianao? Jery dia manamboatra sary sokitra araka ny fanirianao.",
      en: "Have a vision? Bring it to life. Commission a unique sculpture in wood or stone.",
      ru: "У вас есть идея? Джери воплотит её в жизнь в дереве или камне."
    }
  },
  contactInfo: {
    whatsapp: "261340000000",
    email: "contact@jerysculpteur.com",
    facebook: "https://facebook.com"
  }
};

export const INITIAL_SCULPTURES: Sculpture[] = [
  {
    id: '1',
    title: { fr: "L'Envol", mg: "Ny Fisidinana", en: "The Flight", ru: "Полет" },
    description: {
      fr: "Une représentation abstraite d'un oiseau prenant son envol, sculptée dans du bois de rose.",
      mg: "Sary vorona hiara-manidina, vita amin'ny andramena.",
      en: "An abstract representation of a bird taking flight, carved in rosewood.",
      ru: "Абстрактное изображение птицы, взлетающей в небо, вырезанное из палисандра."
    },
    price: 450,
    category: 'Wood',
    imageUrl: 'https://picsum.photos/id/104/800/800',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: { fr: "Silence Éternel", mg: "Fahanginana Mandrakizay", en: "Eternal Silence", ru: "Вечная Тишина" },
    description: {
      fr: "Visage serein sculpté dans la pierre locale. Une invitation à la méditation.",
      mg: "Endrika tony vita amin'ny vato. Fanasana ho amin'ny fandinihan-tena.",
      en: "Serene face carved in local stone. an invitation to meditation.",
      ru: "Спокойное лицо, вырезанное из местного камня."
    },
    price: 800,
    category: 'Stone',
    imageUrl: 'https://picsum.photos/id/319/800/800',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: { fr: "Racines", mg: "Faka", en: "Roots", ru: "Корни" },
    description: {
      fr: "Intrication complexe symbolisant les ancêtres.",
      mg: "Fifampidiran'ny faka maneho ny razana.",
      en: "Complex entanglement symbolizing ancestors.",
      ru: "Сложное переплетение, символизирующее предков."
    },
    price: 1200,
    category: 'Wood',
    imageUrl: 'https://picsum.photos/id/535/800/800',
    available: false,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: {
      fr: "Objectifs du Site & Bienvenue",
      mg: "Tanjon'ny Tranonkala & Tongasoa",
      en: "Site Objectives & Welcome",
      ru: "Цели сайта и Добро пожаловать"
    },
    content: {
      fr: "Bienvenue sur mon site officiel.\n\nL'objectif de cette plateforme est de :\n- Montrer mon travail au monde entier.\n- Me faire connaître en tant qu'artiste sculpteur.\n- Permettre d'être contacté facilement pour des commandes personnalisées ou l'achat d'œuvres existantes.\n\nMerci de votre visite !",
      mg: "Tongasoa eto amin'ny tranonkalako ofisialy.\n\nNy tanjon'ity sehatra ity dia:\n- Hampisehoana ny asako amin'izao tontolo izao.\n- Hahafantarana ahy ho mpanakanto mpanao sary sokitra.\n- Hanamora ny fifandraisana raha misy te hanafatra manokana na hividy sary efa vita.\n\nMisaotra nitsidika !",
      en: "Welcome to my official website.\n\nThe goal of this platform is to:\n- Showcase my work to the world.\n- Make myself known as a sculptor artist.\n- Allow easy contact for custom orders or purchasing existing works.\n\nThank you for visiting!",
      ru: "Добро пожаловать на мой официальный сайт.\n\nЦель этой платформы:\n- Показать мою работу миру.\n- Заявить о себе как о скульпторе.\n- Обеспечить легкий контакт для индивидуальных заказов или покупки существующих работ.\n\nСпасибо за визит!"
    },
    imageUrl: "https://picsum.photos/id/20/800/400",
    date: new Date().toISOString()
  },
  {
    id: '2',
    title: {
      fr: "Comment Commander une Œuvre ?",
      mg: "Fomba Fanafarana Sary ?",
      en: "How to Order a Commission ?",
      ru: "Как заказать работу ?"
    },
    content: {
      fr: "Pour toute commande personnalisée, merci de m'envoyer les détails suivants via le formulaire de contact ou WhatsApp :\n\n- Emplacement prévu (Intérieur, Extérieur, Jardin, Salon...)\n- Dimensions approximatives (Hauteur, Largeur)\n- Matériau souhaité (Bois, Pierre, Granite, etc.)\n- Quantité désirée\n\nNous discuterons ensemble du devis et des délais.",
      mg: "Raha hanafatra manokana, azafady alefaso ireto antsipiriany ireto amin'ny hafatra na WhatsApp:\n\n- Toerana hametrahana azy (Ao an-trano, An-tokotany...)\n- Refy eo ho eo (Haavo, Sakany)\n- Akora ilaina (Hazo, Vato, Granite, sns.)\n- Isany ilaina\n\nHiresaka momba ny vidiny sy ny fotoana isika avy eo.",
      en: "For any custom order, please send me the following details via the contact form or WhatsApp:\n\n- Intended location (Interior, Exterior, Garden, Living room...)\n- Approximate dimensions (Height, Width)\n- Desired material (Wood, Stone, Granite, etc.)\n- Quantity desired\n\nWe will discuss the quote and timeline together.",
      ru: "Для любого индивидуального заказа, пожалуйста, отправьте мне следующие данные через форму контакта или WhatsApp:\n\n- Местоположение (Интерьер, Экстерьер, Сад, Гостиная...)\n- Приблизительные размеры (Высота, Ширина)\n- Желаемый материал (Дерево, Камень, Гранит и т.д.)\n- Желаемое количество\n\nМы обсудим смету и сроки вместе."
    },
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    date: new Date(Date.now() - 86400000).toISOString() // Yesterday
  },
  {
    id: '3',
    title: {
      fr: "Ma Vision & Inspiration",
      mg: "Ny Fijeriko & Aingam-panahy",
      en: "My Vision & Inspiration",
      ru: "Мое Видение и Вдохновение"
    },
    content: {
      fr: "Ce qui m'inspire avant tout, c'est la richesse de la culture malgache, la nature luxuriante qui nous entoure et nos traditions ancestrales.\n\nMa vision de la sculpture est simple : transmettre une émotion, raconter une histoire à travers la matière inerte. Chaque coup de ciseau est une parole donnée au bois ou à la pierre.",
      mg: "Ny tena manome aingam-panahy ahy dia ny haren'ny kolontsaina malagasy, ny zavaboary manodidina ary ny fomban-drazana.\n\nNy fijeriko ny sary sokitra dia tsotra: mampita fihetseham-po, mitantara tantara amin'ny alalan'ny akora. Ny kapoka rehetra dia teny omena ny hazo na ny vato.",
      en: "What inspires me above all is the richness of Malagasy culture, the lush nature surrounding us, and our ancestral traditions.\n\nMy vision of sculpture is simple: to transmit an emotion, to tell a story through inert matter. Every chisel stroke is a word given to wood or stone.",
      ru: "Что меня вдохновляет прежде всего, так это богатство малагасийской культуры, пышная природа, окружающая нас, и наши традиции предков.\n\nМое видение скульптуры простое: передать эмоцию, рассказать историю через инертную материю. Каждый удар резца — это слово, данное дереву или камню."
    },
    imageUrl: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800",
    date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    role: 'Collectionneuse / Collector',
    content: {
      fr: "Une pièce magnifique qui illumine mon salon. Le travail du bois est exceptionnel.",
      mg: "Asa tanana tena tsara tarehy. Tena mahay i Jery.",
      en: "A magnificent piece that lights up my living room. The woodwork is exceptional.",
      ru: "Великолепное произведение, которое освещает мою гостиную."
    }
  },
  {
    id: '2',
    name: 'Jean-Pierre',
    role: 'Architecte',
    content: {
      fr: "J'ai commandé une sculpture sur mesure pour un client, le résultat a dépassé nos attentes.",
      mg: "Nanafatra sary sokitra manokana aho, tena afa-po tanteraka.",
      en: "I commissioned a custom sculpture for a client, the result exceeded our expectations.",
      ru: "Я заказал скульптуру на заказ для клиента, результат превзошел наши ожидания."
    }
  }
];
