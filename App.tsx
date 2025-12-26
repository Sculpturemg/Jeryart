const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'jery_art'); // <--- Mettez ici le nom choisi à l'étape 1

  try {
    // Remplacez 'VOTRE_CLOUD_NAME' ci-dessous par votre vrai Cloud Name de l'étape 2
    const response = await fetch('https://api.cloudinary.com/v1_1/dnbd36uqz/image/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.secure_url) {
      callback(data.secure_url);
    }
  } catch (error) {
    alert("Erreur lors de l'envoi de l'image sur Cloudinary");
  }
};
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<'home' | 'gallery' | 'blog' | 'admin'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  
  // Data States
  const [sculptures, setSculptures] = useState<Sculpture[]>([]);
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  
  // Admin UI States
  const [editingSculpture, setEditingSculpture] = useState<Sculpture | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = UI_TRANSLATIONS[lang];

  const formatPriceDisplay = (priceInEuro: number) => {
    const mga = (priceInEuro * EUR_TO_MGA).toLocaleString('fr-MG');
    return `${mga} Ar (${priceInEuro} €)`;
  };

  // --- Initial Load ---
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const [s, c, b] = await Promise.all([
          DataService.getSculptures(),
          DataService.getContent(),
          DataService.getBlogPosts()
        ]);
        setSculptures(s.length > 0 ? s : INITIAL_SCULPTURES);
        setContent(c || INITIAL_CONTENT);
        setBlogPosts(b.length > 0 ? b : INITIAL_BLOG_POSTS);
      } catch (err) {
        console.warn("Utilisation du stockage local");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // SEO Update
  useEffect(() => {
    const title = content.heroTitle[lang] || "Jery Sculpture";
    document.title = `JERY | ${title}`;
  }, [lang, content]);

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPass = DataService.getAdminPassword();
    if (passwordInput.trim() === currentPass) {
      setIsAdmin(true);
      setPasswordInput('');
    } else {
      alert("Mot de passe incorrect.");
    }
  };

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleChangePassword = () => {
    if (!newPassword || newPassword.length < 4) {
      alert("Le mot de passe doit faire au moins 4 caractères.");
      return;
    }
    DataService.saveAdminPassword(newPassword);
    alert("Mot de passe modifié avec succès !");
    setNewPassword('');
  };

  // --- Admin Components ---
  const LocalizedInput = ({ label, value, onChange, isTextArea = false }: { label: string, value: LocalizedText, onChange: (val: LocalizedText) => void, isTextArea?: boolean }) => {
    const handleTranslate = async () => {
      if (!value.fr) return;
      setIsLoading(true);
      try {
        const translated = await generateTranslations(value.fr);
        onChange(translated);
      } catch (e) {
        alert("Erreur IA");
      } finally {
        setIsLoading(false);
      }
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
                <textarea className="w-full p-2 text-sm bg-white dark:bg-stone-800 border rounded dark:border-stone-700" value={value[l] || ''} onChange={e => onChange({...value, [l]: e.target.value})} rows={3} />
              ) : (
                <input type="text" className="w-full p-2 text-sm bg-white dark:bg-stone-800 border rounded dark:border-stone-700" value={value[l] || ''} onChange={e => onChange({...value, [l]: e.target.value})} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'sculptures' | 'journal'>('general');

    return (
      <div className="max-w-5xl mx-auto py-12 px-6 animate-fade-in">
        <div className="flex justify-between items-center mb-10 border-b pb-4 dark:border-stone-800">
          <h2 className="text-2xl font-serif tracking-widest uppercase text-gold-600">PANEL ARTISTE</h2>
          <button onClick={() => setIsAdmin(false)} className="text-[10px] font-bold text-red-500 uppercase tracking-widest border border-red-500 px-4 py-1 rounded">Déconnexion</button>
        </div>

        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          {(['general', 'sculptures', 'journal'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest border rounded-full transition-all flex-shrink-0 ${activeTab === tab ? 'bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900' : 'border-stone-200 dark:border-stone-700'}`}>
              {tab === 'general' ? 'Réglages & Contact' : tab === 'sculptures' ? 'Ma Galerie' : 'Mon Journal'}
            </button>
          ))}
        </div>

        {activeTab === 'general' && (
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
               <LocalizedInput label="Titre Principal" value={content.heroTitle} onChange={v => setContent({...content, heroTitle: v})} />
               <LocalizedInput label="Sous-titre" value={content.heroSubtitle} onChange={v => setContent({...content, heroSubtitle: v})} />
             </div>

             <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border dark:border-stone-700">
               <h3 className="font-serif text-lg mb-6 border-l-4 border-gold-600 pl-4">HISTOIRE & À PROPOS</h3>
               <LocalizedInput label="Texte Biographie" value={content.aboutText} onChange={v => setContent({...content, aboutText: v})} isTextArea />
             </div>

             <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border dark:border-stone-700">
               <h3 className="font-serif text-lg mb-6 border-l-4 border-gold-600 pl-4">RÉSEAUX & CONTACTS</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                   <label className="text-[10px] font-bold uppercase mb-2 block">WhatsApp (261...)</label>
                   <input type="text" className="w-full p-3 bg-stone-50 dark:bg-stone-900 border rounded" value={content.contactInfo.whatsapp} onChange={e => setContent({...content, contactInfo: {...content.contactInfo, whatsapp: e.target.value}})} />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold uppercase mb-2 block">Facebook (Lien complet)</label>
                   <input type="text" className="w-full p-3 bg-stone-50 dark:bg-stone-900 border rounded" value={content.contactInfo.facebook} onChange={e => setContent({...content, contactInfo: {...content.contactInfo, facebook: e.target.value}})} />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold uppercase mb-2 block">Email Professionnel</label>
                   <input type="email" className="w-full p-3 bg-stone-50 dark:bg-stone-900 border rounded" value={content.contactInfo.email} onChange={e => setContent({...content, contactInfo: {...content.contactInfo, email: e.target.value}})} />
                 </div>
               </div>
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
               <button onClick={() => { DataService.saveContent(content); alert("Modifications enregistrées !"); }} className="bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 px-12 py-4 rounded-full font-bold uppercase text-xs tracking-widest shadow-2xl">Enregistrer Tout le Site</button>
             </div>
          </div>
        )}

        {activeTab === 'sculptures' && (
          <div className="space-y-6 animate-fade-in pb-20">
            <button onClick={() => setEditingSculpture({ id: '', title: {fr:'',mg:'',en:'',ru:''}, description: {fr:'',mg:'',en:'',ru:''}, price: 0, category: 'Wood', imageUrl: '', available: true, createdAt: new Date().toISOString() })} className="w-full p-10 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl text-stone-400 hover:text-gold-600 transition-all font-bold uppercase tracking-widest">+ Ajouter une Sculpture</button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sculptures.map(s => (
                <div key={s.id} className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border dark:border-stone-700 overflow-hidden group">
                  <img src={s.imageUrl} className="w-full h-48 object-cover group-hover:opacity-90" />
                  <div className="p-4">
                    <p className="font-bold truncate text-lg">{s.title.fr}</p>
                    <p className="text-xs text-gold-600 font-bold mb-4">{formatPriceDisplay(s.price)}</p>
                    <div className="flex justify-between border-t pt-3">
                      <button onClick={() => setEditingSculpture(s)} className="text-[10px] font-bold uppercase text-blue-500 hover:text-blue-600">Modifier</button>
                      <button onClick={() => { if(confirm("Supprimer?")) { const l = sculptures.filter(x => x.id !== s.id); setSculptures(l); saveToStorage('jery_local_sculptures', l); }}} className="text-[10px] font-bold uppercase text-red-500 hover:text-red-600">Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {editingSculpture && (
              <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-stone-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl">
                  <div className="flex justify-between items-center mb-6 border-b pb-2">
                    <h3 className="text-xl font-serif uppercase tracking-widest">Détails de l'œuvre</h3>
                    <button onClick={() => setEditingSculpture(null)} className="text-xl">×</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-2">Prix en Euro (€)</label>
                      <input type="number" className="w-full p-3 border rounded dark:bg-stone-900" value={editingSculpture.price} onChange={e => setEditingSculpture({...editingSculpture, price: Number(e.target.value)})} />
                      <p className="text-[10px] text-gold-600 mt-2 font-bold">Valeur en Ariary : {formatPriceDisplay(editingSculpture.price)}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-2">Image</label>
                      <input type="file" accept="image/*" className="w-full text-xs" onChange={e => handleFileUpload(e, (url) => setEditingSculpture({...editingSculpture, imageUrl: url}))} />
                      {editingSculpture.imageUrl && <img src={editingSculpture.imageUrl} className="mt-2 w-20 h-20 object-cover rounded border" />}
                    </div>
                  </div>
                  <LocalizedInput label="Titre de l'œuvre" value={editingSculpture.title} onChange={v => setEditingSculpture({...editingSculpture, title: v})} />
                  <LocalizedInput label="Description" value={editingSculpture.description} onChange={v => setEditingSculpture({...editingSculpture, description: v})} isTextArea />
                  <div className="flex justify-end gap-4 mt-8">
                    <button onClick={() => setEditingSculpture(null)} className="px-6 py-2 text-xs font-bold uppercase">Annuler</button>
                    <button onClick={() => {
                      const newList = editingSculpture.id ? sculptures.map(x => x.id === editingSculpture.id ? editingSculpture : x) : [...sculptures, {...editingSculpture, id: Date.now().toString()}];
                      setSculptures(newList);
                      saveToStorage('jery_local_sculptures', newList);
                      setEditingSculpture(null);
                    }} className="bg-gold-600 text-white px-10 py-3 rounded-full font-bold uppercase text-xs">Sauvegarder</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'journal' && (
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
                  <LocalizedInput label="Titre de l'article" value={editingPost.title} onChange={v => setEditingPost({...editingPost, title: v})} />
                  <LocalizedInput label="Contenu du texte" value={editingPost.content} onChange={v => setEditingPost({...editingPost, content: v})} isTextArea />
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
    );
  };

  // --- Main Render Logic ---
  const MainContent = () => {
    switch (view) {
      case 'gallery':
        return (
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
        );
      case 'blog':
        return (
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
        );
      case 'admin':
        return isAdmin ? <AdminPanel /> : (
          <div className="max-w-md mx-auto py-32 px-6">
            <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-2xl border dark:border-stone-700 text-center">
              <h2 className="text-3xl font-serif uppercase tracking-widest mb-10">ADMINISTRATION</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <input type="password" placeholder="MOT DE PASSE" className="w-full p-4 bg-stone-100 dark:bg-stone-900 border dark:border-stone-700 rounded-lg text-center font-bold tracking-[0.5em]" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
                <button type="submit" className="w-full py-4 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 font-bold uppercase tracking-widest rounded-lg hover:bg-gold-600 hover:text-white transition-all">Connexion</button>
              </form>
            </div>
          </div>
        );
      default:
        return (
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
        );
    }
  };

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
            <select value={lang} onChange={(e) => setLang(e.target.value as Language)} className="bg-transparent text-[10px] font-bold border rounded p-1">
              {Object.values(Language).map(l => <option key={l} value={l} className="dark:bg-stone-900">{l.toUpperCase()}</option>)}
            </select>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full">{theme === 'light' ? '🌙' : '☀️'}</button>
            <button onClick={() => setView(view === 'admin' ? 'home' : 'admin')} className="md:hidden">⚙️</button>
          </div>
        </div>
      </nav>

      <main>{MainContent()}</main>

      <footer className="py-20 bg-stone-900 text-stone-100 px-6 border-t border-stone-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div><h5 className="text-2xl font-serif tracking-[0.4em] mb-6">JERY</h5><p className="text-stone-500 text-xs font-light">{content.heroSubtitle[lang]}</p></div>
          <div><h6 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-500 mb-6">Menu</h6><ul className="text-xs space-y-3 font-light"><li className="cursor-pointer" onClick={() => setView('home')}>Accueil</li><li className="cursor-pointer" onClick={() => setView('gallery')}>Galerie</li><li className="cursor-pointer" onClick={() => setView('blog')}>Journal</li></ul></div>
          <div><h6 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-500 mb-6">Contact</h6><div className="flex justify-center md:justify-start gap-6 text-xl"><a href={content.contactInfo.facebook} target="_blank"><i className="fab fa-facebook-f"></i></a><a href={`https://wa.me/${content.contactInfo.whatsapp}`} target="_blank"><i className="fab fa-whatsapp"></i></a><a href={`mailto:${content.contactInfo.email}`}><i className="far fa-envelope"></i></a></div></div>
        </div>
        <p className="mt-20 text-center text-stone-600 text-[10px] uppercase tracking-[0.5em]">© {new Date().getFullYear()} JERY SCULPTURES MADAGASCAR</p>
    </footer>
      {/* Système de Zoom universel */}
      {selectedImg && (
        <div 
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          <img 
            src={selectedImg} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300"
            alt="Sculpture zoomée"
          />
          <button className="absolute top-6 right-6 text-white text-4xl">&times;</button>
          </div>
        )}
      );
    };

  export default App;
