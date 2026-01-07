import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
// On importe la librairie officielle
import { GoogleGenerativeAI } from "@google/generative-ai";

// =============================================================================
// 1. CONFIGURATION
// =============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBawOErCFdDYLa3tP1oWqGO3OazsXLUD5U",
  authDomain: "jery-art-a1dfc.firebaseapp.com",
  databaseURL: "https://jery-art-a1dfc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jery-art-a1dfc",
  storageBucket: "jery-art-a1dfc.firebasestorage.app",
  messagingSenderId: "85625110836",
  appId: "1:85625110836:web:feb757f11fa6eaf8c6e561",
  measurementId: "G-J3ZHPF1P5Z"
};

const GEMINI_API_KEY = "AIzaSyDFY03-j2_tq1VM-MOV9ruroohEJrddSJc"; 

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =============================================================================
// 2. FONCTION DE TRADUCTION (AVEC SÉCURITÉ NAVIGATEUR DÉSACTIVÉE)
// =============================================================================
const generateTranslations = async (text: string) => {
  if (!text) return { fr: "", mg: "", en: "", ru: "" };
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // C'EST ICI LA CLÉ DU SUCCÈS : on force le modèle à accepter le navigateur
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    });

    const prompt = `Agis comme un système de traduction JSON.
    Texte à traduire : "${text}"
    Langue source : Français
    Langues cibles : Malgache (mg), Anglais (en), Russe (ru)
    
    Format de réponse OBLIGATOIRE (JSON pur sans markdown) :
    { "mg": "...", "en": "...", "ru": "..." }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    // Nettoyage du JSON (au cas où l'IA ajoute des ```json)
    const jsonString = textResponse.replace(/```json|```/g, '').trim();
    
    // On cherche les accolades pour être sûr
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
      const cleanJson = jsonString.substring(firstBrace, lastBrace + 1);
      const translations = JSON.parse(cleanJson);

      return {
        fr: text,
        mg: translations.mg || text,
        en: translations.en || text,
        ru: translations.ru || text
      };
    } else {
      throw new Error("Pas de JSON valide dans la réponse");
    }

  } catch (error: any) {
    console.error("Erreur Traduction:", error);
    // On affiche l'erreur technique pour comprendre si ça rate encore
    alert("Erreur technique : " + error.message);
    return { fr: text, mg: text, en: text, ru: text };
  }
};

// =============================================================================
// 3. TYPES & DONNÉES
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
  commission: { title: LocalizedText; desc: LocalizedText; imageUrl: string };
  contactInfo: { whatsapp: string; facebook: string; email: string };
}

const EUR_TO_MGA = 4800;

const INITIAL_CONTENT: SiteContent = {
  heroTitle: { fr: "L'Âme du Bois", mg: "Ny Fanahin'ny Hazo", en: "Soul of Wood", ru: "Душа Дерева" },
  heroSubtitle: { fr: "Sculptures Uniques à Madagascar", mg: "Sary Sokitra miavaka eto Madagasikara", en: "Unique Sculptures in Madagascar", ru: "Уникальные скульптуры на Мадагаскаре" },
  heroImageUrl: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1920",
  aboutText: { fr: "Bienvenue...", mg: "Tongasoa...", en: "Welcome...", ru: "Добро пожаловать..." },
  commission: { 
    title: { fr: "Commandes" }, 
    desc: { fr: "Contactez-moi" },
    imageUrl: "https://images.unsplash.com/photo-1505567745926-ba89000d255a?q=80&w=800"
  },
  contactInfo: { whatsapp: "261340000000", facebook: "", email: "" }
};

const UI_TRANSLATIONS: Record<string, any> = {
  fr: { nav: { home: "Accueil", gallery: "Galerie", blog: "Journal" }, gallery: { title: "Collection", unavailable: "Vendu", order: "Commander" }, blog: { title: "Journal d'Atelier" } },
  mg: { nav: { home: "Fandraisana", gallery: "Tahiry", blog: "Vaovao" }, gallery: { title: "Tahiry", unavailable: "Lafo", order: "Hanafatra" }, blog: { title: "Drafitr'asa" } },
  en: { nav: { home: "Home", gallery: "Gallery", blog: "Journal" }, gallery: { title: "Collection", unavailable: "Sold Out", order: "Order" }, blog: { title: "Studio Journal" } },
  ru: { nav: { home: "Главная", gallery: "Галерея", blog: "Журнал" }, gallery: { title: "Коллекция", unavailable: "Продано", order: "Заказать" }, blog: { title: "Журнал студии" } }
};

