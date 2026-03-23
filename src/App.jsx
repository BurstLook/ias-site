import { useState, useEffect, useRef } from "react";

// Hook de scroll reveal — observa elementos com data-reveal e anima na entrada
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay || "0";
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0) scale(1)";
            }, Number(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// SVG helpers - tamanho fixo, sem className herdado
const Ico = {
  BookOpen:      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  MapPin:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Phone:         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>,
  Instagram:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="2" fill="currentColor" stroke="none"/></svg>,
  MessageCircle: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  X:             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Send:          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  ArrowRight:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ChevronRight:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Globe:         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Brain:         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>,
  Lightbulb:     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  Heart:         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Music:         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Check:         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Palette:       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  GraduationCap: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  Shield:        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Whatsapp:      <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C8.832 3 3 8.832 3 16c0 2.3.618 4.45 1.688 6.313L3 29l6.875-1.656A12.93 12.93 0 0 0 16 29c7.168 0 13-5.832 13-13S23.168 3 16 3zm0 2c6.086 0 11 4.914 11 11s-4.914 11-11 11a10.94 10.94 0 0 1-5.5-1.47l-.375-.219-3.938.938.97-3.813-.25-.406A10.94 10.94 0 0 1 5 16C5 9.914 9.914 5 16 5zm-2.344 5.688c-.23 0-.605.062-.918.406-.313.344-1.188 1.164-1.188 2.844s1.215 3.293 1.375 3.53c.164.24 2.352 3.688 5.781 5.032 2.867 1.132 3.438.906 4.063.844.625-.063 2.02-.825 2.313-1.625.289-.8.289-1.484.2-1.625-.086-.14-.313-.226-.657-.406-.343-.18-2.03-.999-2.343-1.125-.313-.125-.543-.188-.77.188-.226.375-.879 1.125-1.093 1.375-.207.246-.407.274-.75.094-.344-.18-1.454-.535-2.77-1.72-1.023-.916-1.714-2.05-1.918-2.393-.2-.344-.02-.531.152-.703.156-.156.344-.407.516-.61.168-.202.226-.343.336-.57.113-.226.055-.43-.031-.61-.086-.18-.77-1.867-1.063-2.562-.28-.68-.562-.586-.77-.594-.199-.008-.43-.008-.656-.008z"/></svg>,
};
// Wrapper para manter compatibilidade com chamadas icons.X()
const icons = Object.fromEntries(Object.entries(Ico).map(([k,v]) => [k, () => v]));

const WA_LINK = (msg = "Olá! Gostaria de saber mais sobre as matrículas do Instituto Ayllton Santos.") =>
  `https://wa.me/558134490496?text=${encodeURIComponent(msg)}`;

// ── CHATBOT ──────────────────────────────────────────────────────────────────
function Chatbot({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Olá! Bem-vindo(a) ao Instituto Ayllton Santos 🎓\nComo posso ajudar você hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput("");
    setMessages(prev => [...prev, { type: "user", text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.text
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: `Você é o assistente virtual do Instituto Ayllton Santos, uma escola particular em Recife-PE.
Responda sempre em português brasileiro, de forma amigável, concisa (máximo 3 frases) e útil.
Informações da escola:
- Nome: Instituto Ayllton Santos (IAS)
- Endereço: Av. Beberibe, 4628 – Beberibe, Recife – PE, CEP 52130-325
- Telefone: (81) 3449-0496
- Instagram: @institutoaylltonsantos
- Séries: Educação Infantil ao 9º Ano do Ensino Fundamental
- Diferenciais: Ensino Bilíngue, Robótica, Musicalização, Empreendedorismo, Educação Socioemocional
- Horário: Segunda a Sábado, 7h30 às 17h30
- Matrículas 2026 estão abertas
Para valores e agendamento de visita, sempre oriente o responsável a entrar em contato pelo WhatsApp (81) 3449-0496.`,
          messages: [...history, { role: "user", content: userMsg }]
        })
      });

      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Desculpe, não consegui processar. Ligue: (81) 3449-0496";
      setMessages(prev => [...prev, { type: "bot", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { type: "bot", text: "Ocorreu um erro. Por favor, entre em contato: (81) 3449-0496 📞" }]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = ["Onde fica a escola?", "Quais séries têm?", "Matrículas 2026", "Horário de funcionamento"];

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-50 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform group flex items-center justify-center" style={{background:"#f97316",border:"3px solid #fff",boxShadow:"0 4px 24px rgba(249,115,22,0.5)"}}>
      <icons.MessageCircle />
      <span className="absolute right-full mr-3 bg-white text-slate-800 text-xs px-3 py-2 rounded-xl shadow-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Dúvidas? Fale conosco!
      </span>
    </button>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 rounded-2xl flex flex-col overflow-hidden" style={{height:500,background:"#ffffff",border:"1px solid #e2e8f0",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
      {/* Header */}
      <div style={{background:"#0b2545",color:"#fff",padding:"1rem",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"2px solid #f97316"}}>
        <div className="flex items-center gap-3">
          <div style={{width:40,height:40,minWidth:40,background:"#f97316",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#fff",fontSize:13}}>IAS</div>
          <div>
            <p className="font-bold text-sm">Assistente IAS</p>
            <p className="text-xs text-blue-200 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> Online agora
            </p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-800 p-1 rounded-lg transition-colors"><icons.X /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{background:"#f8fafc"}}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2.5 rounded-2xl max-w-[82%] text-sm whitespace-pre-line leading-relaxed ${
              m.type === "user"
                ? "bg-orange-500 text-white rounded-br-none"
                : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
              {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }}></span>)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5" style={{background:"#ffffff",borderTop:"1px solid #f1f5f9"}}>
          {quickReplies.map(q => (
            <button key={q} onClick={() => send(q)}
              className="bg-slate-100 hover:bg-orange-50 hover:border-orange-300 border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-full transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 flex gap-2" style={{background:"#ffffff",borderTop:"1px solid #f1f5f9"}}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Digite sua pergunta..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400 transition-colors"
        />
        <button onClick={() => send(input)} disabled={!input.trim() || loading}
          className="bg-[#0b2545] disabled:opacity-40 text-white p-2.5 rounded-full transition-opacity hover:bg-[#163a6b]">
          <icons.Send />
        </button>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", turma: "Educação Infantil", mensagem: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useScrollReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.telefone) return;
    const msg = `Olá! Me chamo ${form.nome}. Tenho interesse em matrícula para ${form.turma}. Meu WhatsApp: ${form.telefone}.${form.mensagem ? " " + form.mensagem : ""}`;
    try { window.open(WA_LINK(msg), "_blank"); } catch(err) { window.location.href = WA_LINK(msg); }
    setSent(true);
  };

  const diferenciais = [
    { icon: icons.Globe, title: "Ensino Bilíngue", desc: "Imersão na língua inglesa, preparando nossos alunos para se comunicarem com o mundo." },
    { icon: icons.Brain, title: "Robótica", desc: "Aulas práticas que desenvolvem raciocínio lógico, programação e criatividade desde cedo." },
    { icon: icons.Lightbulb, title: "Empreendedorismo", desc: "Educação financeira e projetos que estimulam visão de liderança e autonomia." },
    { icon: icons.Heart, title: "Ed. Socioemocional", desc: "Cuidado com a saúde mental, ensinando empatia, resiliência e inteligência emocional." },
    { icon: icons.Music, title: "Musicalização", desc: "Desenvolvimento cognitivo e sensibilidade artística através de aulas de música dinâmicas." },
    { icon: icons.Check, title: "Equipe Multidisciplinar", desc: "Profissionais capacitados e atentos às necessidades individuais de cada estudante." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* NAV */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:50,transition:"all 0.3s",background: scrolled ? "#ffffff" : "rgba(0,0,0,0.25)",backdropFilter:"blur(8px)",padding: scrolled ? "0.75rem 0" : "1.25rem 0",boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.08)" : "none"}}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <a onClick={(e)=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})}} href="#" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none",cursor:"pointer"}}>
            <span style={{color: scrolled ? "#0b2545" : "#ffffff"}}>{Ico.Shield}</span>
            <div>
              <div style={{fontSize:"1.1rem",fontWeight:800,lineHeight:1,letterSpacing:"-0.02em",color: scrolled ? "#0b2545" : "#ffffff"}}>INSTITUTO</div>
              <div className="text-orange-500 font-extrabold tracking-widest text-xs leading-none">AYLLTON SANTOS</div>
            </div>
          </a>
          <nav style={{display:"flex",gap:"1.5rem",alignItems:"center"}}>
            {[["sobre","A Escola"],["segmentos","Segmentos"],["diferenciais","Diferenciais"],["galeria","Nossa Escola"],["matriculas","Matrículas"]].map(([id,l]) => (
              <a key={id} href={"#"+id} onClick={(e)=>{e.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}} style={{color: scrolled ? "#1e293b" : "#ffffff", textDecoration:"none", fontWeight:500, fontSize:"0.875rem", transition:"color 0.2s", cursor:"pointer"}}>{l}</a>
            ))}
          </nav>
          <button onClick={()=>document.getElementById("matriculas")?.scrollIntoView({behavior:"smooth"})} style={{display:"flex",alignItems:"center",gap:8,background:"#f97316",color:"#fff",padding:"0.55rem 1.4rem",borderRadius:50,fontWeight:700,fontSize:"0.85rem",border:"none",cursor:"pointer",boxShadow:"0 4px 16px rgba(249,115,22,0.35)"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"block",flexShrink:0}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg> Fale Conosco
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        {/* Overlay escuro */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg, rgba(11,37,69,0.88) 0%, rgba(11,37,69,0.75) 60%, rgba(0,0,0,0.70) 100%)",zIndex:0}}></div>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-12" style={{position:"relative",zIndex:1}}>
          <div className="md:w-1/2">
            <div style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",backdropFilter:"blur(4px)",color:"#fff",fontWeight:700,padding:"0.4rem 1rem",borderRadius:50,fontSize:"0.75rem",marginBottom:"1.5rem",display:"inline-flex",alignItems:"center",gap:8}}>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse inline-block"></span>
              MATRÍCULAS ABERTAS 2026
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4" style={{color:"#ffffff"}}>
              A educação que <span className="text-orange-500">muda</span> o seu mundo.
            </h1>
            <p className="text-lg mb-8 max-w-lg leading-relaxed" style={{color:"rgba(255,255,255,0.85)"}}>
              Há 18 anos formando gerações. Do Berçário ao 9º Ano, com Ensino Bilíngue, Robótica e Educação Socioemocional para o desenvolvimento integral do seu filho.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#matriculas" onClick={(e)=>{e.preventDefault();document.getElementById("matriculas")?.scrollIntoView({behavior:"smooth"})}} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-center transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer">
                Garantir Vaga <icons.ArrowRight />
              </a>
              <button onClick={() => setChatOpen(true)} style={{background:"rgba(255,255,255,0.1)",border:"2px solid rgba(255,255,255,0.4)",color:"#fff",padding:"1rem 2rem",borderRadius:50,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s",backdropFilter:"blur(4px)"}}>
                <span className="text-green-500"><icons.MessageCircle /></span>
                Dúvidas Rápidas
              </button>
            </div>
          </div>

          <div className="md:w-1/2" style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{borderRadius:20,overflow:"hidden",boxShadow:"0 24px 60px rgba(0,0,0,0.3)",border:"4px solid rgba(255,255,255,0.2)",background:"linear-gradient(135deg,#0b2545,#1e4d8c)",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <div style={{textAlign:"center",color:"rgba(255,255,255,0.3)"}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{width:56,height:56,margin:"0 auto 12px",opacity:0.25,display:"block"}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                <p style={{fontSize:"0.8rem",opacity:0.5}}>Adicione uma foto da escola aqui</p>
              </div>
            </div>
            <div style={{marginTop:16,background:"rgba(255,255,255,0.12)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.2)",padding:"0.75rem 1.2rem",borderRadius:14,display:"inline-flex",alignItems:"center",gap:12}}>
              <div style={{background:"#f97316",padding:8,borderRadius:"50%",color:"#fff",display:"flex"}}>{Ico.GraduationCap}</div>
              <div>
                <p style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.6)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",margin:0}}>Tradição & Inovação</p>
                <p style={{fontWeight:700,color:"#ffffff",fontSize:"0.9rem",margin:0}}>Infantil ao 9º Ano</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2545] mb-6">
            18 anos construindo o futuro, <span className="text-orange-500">junto com a sua família</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            No Instituto Ayllton Santos, a educação vai além da sala de aula. Integramos afeto, inovação tecnológica e habilidades para a vida — preparando os nossos alunos não apenas para os desafios acadêmicos, mas para serem cidadãos que transformam o mundo.
          </p>
        </div>
      </section>

      {/* SEGMENTOS */}
      <section id="segmentos" className="py-20" style={{background:"linear-gradient(135deg, #f97316 0%, #ea580c 50%, #fb923c 100%)",position:"relative",overflow:"hidden"}}>
        {/* Blobs decorativos */}
        <div style={{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,0.08)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,borderRadius:"50%",background:"rgba(0,0,0,0.06)",pointerEvents:"none"}}/>

        <div className="max-w-6xl mx-auto px-4 md:px-8" style={{position:"relative",zIndex:1}}>
          <div className="text-center mb-14">
            <div style={{display:"inline-block",background:"rgba(255,255,255,0.2)",color:"#ffffff",fontWeight:700,fontSize:"0.72rem",letterSpacing:"0.1em",textTransform:"uppercase",padding:"0.35rem 1rem",borderRadius:50,marginBottom:"0.8rem",border:"1px solid rgba(255,255,255,0.3)"}}>
              Ensino de qualidade
            </div>
            <h2 style={{color:"#ffffff",fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:800,marginBottom:"0.6rem",lineHeight:1.2}}>Nossos Segmentos</h2>
            <p style={{color:"rgba(255,255,255,0.85)",maxWidth:500,margin:"0 auto",lineHeight:1.7}}>Metodologias adequadas para cada fase do desenvolvimento escolar.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: icons.Palette, title: "Educação Infantil", desc: "Foco no cuidar, no brincar e nas primeiras descobertas em um ambiente seguro e acolhedor.", border: "" },
              { icon: icons.BookOpen, title: "Fund. I — 1º ao 5º", desc: "Consolidação da alfabetização e desenvolvimento do raciocínio lógico, estimulando a curiosidade.", border: "" },
              { icon: icons.GraduationCap, title: "Fund. II — 6º ao 9º", desc: "Aprofundamento acadêmico, autonomia e preparação socioemocional para a adolescência.", border: "" },
            ].map((s, i) => (
              <div key={i} data-reveal="up" data-delay={i*120} style={{background:"rgba(255,255,255,0.97)",borderRadius:20,padding:"2rem",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",transition:"transform 0.2s,box-shadow 0.2s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 16px 48px rgba(0,0,0,0.18)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.12)"}}>
                <div style={{background:"#fff3e0",width:56,height:56,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.2rem",color:"#f97316"}}><s.icon /></div>
                <h3 style={{fontSize:"1.15rem",fontWeight:800,color:"#0b2545",marginBottom:"0.6rem"}}>{s.title}</h3>
                <p style={{color:"#64748b",fontSize:"0.88rem",lineHeight:1.7,marginBottom:"1.2rem"}}>{s.desc}</p>
                <a href="#matriculas" onClick={(e)=>{e.preventDefault();document.getElementById("matriculas")?.scrollIntoView({behavior:"smooth"})}} style={{color:"#f97316",fontWeight:600,fontSize:"0.88rem",display:"flex",alignItems:"center",gap:4,textDecoration:"none",cursor:"pointer"}}>
                  Saber mais <icons.ChevronRight />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" style={{position:"relative", overflow:"hidden", background:"#0b2545", padding:"5rem 0"}}>

        {/* Círculos animados de fundo */}
        <style>{`
          @keyframes floatA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.1)} }
          @keyframes floatB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,35px) scale(0.95)} }
          @keyframes floatC { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,25px)} }
          .dif-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 32px rgba(0,0,0,0.15) !important; transition: transform 0.2s, box-shadow 0.2s; }

          /* Scroll reveal base — elementos começam invisíveis */
          [data-reveal] {
            opacity: 0;
            transform: translateY(32px) scale(0.97);
            transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
          }
          [data-reveal="left"] { transform: translateX(-40px); }
          [data-reveal="right"] { transform: translateX(40px); }
          [data-reveal="scale"] { transform: scale(0.85); }
          [data-reveal="up"] { transform: translateY(40px); }
        `}</style>

        {/* Blob 1 — canto superior esquerdo */}
        <div style={{position:"absolute",top:"-80px",left:"-80px",width:320,height:320,borderRadius:"50%",background:"rgba(249,115,22,0.12)",animation:"floatA 7s ease-in-out infinite",pointerEvents:"none"}}/>
        {/* Blob 2 — canto inferior direito */}
        <div style={{position:"absolute",bottom:"-60px",right:"-60px",width:280,height:280,borderRadius:"50%",background:"rgba(30,77,140,0.5)",animation:"floatB 9s ease-in-out infinite",pointerEvents:"none"}}/>
        {/* Blob 3 — centro */}
        <div style={{position:"absolute",top:"40%",left:"50%",width:200,height:200,borderRadius:"50%",background:"rgba(249,115,22,0.07)",animation:"floatC 11s ease-in-out infinite",pointerEvents:"none"}}/>

        <div className="max-w-6xl mx-auto px-4 md:px-8" style={{position:"relative",zIndex:1}}>
          <div style={{textAlign:"center",marginBottom:"3.5rem"}}>
            <div style={{display:"inline-block",background:"rgba(249,115,22,0.15)",color:"#fb923c",fontWeight:700,fontSize:"0.72rem",letterSpacing:"0.1em",textTransform:"uppercase",padding:"0.35rem 1rem",borderRadius:50,marginBottom:"0.8rem",border:"1px solid rgba(249,115,22,0.3)"}}>
              Nosso diferencial
            </div>
            <h2 style={{color:"#ffffff",fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:800,lineHeight:1.15,marginBottom:"0.75rem"}}>
              A Formação Completa do IAS
            </h2>
            <p style={{color:"#94a3b8",textAlign:"center",maxWidth:560,margin:"0 auto",lineHeight:1.7,fontSize:"1rem"}}>
              Nosso currículo vai além do tradicional, preparando os alunos com as habilidades essenciais para o século XXI.
            </p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
            {diferenciais.map((d, i) => (
              <div key={i} data-reveal="up" data-delay={i*100} className="dif-card" style={{
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:16,
                padding:"1.5rem",
                display:"flex",
                alignItems:"flex-start",
                gap:16,
                backdropFilter:"blur(8px)",
                cursor:"default"
              }}>
                <div style={{background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.25)",padding:12,borderRadius:12,flexShrink:0,color:"#f97316"}}>
                  <d.icon />
                </div>
                <div>
                  <h4 style={{color:"#ffffff",fontWeight:700,fontSize:"0.95rem",marginBottom:"0.35rem"}}>{d.title}</h4>
                  <p style={{color:"#94a3b8",fontSize:"0.82rem",lineHeight:1.65,margin:0}}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" style={{background:"#f8fafc", position:"relative", padding:"5rem 0"}}>
        <style>{`
          @keyframes galFadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
          .gal-card { animation: galFadeUp 0.5s ease both; }
          .gal-card:hover { transform: scale(1.02); box-shadow: 0 8px 28px rgba(11,37,69,0.12); transition: transform 0.25s, box-shadow 0.25s; }
        `}</style>

        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div style={{textAlign:"center", marginBottom:"3rem"}}>
            <div style={{display:"inline-block", background:"#fff3e0", color:"#f97316", fontWeight:700, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.35rem 1rem", borderRadius:50, marginBottom:"0.8rem"}}>
              Nossa Escola
            </div>
            <h2 style={{fontSize:"clamp(1.8rem, 3vw, 2.4rem)", fontWeight:800, color:"#0b2545", letterSpacing:"-0.02em", lineHeight:1.2, marginBottom:"0.6rem"}}>
              O dia a dia no <span style={{color:"#f97316"}}>Instituto</span>
            </h2>
            <p style={{color:"#64748b", fontSize:"1rem", maxWidth:480, margin:"0 auto 1.5rem", lineHeight:1.7}}>
              Momentos reais de aprendizado, alegria e descoberta que fazem parte da nossa história.
            </p>
            <a href="https://instagram.com/institutoaylltonsantos" target="_blank" rel="noreferrer"
              style={{display:"inline-flex", alignItems:"center", gap:8, color:"#0b2545", fontWeight:600, fontSize:"0.85rem", background:"#eff6ff", padding:"0.5rem 1.2rem", borderRadius:50, textDecoration:"none", border:"1px solid #bfdbfe"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="2" fill="currentColor" stroke="none"/></svg>
              @institutoaylltonsantos
            </a>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16}}>
            {["Foto Principal","Robótica","Eventos","Ed. Infantil","Professores","Atividades"].map((label, i) => (
              <div key={label} data-reveal="up" data-delay={i*80} className="gal-card" style={{
                background: i===0 ? "#0b2545" : "#ffffff",
                borderRadius:16,
                border: "1px solid " + (i===0 ? "#1e4d8c" : "#e2e8f0"),
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                height:180,
                overflow:"hidden",
                boxShadow:"0 2px 12px rgba(11,37,69,0.06)",
                animationDelay: i*0.1+"s",
                cursor:"pointer"
              }}>
                <div style={{textAlign:"center",padding:16}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{width:28,height:28,margin:"0 auto 6px",opacity:0.25,display:"block",color: i===0 ? "#fff" : "#0b2545"}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                  <p style={{fontSize:11,opacity:0.4,color: i===0 ? "#fff" : "#475569",margin:0,fontWeight:500}}>{label}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{fontSize:11,color:"#94a3b8",textAlign:"center",marginTop:12}}>Substitua os espaços acima com fotos reais da escola</p>
        </div>
      </section>

      {/* MATRÍCULAS */}
      <section id="matriculas" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-10 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row gap-12 border border-slate-100">
            <div className="md:w-1/2">
              <span className="bg-orange-100 text-orange-700 font-bold px-4 py-1 rounded-full text-xs mb-5 inline-block">GARANTA A VAGA PARA 2026</span>
              <h2 className="text-3xl font-extrabold text-[#0b2545] mb-4">Venha fazer parte da Família IAS!</h2>
              <p className="text-slate-600 mb-8 text-sm leading-relaxed">Fale com nossa equipe para consultar valores, agendar uma visita e conhecer a proposta pedagógica que vai transformar o futuro do seu filho.</p>
              <div data-reveal="left" className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-full text-blue-600"><icons.Phone /></div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Ligue para a Secretaria</p>
                    <p className="font-extrabold text-[#0b2545]">(81) 3449-0496</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-orange-50 p-3 rounded-full text-orange-600"><icons.MapPin /></div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Faça-nos uma visita</p>
                    <p className="font-bold text-[#0b2545] text-sm">Av. Beberibe, 4628 — Beberibe, Recife/PE</p>
                  </div>
                </div>
                <a href={WA_LINK()} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold transition-all w-fit shadow-lg shadow-green-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="currentColor" style={{display:"block",flexShrink:0}}><path d="M16 3C8.832 3 3 8.832 3 16c0 2.3.618 4.45 1.688 6.313L3 29l6.875-1.656A12.93 12.93 0 0 0 16 29c7.168 0 13-5.832 13-13S23.168 3 16 3zm0 2c6.086 0 11 4.914 11 11s-4.914 11-11 11a10.94 10.94 0 0 1-5.5-1.47l-.375-.219-3.938.938.97-3.813-.25-.406A10.94 10.94 0 0 1 5 16C5 9.914 9.914 5 16 5zm-2.344 5.688c-.23 0-.605.062-.918.406-.313.344-1.188 1.164-1.188 2.844s1.215 3.293 1.375 3.53c.164.24 2.352 3.688 5.781 5.032 2.867 1.132 3.438.906 4.063.844.625-.063 2.02-.825 2.313-1.625.289-.8.289-1.484.2-1.625-.086-.14-.313-.226-.657-.406-.343-.18-2.03-.999-2.343-1.125-.313-.125-.543-.188-.77.188-.226.375-.879 1.125-1.093 1.375-.207.246-.407.274-.75.094-.344-.18-1.454-.535-2.77-1.72-1.023-.916-1.714-2.05-1.918-2.393-.2-.344-.02-.531.152-.703.156-.156.344-.407.516-.61.168-.202.226-.343.336-.57.113-.226.055-.43-.031-.61-.086-.18-.77-1.867-1.063-2.562-.28-.68-.562-.586-.77-.594-.199-.008-.43-.008-.656-.008z"/></svg> Chamar no WhatsApp
                </a>
              </div>
            </div>

            <div className="md:w-1/2">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600"><icons.Check /></div>
                  <h3 className="text-xl font-bold text-[#0b2545]">Mensagem enviada!</h3>
                  <p className="text-slate-600 text-sm">Você será redirecionado ao WhatsApp para finalizar o contato com a secretaria.</p>
                  <button onClick={() => setSent(false)} className="text-sm text-orange-600 underline">Enviar nova mensagem</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Responsável *</label>
                    <input required value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all text-sm"
                      placeholder="Seu nome completo" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp *</label>
                      <input required value={form.telefone} onChange={e => setForm(f => ({...f, telefone: e.target.value}))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition-all text-sm"
                        placeholder="(81) 9 0000-0000" type="tel" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Turma de Interesse</label>
                      <select value={form.turma} onChange={e => setForm(f => ({...f, turma: e.target.value}))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition-all text-sm">
                        <option>Educação Infantil</option>
                        <option>Ensino Fundamental I</option>
                        <option>Ensino Fundamental II</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mensagem (opcional)</label>
                    <textarea rows="3" value={form.mensagem} onChange={e => setForm(f => ({...f, mensagem: e.target.value}))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition-all resize-none text-sm"
                      placeholder="Como podemos ajudar?" />
                  </div>
                  <button type="submit" style={{width:"100%",background:"#f97316",color:"#fff",fontWeight:700,padding:"1rem",borderRadius:12,border:"none",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 16px rgba(249,115,22,0.4)"}}>
                    Solicitar Informações <icons.Send />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-orange-500"><icons.Shield /></span>
              <div>
                <div className="text-lg font-extrabold text-white leading-none">INSTITUTO</div>
                <div className="text-orange-500 font-extrabold tracking-widest text-xs">AYLLTON SANTOS</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-5 text-slate-400">A educação que muda o seu mundo. Há 18 anos comprometidos com a excelência do Infantil ao 9º Ano.</p>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <a href="https://www.instagram.com/institutoaylltonsantos" target="_blank" rel="noreferrer"
                style={{width:40,height:40,borderRadius:"50%",background:"#1e293b",border:"1px solid #334155",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0" fill="#94a3b8" stroke="#94a3b8" strokeWidth="3"/></g></svg>
              </a>
              <a href="https://wa.me/558134490496" target="_blank" rel="noreferrer"
                style={{width:40,height:40,borderRadius:"50%",background:"#1e293b",border:"1px solid #334155",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="#94a3b8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Acesso Rápido</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[["sobre","Nossa Escola"],["segmentos","Segmentos"],["diferenciais","Diferenciais"],["matriculas","Matrículas"]].map(([id,l]) => (
                <li key={id}><a href={"#"+id} onClick={(e)=>{e.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}} className="hover:text-orange-400 transition-colors cursor-pointer">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Contato</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5"><icons.MapPin /></span><span>Av. Beberibe, 4628<br/>Beberibe, Recife — PE<br/>CEP 52130-325</span></li>
              <li className="flex items-center gap-2"><span className="text-orange-500"><icons.Phone /></span><span>(81) 3449-0496</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-10 pt-6 border-t border-slate-800 text-xs text-center text-slate-500">
          © 2026 Instituto Ayllton Santos. Todos os direitos reservados.
        </div>
      </footer>

      <Chatbot isOpen={chatOpen} setIsOpen={setChatOpen} />
    </div>
  );
}