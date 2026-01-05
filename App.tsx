import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

// =============================================================================
// ⚠️ CONFIGURATION FIREBASE (CORRIGÉE AVEC TON LIEN EUROPE)
// =============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBawOErCFdDYLa3tP1oWqGO3OazsXLUD5U",
  authDomain: "jery-art-a1dfc.firebaseapp.com",
  // 👇 LE LIEN EXACT DE TON IMAGE (EUROPE)
  databaseURL: "https://jery-art-a1dfc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jery-art-a1dfc",
  storageBucket: "jery-art-a1dfc.firebasestorage.app",
  messagingSenderId: "85625110836",
  appId: "1:85625110836:web:feb757f11fa6eaf8c6e561",
  measurementId: "G-J3ZHPF1P5Z"
};

// Initialisation du Cerveau (Firebase)
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =============================================================================
// TYPES & INTERFACES
// =============================================================================
type Language = 'fr' | 'mg' | 'en' | 'ru';
type LocalizedText = { [key in Language]?: string };

interface Sculpture {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  createdAt: string;
}

interface BlogPost {
  id: string;
  title: LocalizedText;
  content: LocalizedText;
  imageUrl: string;
  date: string;
}

interface SiteContent {
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  heroImageUrl: string;
  aboutText: LocalizedText;
  commission: { title: LocalizedText; desc: LocalizedText };
  contactInfo: { whatsapp: string; facebook: string; email: string };
}

// =============================================================================
// DONNÉES INITIALES (Au cas où la base est vide)
// =============================================================================
const EUR_TO_MGA = 4800;

const INITIAL_CONTENT: SiteContent = {
  heroTitle: { fr: "L'Âme du Bois", mg: "Ny Fanahin'ny Hazo", en: "Soul of Wood", ru: "Душа Дерева" },
  heroSubtitle: { fr: "Sculptures Uniques à Madagascar", mg: "Sary Sokitra miavaka eto Madagasikara", en: "Unique Sculptures in Madagascar", ru: "Уникальные скульптуры на Мадагаскаре" },
  heroImageUrl: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1920",
  aboutText: { fr: "Bienvenue...", mg: "Tongasoa...", en: "Welcome...", ru: "Добро пожаловать..." },
  commission: { title: { fr: "Commandes" }, desc: { fr: "Contactez-moi" } },
  contactInfo: { whatsapp: "261340000000", facebook: "", email: "" }
};

const UI_TRANSLATIONS: Record<string, any> = {
  fr: { nav: { home: "Accueil", gallery: "Galerie", blog: "Journal" }, gallery: { title: "Collection", unavailable: "Vendu", order: "Commander" }, blog: { title: "Journal d'Atelier" } },
  mg: { nav: { home: "Fandraisana", gallery: "Tahiry", blog: "Vaovao" }, gallery: { title: "Tahiry", unavailable: "Lafo", order: "Hanafatra" }, blog: { title: "Drafitr'asa" } },
  en: { nav: { home: "Home", gallery: "Gallery", blog: "Journal" }, gallery: { title: "Collection", unavailable: "Sold Out", order: "Order" }, blog: { title: "Studio Journal" } },
  ru: { nav: { home: "Главная", gallery: "Галерея", blog: "Журнал" }, gallery: { title: "Коллекция", unavailable: "Продано", order: "Заказать" }, blog: { title: "Журнал студии" } }
};

// =============================================================================
// SERVICE DE BASE DE DONNÉES (Connexion Réelle)
// =============================================================================
const DataService = {
  // Lire les données depuis Internet (Firebase)
  getAllData: async () => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, '/'));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erreur lecture:", error);
      return null;
    }
  },
  
  // Sauvegarder sur Internet
  save: async (path: string, data: any) => {
    try {
      await set(ref(db, path), data);
      return true;
    } catch (e) {
      alert("Erreur de sauvegarde : " + e);
      return false;
    }
  },

  getAdminPassword: () => localStorage.getItem('jery_admin_pass') || 'admin123',
  saveAdminPassword: (pass: string) => localStorage.setItem('jery_admin_pass', pass),
};