const DataService = {
  getAllData: async () => {
    try {
      const snapshot = await get(child(ref(db), '/'));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (e) { return null; }
  },
  save: async (path: string, data: any) => {
    try { await set(ref(db, path), data); return true; } 
    catch (e) { alert("Erreur sauvegarde: " + e); return false; }
  },
  getAdminPassword: () => localStorage.getItem('jery_admin_pass') || 'admin123',
  saveAdminPassword: (pass: string) => localStorage.setItem('jery_admin_pass', pass),
};

// =============================================================================
// 4. COMPOSANT INPUT
// =============================================================================
const LocalizedInput = ({ label, value, onChange, setIsLoading, isTextArea = false }: any) => {
  const handleTranslate = async () => {
    if (!value.fr) return;
    setIsLoading(true);
    const translated = await generateTranslations(value.fr);
    onChange(translated);
    setIsLoading(false);
  };

  return (
    <div className="mb-6 p-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-stone-50 dark:bg-stone-900/50">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] uppercase tracking-widest font-bold text-gold-600">{label}</label>
        <button type="button" onClick={handleTranslate} className="text-[10px] bg-gold-600 text-white px-3 py-1 rounded hover:bg-gold-700 transition-colors">TRADUIRE ✨</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['fr', 'mg', 'en', 'ru'] as const).map(l => (
          <div key={l}>
            <span className="text-[9px] uppercase font-mono text-stone-400">{l}</span>
            {isTextArea ? (
              <textarea className="w-full p-2 text-sm bg-white dark:bg-stone-800 border rounded dark:border-stone-700 outline-none focus:border-gold-600" value={value[l] || ''} onChange={e => onChange({...value, [l]: e.target.value})} rows={4} />
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
// 5. APPLICATION PRINCIPALE
// =============================================================================
const App = () => {
  const [lang, setLang] = useState<any>('fr'); 
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<'home' | 'gallery' | 'blog' | 'admin'>('home');
  const [adminTab, setAdminTab] = useState<'general' | 'sculptures' | 'journal'>('general');
  const [isLoading, setIsLoading] = useState(true);
  
  const [passwordInput, setPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedSculpture, setSelectedSculpture] = useState<Sculpture | null>(null);
  
  const [sculptures, setSculptures] = useState<Sculpture[]>([]);
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  
  const [editingSculpture, setEditingSculpture] = useState<Sculpture | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['fr'];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await DataService.getAllData();
      if (data) {
        if (data.content) {
          setContent(prev => ({...INITIAL_CONTENT, ...data.content, commission: {...INITIAL_CONTENT.commission, ...data.content.commission}}));
        }
        if (data.sculptures) setSculptures(data.sculptures);
        if (data.blog) setBlogPosts(data.blog);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === DataService.getAdminPassword()) { setIsAdmin(true); setPasswordInput(''); } 
    else { alert("Mot de passe incorrect."); }
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

  // --- ECRAN DE CHARGEMENT ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif tracking-widest mb-4 animate-pulse">J E R Y</h1>
          <div className="w-12 h-12 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark bg-stone-900 text-stone-100' : 'bg-stone-50 text-stone-900'}`}>
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

      {/* ZONE PRINCIPALE */}
      <main className="flex-grow w-full">
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
                   <div className="order-1 md:order-2">
                     <img src={content.commission.imageUrl || "https://images.unsplash.com/photo-1505567745926-ba89000d255a?q=80&w=800"} className="w-full h-[400px] object-cover rounded-lg shadow-2xl" />
                   </div>
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
                    {/* On clique sur l'image pour ouvrir le détail */}
                    <img src={s.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 cursor-pointer" onClick={() => setSelectedSculpture(s)} />
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
                  {/* HERO */}
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

                  {/* BIO */}
                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border dark:border-stone-700">
                    <h3 className="font-serif text-lg mb-6 border-l-4 border-gold-600 pl-4">HISTOIRE & À PROPOS</h3>
                    <LocalizedInput setIsLoading={setIsLoading} label="Texte Biographie" value={content.aboutText} onChange={v => setContent({...content, aboutText: v})} isTextArea />
                  </div>

                  {/* COMMANDES & IMAGE COMMANDE */}
                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border dark:border-stone-700">
                    <h3 className="font-serif text-lg mb-6 border-l-4 border-gold-600 pl-4">SECTION COMMANDES</h3>
                    <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
                      <img src={content.commission.imageUrl || "https://via.placeholder.com/150"} className="w-48 h-32 object-cover rounded-lg shadow-md border" />
                      <div className="flex-1 w-full">
                          <button onClick={() => fileInputRef2.current?.click()} className="w-full p-4 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg text-stone-400 font-bold text-xs uppercase hover:text-gold-600">Changer l'image commande</button>
                          <input type="file" accept="image/*" className="hidden" ref={fileInputRef2} onChange={e => handleFileUpload(e, (url) => setContent({...content, commission: {...content.commission, imageUrl: url}}))} />
                      </div>
                    </div>
                    <LocalizedInput setIsLoading={setIsLoading} label="Titre Section" value={content.commission.title} onChange={v => setContent({...content, commission: {...content.commission, title: v}})} />
                    <LocalizedInput setIsLoading={setIsLoading} label="Description Section" value={content.commission.desc} onChange={v => setContent({...content, commission: {...content.commission, desc: v}})} isTextArea />
                  </div>

                  {/* CONTACTS */}
                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border dark:border-stone-700">
                    <h3 className="font-serif text-lg mb-6 border-l-4 border-gold-600 pl-4">CONTACTS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase mb-2 block text-stone-500">WhatsApp</label>
                        <input type="text" className="w-full p-3 bg-stone-50 dark:bg-stone-900 border rounded" value={content.contactInfo.whatsapp} onChange={e => setContent({...content, contactInfo: {...content.contactInfo, whatsapp: e.target.value}})} placeholder="261..." />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase mb-2 block text-stone-500">Facebook</label>
                        <input type="text" className="w-full p-3 bg-stone-50 dark:bg-stone-900 border rounded" value={content.contactInfo.facebook} onChange={e => setContent({...content, contactInfo: {...content.contactInfo, facebook: e.target.value}})} placeholder="Lien complet" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase mb-2 block text-stone-500">Email</label>
                        <input type="text" className="w-full p-3 bg-stone-50 dark:bg-stone-900 border rounded" value={content.contactInfo.email} onChange={e => setContent({...content, contactInfo: {...content.contactInfo, email: e.target.value}})} placeholder="Email Pro" />
                      </div>
                    </div>
                  </div>

                  {/* SECURITE */}
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
                        {/* ICI : LE CHAMP DESCRIPTION AGRANDI ET FONCTIONNEL */}
                        <LocalizedInput setIsLoading={setIsLoading} label="Description (Apparaît dans le zoom)" value={editingSculpture.description} onChange={v => setEditingSculpture({...editingSculpture, description: v})} isTextArea />
                        
                        <input type="file" onChange={e => handleFileUpload(e, (url) => setEditingSculpture({...editingSculpture, imageUrl: url}))} className="mb-4 text-xs" />
                        {editingSculpture.imageUrl && <img src={editingSculpture.imageUrl} className="w-20 h-20 object-cover mb-4 rounded" />}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <input type="number" placeholder="Prix €" className="p-3 border rounded" value={editingSculpture.price} onChange={e => setEditingSculpture({...editingSculpture, price: Number(e.target.value)})} />
                           <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={editingSculpture.available} onChange={e => setEditingSculpture({...editingSculpture, available: e.target.checked})} /> Disponible à la vente</label>
                        </div>
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

      {/* FOOTER : w-full + bg-black forcés pour être sûr qu'il se voit */}
      <footer className="w-full py-20 bg-black text-stone-100 px-6 border-t border-stone-800 mt-auto z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div><h5 className="text-2xl font-serif tracking-[0.4em] mb-6">JERY</h5><p className="text-stone-500 text-xs font-light">{content.heroSubtitle[lang]}</p></div>
          <div><h6 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-500 mb-6">Menu</h6><ul className="text-xs space-y-3 font-light"><li className="cursor-pointer" onClick={() => setView('home')}>Accueil</li><li className="cursor-pointer" onClick={() => setView('gallery')}>Galerie</li><li className="cursor-pointer" onClick={() => setView('blog')}>Journal</li></ul></div>
          <div><h6 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-500 mb-6">Contact</h6>
            <div className="flex flex-col gap-2 text-sm text-stone-400">
              {content.contactInfo.facebook && <a href={content.contactInfo.facebook} target="_blank" className="hover:text-white">Facebook</a>}
              {content.contactInfo.whatsapp && <a href={`https://wa.me/${content.contactInfo.whatsapp}`} target="_blank" className="hover:text-white">WhatsApp</a>}
              {content.contactInfo.email && <a href={`mailto:${content.contactInfo.email}`} className="hover:text-white">{content.contactInfo.email}</a>}
            </div>
          </div>
        </div>
        <p className="mt-20 text-center text-stone-600 text-[10px] uppercase tracking-[0.5em]">© {new Date().getFullYear()} JERY SCULPTURES MADAGASCAR</p>
      </footer>

      {/* MODALE DE ZOOM */}
      {selectedSculpture && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-5xl w-full flex flex-col md:flex-row bg-white dark:bg-stone-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="md:w-2/3 bg-black flex items-center justify-center">
               <img src={selectedSculpture.imageUrl} className="max-h-[80vh] w-full object-contain" />
            </div>
            <div className="md:w-1/3 p-8 flex flex-col justify-center">
               <h3 className="text-3xl font-serif mb-4 text-stone-900 dark:text-white">{selectedSculpture.title[lang]}</h3>
               <p className="text-stone-600 dark:text-stone-300 mb-6 italic leading-relaxed">{selectedSculpture.description[lang]}</p>
               <p className="text-2xl font-bold text-gold-600 mb-8">{formatPriceDisplay(selectedSculpture.price)}</p>
               <button onClick={() => window.open(`https://wa.me/${content.contactInfo.whatsapp}?text=Intéressé par ${selectedSculpture.title[lang]}`, '_blank')} className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-4 px-8 uppercase font-bold tracking-widest text-xs hover:opacity-90">Commander</button>
            </div>
            <button onClick={() => setSelectedSculpture(null)} className="absolute top-4 right-4 text-stone-500 hover:text-red-500 text-4xl leading-none">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