const generateTranslations = async (text: string) => ({ fr: text, mg: text, en: text, ru: text });

// =============================================================================
// COMPOSANT INPUT OPTIMISÉ (Pour écrire vite sans bugs)
// =============================================================================
const LocalizedInput = ({ label, value, onChange, setIsLoading, isTextArea = false }: any) => {
  const handleTranslate = async () => {
    if (!value.fr) return;
    setIsLoading(true);
    try {
      const translated = await generateTranslations(value.fr);
      onChange(translated);
    } catch (e) { alert("Erreur IA"); } finally { setIsLoading(false); }
  };

  return (
    <div className="mb-6 p-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-stone-50 dark:bg-stone-900/50">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] uppercase tracking-widest font-bold text-gold-600">{label}</label>
        <button type="button" onClick={handleTranslate} className="text-[10px] bg-gold-600 text-white px-3 py-1 rounded hover:bg-gold-700">TRADUIRE ✨</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['fr', 'mg', 'en', 'ru'] as const).map(l => (
          <div key={l}>
            <span className="text-[9px] uppercase font-mono text-stone-400">{l}</span>
            {isTextArea ? (
              <textarea className="w-full p-2 text-sm bg-white dark:bg-stone-800 border rounded dark:border-stone-700 outline-none focus:border-gold-600" value={value[l] || ''} onChange={e => onChange({...value, [l]: e.target.value})} rows={3} />
            ) : (
              <input type="text" className="w-full p-2 text-sm bg-white dark:bg-stone-800 border rounded dark:border-stone-700 outline-none focus:border-gold-600" value={value[l] || ''} onChange={e => onChange({...value, [l]: e.target.value})} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// APPLICATION PRINCIPALE
// =============================================================================
const App = () => {
  // --- States ---
  const [lang, setLang] = useState<any>('fr'); 
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<'home' | 'gallery' | 'blog' | 'admin'>('home');
  const [adminTab, setAdminTab] = useState<'general' | 'sculptures' | 'journal'>('general');
  const [isLoading, setIsLoading] = useState(true);
  
  const [passwordInput, setPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  
  // DONNÉES (Connectées à Firebase)
  const [sculptures, setSculptures] = useState<Sculpture[]>([]);
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  
  const [editingSculpture, setEditingSculpture] = useState<Sculpture | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['fr'];

  // --- Chargement initial depuis Firebase ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await DataService.getAllData();
      if (data) {
        if (data.content) setContent(data.content);
        if (data.sculptures) setSculptures(data.sculptures);
        if (data.blog) setBlogPosts(data.blog);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === DataService.getAdminPassword()) {
      setIsAdmin(true);
      setPasswordInput('');
    } else {
      alert("Mot de passe incorrect.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'jery_art'); 
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dnbd36uqz/image/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.secure_url) callback(data.secure_url);
    } catch (error) { alert("Erreur upload"); }
  };

  const handleChangePassword = () => {
    if (!newPassword || newPassword.length < 4) { alert("Trop court"); return; }
    DataService.saveAdminPassword(newPassword);
    alert("Mot de passe changé !");
    setNewPassword('');
  };

  const formatPriceDisplay = (priceInEuro: number) => {
    const mga = (priceInEuro * EUR_TO_MGA).toLocaleString('fr-MG');
    return `${mga} Ar (${priceInEuro} €)`;
  };

  // --- Rendu ---
  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-stone-900 text-stone-100' : 'bg-stone-50 text-stone-900'}`}>
      <nav className="sticky top-0 z-50 bg-stone-50/90 dark:bg-stone-900/90 backdrop-blur-md border-b dark:border-stone-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-serif tracking-[0.4em] font-bold cursor-pointer" onClick={() => setView('home')}>JERY</h1>
          <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-widest font-bold">
            <button onClick={() => setView('home')} className={view === 'home' ? 'text-gold-600 border-b-2 border-gold-600' : ''}>{t.nav.home}</button>
            <button onClick={() => setView('gallery')} className={view === 'gallery' ? 'text-gold-600 border-b-2 border-gold-600' : ''}>{t.nav.gallery}</button>
            <button onClick={() => setView('blog')} className={view === 'blog' ? 'text-gold-600 border-b-2 border-gold-600' : ''}>{t.nav.blog}</button>
            <button onClick={() => setView('admin')} className={view === 'admin' ? 'text-gold-600 border-b-2 border-gold-600' : ''}>ADMIN</button>
          </div>
          <div className="flex items-center gap-4">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent text-[10px] font-bold border rounded p-1">
              <option value="fr" className="dark:bg-stone-900">FR</option>
              <option value="mg" className="dark:bg-stone-900">MG</option>
              <option value="en" className="dark:bg-stone-900">EN</option>
              <option value="ru" className="dark:bg-stone-900">RU</option>
            </select>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full">{theme === 'light' ? '🌙' : '☀️'}</button>
            <button onClick={() => setView(view === 'admin' ? 'home' : 'admin')} className="md:hidden">⚙️</button>
          </div>
        </div>
      </nav>

      <main>
        {view === 'home' && (
          <>
            <header className="relative h-[85vh] flex items-center justify-center overflow-hidden">
              <img src={content.heroImageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40" />
              <div className="relative z-10 text-center px-4 max-w-5xl animate-fade-in-up">
                <h2 className="text-5xl md:text-8xl lg:text-9xl font-serif mb-8 leading-tight tracking-tight">{content.heroTitle[lang]}</h2>
                <p className="text-lg md:text-2xl font-light italic mb-12 text-stone-700 dark:text-stone-300 tracking-wide">{content.heroSubtitle[lang]}</p>
                <button onClick={() => setView('gallery')} className="px-12 py-5 bg-gold-600 text-white uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-gold-700 transition-all shadow-xl">Voir la Collection</button>
              </div>
            </header>
            <section className="py-32 px-6 max-w-4xl mx-auto text-center border-b dark:border-stone-800">
              <h3 className="text-[10px] uppercase tracking-[0.5em] text-gold-600 font-bold mb-10">L'HISTOIRE</h3>
              <p className="text-2xl md:text-4xl font-serif leading-relaxed italic text-stone-700 dark:text-stone-200">"{content.aboutText[lang]}"</p>
            </section>
            <section className="py-32 px-6 bg-stone-100 dark:bg-stone-850">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                   <div className="space-y-8 order-2 md:order-1">
                      <h3 className="text-4xl md:text-5xl font-serif">{content.commission.title[lang]}</h3>
                      <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed whitespace-pre-line">{content.commission.desc[lang]}</p>
                      <button onClick={() => window.open(`https://wa.me/${content.contactInfo.whatsapp}`, '_blank')} className="px-10 py-4 border-2 border-stone-800 dark:border-stone-200 font-bold uppercase tracking-widest text-[10px] hover:bg-stone-800 hover:text-white dark:hover:bg-stone-200 dark:hover:text-stone-900 transition-all">Demander un Devis</button>
                   </div>
                   <div className="order-1 md:order-2"><img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800" className="w-full h-[400px] object-cover rounded-lg shadow-2xl" /></div>
                </div>
            </section>
          </>
        )}

        {view === 'gallery' && (
          <div className="py-24 px-6 max-w-7xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-20 uppercase tracking-[0.4em]">{t.gallery.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {sculptures.map(s => (
                <div key={s.id} className="group">
                  <div className="relative overflow-hidden aspect-square mb-6 bg-stone-200 dark:bg-stone-800 rounded-lg">
                    <img src={s.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 cursor-pointer" onClick={() => setSelectedImg(s.imageUrl)} />
                    {!s.available && <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] px-3 py-1 font-bold">{t.gallery.unavailable}</div>}
                  </div>
                  <h4 className="text-xl font-serif mb-2">{s.title[lang]}</h4>
                  <div className="flex flex-col border-t border-stone-200 dark:border-stone-800 pt-4">
                    <span className="text-lg font-bold mb-2">{formatPriceDisplay(s.price)}</span>
                    <button onClick={() => window.open(`https://wa.me/${content.contactInfo.whatsapp}?text=Bonjour Jery, je suis intéressé par : ${s.title[lang]}`, '_blank')} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600 border-b border-gold-600 self-start hover:text-gold-500">{t.gallery.order}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'blog' && (
          <div className="py-24 px-6 max-w-5xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-serif text-center mb-16 uppercase tracking-[0.4em]">{t.blog.title}</h2>
            <div className="space-y-24">
              {blogPosts.map(p => (
                <article key={p.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center group">
                  <div className="overflow-hidden rounded-lg aspect-video md:aspect-square">
                    <img src={p.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="space-y-6">
                    <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">{new Date(p.date).toLocaleDateString()}</span>
                    <h3 className="text-3xl font-serif">{p.title[lang]}</h3>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-line font-light">{p.content[lang]}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {view === 'admin' && (
          !isAdmin ? (
            <div className="max-w-md mx-auto py-32 px-6">
              <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-2xl border dark:border-stone-700 text-center">
                <h2 className="text-3xl font-serif uppercase tracking-widest mb-10">ADMINISTRATION</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                  <input type="password" placeholder="MOT DE PASSE" className="w-full p-4 bg-stone-100 dark:bg-stone-900 border dark:border-stone-700 rounded-lg text-center font-bold tracking-[0.5em]" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
                  <button type="submit" className="w-full py-4 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 font-bold uppercase tracking-widest rounded-lg hover:bg-gold-600 hover:text-white transition-all">Connexion</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto py-12 px-6 animate-fade-in">
              <div className="flex justify-between items-center mb-10 border-b pb-4 dark:border-stone-800">
                <h2 className="text-2xl font-serif tracking-widest uppercase text-gold-600">PANEL ARTISTE</h2>
                <button onClick={() => setIsAdmin(false)} className="text-[10px] font-bold text-red-500 uppercase tracking-widest border border-red-500 px-4 py-1 rounded">Déconnexion</button>
              </div>

              <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
                {(['general', 'sculptures', 'journal'] as const).map(tab => (
                  <button key={tab} onClick={() => setAdminTab(tab)} className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest border rounded-full transition-all flex-shrink-0 ${adminTab === tab ? 'bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900' : 'border-stone-200 dark:border-stone-700'}`}>
                    {tab === 'general' ? 'Réglages' : tab === 'sculptures' ? 'Ma Galerie' : 'Mon Journal'}
                  </button>
                ))}
              </div>

              {adminTab === 'general' && (
                <div className="space-y-8 animate-fade-in pb-20">
                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border dark:border-stone-700">
                    <h3 className="font-serif text-lg mb-6 border-l-4 border-gold-600 pl-4">HÉROS & ACCUEIL</h3>
                    <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
                      <img src={content.heroImageUrl} className="w-48 h-32 object-cover rounded-lg shadow-md border" />
                      <div className="flex-1 w-full">
                          <button onClick={() => fileInputRef.current?.click()} className="w-full p-4 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg text-stone-400 font-bold text-xs uppercase hover:text-gold-600">Changer l'image d'accueil</button>
                          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={e => handleFileUpload(e, (url) => setContent({...content, heroImageUrl: url}))} />
                      </div>
                    </div>
                    <LocalizedInput setIsLoading={setIsLoading} label="Titre Principal" value={content.heroTitle} onChange={v => setContent({...content, heroTitle: v})} />
                    <LocalizedInput setIsLoading={setIsLoading} label="Sous-titre" value={content.heroSubtitle} onChange={v => setContent({...content, heroSubtitle: v})} />
                  </div>

                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border dark:border-stone-700">
                    <h3 className="font-serif text-lg mb-6 border-l-4 border-gold-600 pl-4">HISTOIRE & À PROPOS</h3>
                    <LocalizedInput setIsLoading={setIsLoading} label="Texte Biographie" value={content.aboutText} onChange={v => setContent({...content, aboutText: v})} isTextArea />
                  </div>

                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border dark:border-stone-700">
                    <h3 className="font-serif text-lg mb-6 border-l-4 border-gold-600 pl-4">CONTACTS</h3>
                    <input type="text" className="w-full p-3 bg-stone-50 dark:bg-stone-900 border rounded mb-4" value={content.contactInfo.whatsapp} onChange={e => setContent({...content, contactInfo: {...content.contactInfo, whatsapp: e.target.value}})} placeholder="Numéro WhatsApp" />
                  </div>

                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border dark:border-stone-700">
                    <h3 className="font-serif text-lg mb-6 border-l-4 border-gold-600 pl-4">SÉCURITÉ</h3>
                    <div className="max-w-xs">
                      <label className="text-[10px] font-bold uppercase mb-2 block">Nouveau Mot de Passe</label>
                      <div className="flex gap-2">
                        <input type="password" placeholder="Min. 4 caractères" className="flex-1 p-3 bg-stone-50 dark:bg-stone-900 border rounded" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <button onClick={handleChangePassword} className="bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 px-4 py-2 rounded font-bold text-[10px] uppercase">Modifier</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end sticky bottom-4 z-10">
                    <button onClick={async () => { 
                      const success = await DataService.save('content', content);
                      if(success) alert("✅ Site mis à jour pour tout le monde !");
                    }} className="bg-gold-600 text-white px-12 py-4 rounded-full font-bold uppercase text-xs tracking-widest shadow-2xl hover:bg-gold-700 transition-all">PUBLIER LES CHANGEMENTS</button>
                  </div>
                </div>
              )}

              {adminTab === 'sculptures' && (
                <div className="space-y-6 animate-fade-in pb-20">
                  <button onClick={() => setEditingSculpture({ id: '', title: {fr:'',mg:'',en:'',ru:''}, description: {fr:'',mg:'',en:'',ru:''}, price: 0, category: 'Wood', imageUrl: '', available: true, createdAt: new Date().toISOString() })} className="w-full p-10 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl text-stone-400 hover:text-gold-600 transition-all font-bold uppercase tracking-widest">+ Ajouter une Sculpture</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sculptures.map(s => (
                      <div key={s.id} className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border dark:border-stone-700 overflow-hidden group">
                        <img src={s.imageUrl} className="w-full h-48 object-cover group-hover:opacity-90" />
                        <div className="p-4">
                          <p className="font-bold truncate text-lg">{s.title.fr}</p>
                          <div className="flex justify-between border-t pt-3 mt-3">
                            <button onClick={() => setEditingSculpture(s)} className="text-[10px] font-bold uppercase text-blue-500 hover:text-blue-600">Modifier</button>
                            <button onClick={async () => { 
                              if(confirm("Supprimer?")) { 
                                const l = sculptures.filter(x => x.id !== s.id); 
                                setSculptures(l); 
                                await DataService.save('sculptures', l);
                              }
                            }} className="text-[10px] font-bold uppercase text-red-500 hover:text-red-600">Supprimer</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {editingSculpture && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="bg-white dark:bg-stone-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl">
                        <h3 className="text-xl font-serif uppercase tracking-widest mb-6">Éditer Sculpture</h3>
                        <LocalizedInput setIsLoading={setIsLoading} label="Titre" value={editingSculpture.title} onChange={v => setEditingSculpture({...editingSculpture, title: v})} />
                        <input type="file" onChange={e => handleFileUpload(e, (url) => setEditingSculpture({...editingSculpture, imageUrl: url}))} className="mb-4 text-xs" />
                        {editingSculpture.imageUrl && <img src={editingSculpture.imageUrl} className="w-20 h-20 object-cover mb-4 rounded" />}
                        <div className="flex justify-end gap-4 mt-8">
                          <button onClick={() => setEditingSculpture(null)} className="px-6 py-2 text-xs font-bold uppercase">Annuler</button>
                          <button onClick={async () => {
                            const newList = editingSculpture.id ? sculptures.map(x => x.id === editingSculpture.id ? editingSculpture : x) : [...sculptures, {...editingSculpture, id: Date.now().toString()}];
                            setSculptures(newList);
                            await DataService.save('sculptures', newList);
                            setEditingSculpture(null);
                          }} className="bg-gold-600 text-white px-10 py-3 rounded-full font-bold uppercase text-xs">Sauvegarder</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {adminTab === 'journal' && (
                <div className="space-y-6 animate-fade-in pb-20">
                  <button onClick={() => setEditingPost({ id: '', title: {fr:'',mg:'',en:'',ru:''}, content: {fr:'',mg:'',en:'',ru:''}, imageUrl: '', date: new Date().toISOString() })} className="w-full p-10 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl text-stone-400 hover:text-gold-600 font-bold uppercase tracking-widest">+ Rédiger un Article</button>
                  <div className="grid grid-cols-1 gap-4">
                    {blogPosts.map(p => (
                      <div key={p.id} className="flex gap-4 p-4 bg-white dark:bg-stone-800 rounded-xl shadow-sm border dark:border-stone-700 items-center">
                        <img src={p.imageUrl} className="w-24 h-24 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-lg">{p.title.fr}</p>
                          <p className="text-[10px] text-stone-400 uppercase">{new Date(p.date).toLocaleDateString()}</p>
                          <div className="flex gap-4 mt-2">
                            <button onClick={() => setEditingPost(p)} className="text-[10px] font-bold uppercase text-blue-500">Modifier</button>
                            <button onClick={() => { if(confirm("Supprimer?")) { const l = blogPosts.filter(x => x.id !== p.id); setBlogPosts(l); saveToStorage('jery_local_blog', l); }}} className="text-[10px] font-bold uppercase text-red-500">Supprimer</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {editingPost && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="bg-white dark:bg-stone-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6 border-b pb-2">
                          <h3 className="text-xl font-serif uppercase tracking-widest">Journal d'atelier</h3>
                          <button onClick={() => setEditingPost(null)} className="text-xl">×</button>
                        </div>
                        <div className="mb-6">
                          <label className="text-[10px] font-bold uppercase block mb-2">Photo de l'article</label>
                          <input type="file" accept="image/*" onChange={e => handleFileUpload(e, (url) => setEditingPost({...editingPost, imageUrl: url}))} />
                        </div>
                        <LocalizedInput setIsLoading={setIsLoading} label="Titre de l'article" value={editingPost.title} onChange={v => setEditingPost({...editingPost, title: v})} />
                        <LocalizedInput setIsLoading={setIsLoading} label="Contenu du texte" value={editingPost.content} onChange={v => setEditingPost({...editingPost, content: v})} isTextArea />
                        <div className="flex justify-end gap-4 mt-8">
                          <button onClick={() => setEditingPost(null)} className="px-6 py-2 text-xs font-bold uppercase">Annuler</button>
                          <button onClick={() => {
                            const newList = editingPost.id ? blogPosts.map(x => x.id === editingPost.id ? editingPost : x) : [...blogPosts, {...editingPost, id: Date.now().toString()}];
                            setBlogPosts(newList);
                            saveToStorage('jery_local_blog', newList);
                            setEditingPost(null);
                          }} className="bg-gold-600 text-white px-10 py-3 rounded-full font-bold uppercase text-xs">Publier l'article</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </main>

      {selectedImg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative">
            <img src={selectedImg} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
            <button onClick={() => setSelectedImg(null)} className="absolute top-4 right-4 text-white text-4xl">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
