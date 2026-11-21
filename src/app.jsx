import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Mail, Phone, MapPin, Linkedin, Download, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import archive from './data/projects.json';
import brands from './data/brands.json';
import './styles.css';

/* ============================ PROFIL AHMAD ============================ */
const CV = './Asset/cv/CV_AHMAD_UMRAITHI.pdf';
const PORTRAIT = './Asset/img/portrait-placeholder.svg'; // ganti dengan foto kamu (PNG transparan 1024×1536)
const EMAIL = 'umraithi769@gmail.com';
const PHONE_DISPLAY = '+62 822-7607-8880';
const WHATSAPP = '6282276078880';
const GITHUB = 'https://github.com/KADAFERHIDUP';
const LINKEDIN = { handle: 'in/ahmadumraithi', url: 'https://www.linkedin.com/in/ahmadumraithi/' };
const LOCATION = 'LHOKSEUMAWE, ACEH';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const categories = ['Semua', 'Backend', 'Web', 'Web3', 'Mobile'];
const featured = ['MiniBank', 'snap-sim', 'qris-sim', 'Soundbox S9', 'Squeek Orbit', 'DigiGoat'].map(key => archive.find(p => p.media === key || p.title === key)).filter(Boolean);
const experiences = [
  { date: '2022 – 2026', title: 'Pengurus HIMATIF', place: 'Himpunan Mahasiswa Teknik Informatika · Universitas Malikussaleh', text: 'Pengurus Himpunan Mahasiswa Teknik Informatika Universitas Malikussaleh periode 2022–2026.' },
  { date: '2024 – 2025', title: 'Divisi Informasi & Komunikasi', place: 'Ikatan Mahasiswa Aceh Selatan (IMAS)', text: 'Pengurus Ikatan Mahasiswa Aceh Selatan periode 2024–2025 di Divisi Informasi dan Komunikasi.' },
  { date: '2023 – 2024', title: 'PJ Musik Etnik', place: 'UKM Seni Budaya Meurah Silue · Universitas Malikussaleh', text: 'Pengurus Unit Kegiatan Mahasiswa Seni Budaya Meurah Silue periode 2023–2024, penanggung jawab Divisi Musik Etnik.' },
];
const certificates = [
  { title: 'Cyber Security', year: 'Oxford Home Study Centre', image: '' },
  { title: 'Mastering C++ (MATRIX)', year: 'Udemy', image: '' },
];
const processSteps = [
  ['01', 'THE PROBLEM', 'Memahami masalah dan kebutuhan pengguna sebelum menulis satu baris kode.'],
  ['02', 'THE PLAN', 'Merancang alur, struktur data, dan tampilan yang sesuai kebutuhan.'],
  ['03', 'THE BUILD', 'Menulis kode web atau mobile yang rapi dan mudah dikembangkan.'],
  ['04', 'THE TEST', 'Menguji, mencari bug, dan memperbaiki sampai semuanya berjalan.'],
  ['05', 'THE LAUNCH', 'Rilis, mengumpulkan masukan, lalu terus menyempurnakan.'],
];
const skills = ['Backend & REST API', 'Keamanan API & Transaksi', 'Java Spring Boot', 'PostgreSQL & MySQL', 'Docker & CI/CD', 'Web Development', 'three.js / WebGL', 'Android Development', 'Linux', 'Problem Solving', 'Komunikasi', 'Kerja Sama Tim'];
const software = [['java', 'Java'], ['springboot', 'Spring Boot'], ['postgresql', 'PostgreSQL'], ['mysql', 'MySQL'], ['docker', 'Docker'], ['github', 'GitHub Actions'], ['php', 'PHP'], ['ci', 'CodeIgniter 4'], ['javascript', 'JavaScript'], ['threejs', 'three.js'], ['cloudflare', 'Cloudflare Workers'], ['html', 'HTML'], ['css', 'CSS'], ['kotlin', 'Kotlin'], ['android', 'Android Studio'], ['cpp', 'C++']];
/* ===================================================================== */

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }}>{children}</Component>;
}

function MediaImage({ src, alt, className = '', priority = false, ...props }) {
  const [state, setState] = useState(src ? 'loading' : 'error');
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    if (!src) { setState('error'); return; }
    // Cached images can finish before React attaches onLoad.
    setState(img?.complete ? (img.naturalWidth ? 'loaded' : 'error') : 'loading');
  }, [src]);
  return <span className={`media-image ${state} ${className}`}>
    {state === 'error' && <span className="image-fallback"><span className="display">A.</span><span>Pratinjau tidak tersedia</span></span>}
    {src && <img ref={imgRef} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} width="960" height="600" onLoad={() => setState('loaded')} onError={() => setState('error')} {...props} />}
  </span>;
}

function Magnetic({ children, className = '', ...props }) {
  const enabled = useContext(MotionContext);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  return <motion.a className={className} style={{ x, y }} onPointerMove={e => {
    if (!enabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.12); y.set((e.clientY - r.top - r.height / 2) * 0.2);
  }} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

const NAV = [['portfolio', 'Karya'], ['about', 'Tentang'], ['experience', 'Perjalanan'], ['contact', 'Kontak']];

function Header({ enabled, onToggle }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <header className="site-header">
    <a className="wordmark" href="#home" aria-label="Ahmad Umraithi, beranda">UMRAITHI<span>✦</span></a>
    <nav className="desktop-nav" aria-label="Navigasi utama">{NAV.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>)}</nav>
    <div className="header-actions"><button className="motion-toggle" onClick={onToggle} aria-label={enabled ? 'Jeda animasi' : 'Aktifkan animasi'} aria-pressed={!enabled}>{enabled ? <Pause size={13} /> : <Play size={13} />}<span>Motion {enabled ? 'on' : 'off'}</span></button><a className="header-contact" href="#contact">Let’s talk <ArrowUpRight size={16} /></a><button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Tutup menu' : 'Buka menu'}>{open ? <X /> : <Menu />}</button></div>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Navigasi mobile" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{[['home', 'Beranda'], ...NAV].map(([id, label], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={18} /></a>)}</motion.nav>}</AnimatePresence>
  </header>;
}

function Hero({ onProject }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  return <section id="home" className="hero" ref={ref}>
    <div className="hero-top"><span>MAHASISWA TEKNIK INFORMATIKA<br/><span className="muted">BACKEND · WEB · MOBILE</span></span><span className="availability"><i />OPEN FOR COLLABORATION</span></div>
    <motion.div className="hero-title display" aria-hidden="true" style={enabled ? { y: titleY } : {}} initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.4, ease: EASE }}>PORTFOLIO</motion.div>
    <motion.div className="hero-portrait" style={enabled ? { y: portraitY, scale: portraitScale } : {}} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}><img src={PORTRAIT} alt="Tempat foto Ahmad Umraithi" width="1024" height="1536" fetchPriority="high" /></motion.div>
    <motion.div className="hero-intro" style={enabled ? { y: copyY } : {}} initial={enabled ? { opacity: 0, x: -35 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}>
      <p className="handwriting">Hello, I’m</p><h1 className="display">AHMAD<span>.</span></h1><p className="hero-role">BACKEND & WEB{' '}<br />DEVELOPER</p><p className="hero-description">Menulis kode. Membangun solusi.<br />Mahasiswa Teknik Informatika yang membangun backend perbankan dan pembayaran yang aman, website, dan aplikasi Android.</p>
      <Magnetic href="#portfolio" className="primary-link">Lihat karya saya <ArrowDown size={17}/></Magnetic>
      <span className="hero-location"><MapPin size={12} /> {LOCATION}</span>
    </motion.div>
    <motion.div className="hero-side" initial={enabled ? { opacity: 0, x: 30 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }}>
      <div className="hero-manifesto"><span className="crosshair" aria-hidden="true">✳</span><p>Every line of code.<br />A problem solved.</p></div>
      <div className="hero-stats"><div><span className="display">3.79</span><p>IPK DARI<br/>4.00</p></div><div><span className="display">{archive.length}</span><p>PROJECT<br/>DIBANGUN</p></div><div className="hero-award-stat"><span className="display">2</span><a href="#experience" aria-label="Lihat sertifikat Ahmad">SERTIFIKAT<ArrowUpRight size={12}/></a></div><a href={CV} download><Download size={16}/><span>DOWNLOAD CV</span></a></div>
    </motion.div>
    <div className="hero-bottom">{featured[0] ? <button className="reel-button" onClick={() => onProject(featured[0])}><span className="play-circle"><Play size={12} fill="currentColor" /></span>LIHAT PROJECT<span className="muted">{featured[0].title.toUpperCase()}</span></button> : <span />}<span className="hero-scroll">SCROLL TO DISCOVER <ArrowDown size={13}/></span><span className="edition">SELECTED WORK / 2022–2026</span></div>
  </section>;
}

function typeLabel(project) {
  if (project.type === 'render') return '3D BREAKDOWN';
  if (['youtube', 'drive'].includes(project.type)) return 'FILM / VIDEO';
  if (project.type === 'backend') return 'BACKEND · API';
  if (project.type === 'website') return 'WEBSITE';
  if (project.type === 'app') return 'MOBILE APP';
  if (project.type === 'web3') return 'WEB3';
  return 'STILL / IMAGE';
}

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const video = ['youtube', 'drive'].includes(project.type);
  return <motion.article ref={ref} className="project-card" layout initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.08 }} transition={{ duration: enabled ? 0.6 : 0, delay: (index % 3) * 0.06, ease: EASE }} exit={{ opacity: 0, scale: 0.96 }}>
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`Lihat ${project.title}`}><motion.div className="project-picture" style={enabled ? { y } : {}}><MediaImage src={project.image} alt={project.title}/></motion.div><span className="project-type">{typeLabel(project)}</span><span className="project-hover">{video ? <Play fill="currentColor" size={18}/> : <ArrowUpRight size={22}/>}</span><span className="project-frame" aria-hidden="true" /></button>
    <button className="project-caption" onClick={() => onOpen(project)}><span className="project-number display">{String(index + 1).padStart(2, '0')}</span><span><h3>{project.title}</h3><span className="project-category">{project.category}{project.year ? ` / ${project.year}` : ''}</span></span><ArrowUpRight size={20}/></button>
  </motion.article>;
}

function BrandStrip() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const loopWidth = useRef(0);
  const inView = useInView(ref);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!ref.current || showAll) return;
    const update = () => { loopWidth.current = ref.current?.querySelector('.brand-set')?.getBoundingClientRect().width || 0; };
    const observer = new ResizeObserver(update);
    observer.observe(ref.current); update();
    return () => observer.disconnect();
  }, [showAll]);
  useAnimationFrame((time, delta) => {
    if (!enabled || paused || interacting || !inView || showAll || !ref.current || !loopWidth.current) return;
    const el = ref.current;
    el.scrollLeft += Math.min(delta, 40) * 0.038;
    if (el.scrollLeft >= loopWidth.current) el.scrollLeft -= loopWidth.current;
  });
  const move = direction => { setPaused(true); ref.current?.scrollBy({ left: direction * ref.current.clientWidth * .7, behavior: enabled ? 'smooth' : 'instant' }); };
  return <Reveal className="brand-section"><div className="brand-heading"><p>BEEN PART OF<br/><strong>THE BIGGER PICTURE.</strong></p><div><button className="brand-all" onClick={() => setShowAll(v => !v)} aria-expanded={showAll} aria-controls="brand-collection">{showAll ? 'TAMPILKAN DERET' : `LIHAT SEMUA (${brands.length})`}{showAll ? <Minus size={14}/> : <Plus size={14}/>}</button>{!showAll && <><button className="icon-button brand-pause" aria-label={paused ? 'Putar animasi logo' : 'Jeda animasi logo'} aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? <Play size={13}/> : <Pause size={13}/>}</button><button className="icon-button" onClick={() => move(-1)} aria-label="Logo sebelumnya"><ChevronLeft size={17}/></button><button className="icon-button" onClick={() => move(1)} aria-label="Logo selanjutnya"><ChevronRight size={17}/></button></>}</div></div><div id="brand-collection" className={showAll ? 'brand-full-grid' : 'brand-viewport'} ref={ref} onPointerEnter={e => { if(e.pointerType==='mouse') setInteracting(true); }} onPointerLeave={() => setInteracting(false)} onPointerDown={() => setPaused(true)} onFocusCapture={() => setInteracting(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false); }} tabIndex={showAll ? undefined : 0} role={showAll ? 'list' : 'region'} aria-label="Logo organisasi dan project, geser untuk melihat semuanya">
      {showAll ? brands.map(b => <div className="brand-logo" key={b.file} role="listitem"><img src={`./Asset/svg/brand/${b.file}`} alt={b.name} title={b.name} width="150" height="60" loading="lazy"/><span>{b.name}</span></div>) : <div className="brand-rail">{[0,1].map(copy => <div className="brand-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>{brands.map(b => <div className="brand-logo" key={b.file}><img src={`./Asset/svg/brand/${b.file}`} alt={copy ? '' : b.name} title={b.name} width="150" height="60" loading="lazy" draggable="false"/></div>)}</div>)}</div>}
    </div></Reveal>;
}

function Portfolio({ onProject }) {
  const [category, setCategory] = useState('Semua');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [limit, setLimit] = useState(9);
  const results = archive.filter(p => (category === 'Semua' || p.category === category) && `${p.title} ${p.category} ${p.role}`.toLowerCase().includes(query.toLowerCase()));
  const projects = expanded || category !== 'Semua' || query ? results.slice(0, limit) : featured;
  return <section id="portfolio" className="portfolio section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">01 / SELECTED WORK</span><h2>KODE YANG BEKERJA<span className="accent">.</span></h2></div><button className="text-link" onClick={() => { if (expanded) { setExpanded(false); setCategory('Semua'); setQuery(''); } else { setExpanded(true); setLimit(9); } }}>{expanded ? 'KARYA PILIHAN' : 'SEMUA KARYA'}<ArrowRight size={21}/></button></Reveal>
    <Reveal className="portfolio-toolbar">
      <div className="filters" role="group" aria-label="Kategori karya">
        {categories.map(c => <button key={c} className={category === c ? 'selected' : ''} aria-pressed={category === c} onClick={() => { setCategory(c); setExpanded(true); setLimit(9); }}>{c}{c === category && <motion.span className="filter-line" layoutId="filter-line"/>}</button>)}
      </div>
      <label className="search-box"><Search size={15}/><span>Cari</span><input aria-label="Cari karya" type="search" placeholder="Judul atau kategori…" value={query} onChange={e => { setQuery(e.target.value); setExpanded(true); setLimit(9); }}/></label>
    </Reveal>
    <motion.div className="project-grid" layout><AnimatePresence mode="popLayout">{projects.map((p, i) => <ProjectCard key={p.category + p.title + p.media} project={p} index={i} onOpen={onProject}/>)}</AnimatePresence></motion.div>
    {projects.length === 0 && <div className="empty-state"><p>{query ? `Tidak ada karya untuk “${query}”.` : `Project ${category} segera ditambahkan.`}</p><button className="text-link" onClick={() => { setQuery(''); setCategory('Semua'); }}>Reset pencarian <X size={15}/></button></div>}
    {expanded && results.length > limit && <div className="load-more"><button className="outline-button" onClick={() => setLimit(v => v + 9)}>Tampilkan karya lainnya <Plus size={16}/></button><span>{projects.length} dari {results.length} karya</span></div>}
    {brands.length > 0 && <BrandStrip/>}
  </section>;
}

function About() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 75%'] });
  return <section id="about" className="about section-wrap" ref={ref}>
    <Reveal className="about-lead"><div><span className="eyebrow">02 / BEHIND THE CODE</span><h2 className="display">BUKAN SEKADAR KODE.<br/>TAPI CARA <span className="accent">MEMECAHKAN MASALAH.</span></h2></div><p>Saya Ahmad Umraithi, mahasiswa Teknik Informatika Universitas Malikussaleh asal Tapaktuan, Aceh Selatan. Saya punya minat kuat di dunia IT: membangun website dan aplikasi mobile, dan sekarang juga bekerja di ekosistem Web3.</p></Reveal>
    <div className="studio-grid">
      <Reveal className="education-panel"><h3 className="panel-heading">EDUCATION & SKILLS</h3><p className="eyebrow accent">PENDIDIKAN</p><div className="education-row"><strong>S1 Teknik Informatika, Universitas Malikussaleh</strong><span>2022 – SEKARANG</span><p>IPK 3.79/4.00 · Pemrograman Web, Sistem Manajemen Basis Data, Algoritma Pemrograman, Sistem Operasi, Grafika Komputer.</p></div><div className="education-row"><strong>SMA N Unggul Tapaktuan</strong><span>2019 – 2022</span><p>Jurusan MIPA.</p></div><div className="education-row"><strong>Sertifikasi & Kursus</strong><p>Oxford Home Study Centre · Udemy</p></div><p className="eyebrow accent skills-heading">TECH TOOLKIT</p><div className="skill-tags">{skills.map(s => <span key={s}>{s}</span>)}</div><div className="software-row">{software.map(([file, name]) => <img key={file} src={`./Asset/svg/tech/${file}.svg`} alt={name} title={name} loading="lazy" width="28" height="28"/>)}</div></Reveal>
      <div className="process-panel"><Reveal><h3 className="panel-heading">FROM IDEA TO WORKING APP</h3></Reveal><div className="process-list"><div className="process-track"><motion.div style={{ scaleY: enabled ? scrollYProgress : 1 }}/></div>{processSteps.map(([num, title, text], i) => <Reveal key={num} className="process-row" delay={i * 0.035}><span className="process-num display">{num}</span><span className="process-node"/><div><h4>{title}</h4><p>{text}</p></div></Reveal>)}</div></div>
      <Reveal className="quote-panel"><span className="quote-mark display">“</span><blockquote>Dari ide<br/>dan logika,<br/><em>sampai aplikasi<br/>yang bekerja.</em></blockquote><span className="handwriting">Ahmad</span><div className="quote-bottom">LET’S BUILD<br/>THE NEXT THING.<span className="quote-symbol" aria-hidden="true">✳</span></div></Reveal>
    </div>
  </section>;
}

function Journey({ onProject }) {
  const [open, setOpen] = useState(0);
  return <section id="experience" className="journey section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">03 / THE JOURNEY</span><h2>TERUS BELAJAR. TERUS MEMBANGUN<span className="accent">.</span></h2></div><a className="text-link" href={CV} download>RESUME<Download size={16}/></a></Reveal>
    <div className="journey-grid"><div className="experience-list">{experiences.map((job, i) => <Reveal className={`experience-row ${open === i ? 'is-open' : ''}`} key={job.title}><button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}><span className="experience-date">{job.date}</span><span><h3>{job.title}</h3><span className="experience-place">{job.place}</span></span>{open === i ? <Minus size={18}/> : <Plus size={18}/>}</button><AnimatePresence initial={false}>{open === i && <motion.div id={`job-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><p>{job.text}</p></motion.div>}</AnimatePresence></Reveal>)}</div>
    <Reveal className="awards-panel"><p className="eyebrow">CERTIFICATES</p><h3 className="display">KEEP<br/><span className="accent">LEARNING.</span></h3><div className="award-list">{certificates.map((cert, i) => <button key={cert.title} onClick={() => onProject({ ...cert, type: 'image', media: cert.image, category: 'Sertifikat', year: '', role: cert.year, description: `Sertifikat ${cert.title} dari ${cert.year}.` })}><span>{String(i + 1).padStart(2, '0')}</span><span>{cert.title}<small>{cert.year}</small></span><ArrowUpRight size={19}/></button>)}</div></Reveal></div>
  </section>;
}

function Contact({ onProject }) {
  const [sent, setSent] = useState(false);
  const send = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = `Halo Ahmad, saya ${data.get('name')}.\n\nJenis proyek: ${data.get('type')}\n${data.get('message')}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return <section id="contact" className="contact section-wrap">
    <div className="contact-grid"><Reveal className="contact-intro"><span className="eyebrow">04 / YOUR NEXT PROJECT</span><h2 className="display">LET’S WORK<br/>TOGETHER<span className="accent">.</span></h2><p>Punya ide website, aplikasi, atau project Web3?<br/>Mari bangun sesuatu yang benar-benar dipakai.</p><Magnetic href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="contact-cta"><span className="round-arrow"><ArrowUpRight size={21}/></span>MULAI PERCAKAPAN</Magnetic></Reveal>
    <Reveal className="contact-links" delay={0.1}><a href={`mailto:${EMAIL}`}><Mail/><span><small>EMAIL</small>{EMAIL}</span><ArrowUpRight size={16}/></a><a href={LINKEDIN.url} target="_blank" rel="noopener noreferrer"><Linkedin/><span><small>LINKEDIN</small>{LINKEDIN.handle}</span><ArrowUpRight size={16}/></a><a href={GITHUB} target="_blank" rel="noopener noreferrer"><ExternalLink/><span><small>GITHUB</small>KADAFERHIDUP</span><ArrowUpRight size={16}/></a><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"><Phone/><span><small>PHONE / WHATSAPP</small>{PHONE_DISPLAY}</span><ArrowUpRight size={16}/></a><div><MapPin/><span><small>BASED IN</small>Lhokseumawe, Aceh</span></div></Reveal>
    {featured[0] && <Reveal className="contact-reel" delay={0.2}><button onClick={() => onProject(featured[0])} aria-label={`Buka project ${featured[0].title}`}><div className="reel-screen"><span className="reel-screen-top">UMRAITHI✦<span>SELECTED / PROJECT</span></span><MediaImage src={featured[0]?.image} alt={featured[0].title}/><span className="reel-screen-title display">BUILD IT.<br/><span>SHIP IT.</span></span><span className="play-circle"><ArrowUpRight size={18}/></span></div><span className="reel-caption">TAP TO OPEN THE PROJECT.</span></button></Reveal>}</div>
    <Reveal><details className="project-brief"><summary>Ceritakan proyek Anda <Plus size={19}/></summary><form onSubmit={send}><label>Nama Anda<input name="name" required placeholder="Nama atau brand" autoComplete="name" maxLength="100"/></label><label>Jenis proyek<select name="type"><option>Website</option><option>Aplikasi Android</option><option>Web3 / Komunitas</option><option>Desain (Canva)</option><option>Kolaborasi lainnya</option></select></label><label className="brief-message">Tentang proyek<textarea name="message" required rows="3" placeholder="Ceritakan ide, kebutuhan, dan perkiraan waktunya…" maxLength="3000"/></label><button className="solid-button" type="submit">Lanjut ke WhatsApp <ArrowUpRight size={18}/></button><p className="form-note" role="status">{sent ? 'Draft pesan siap di WhatsApp. Tekan Kirim di sana untuk memulai percakapan.' : 'Brief akan dibuka sebagai draft pesan di WhatsApp.'}</p></form></details></Reveal>
  </section>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  const [renderMode, setRenderMode] = useState('final');
  const [shot, setShot] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [retried, setRetried] = useState(0);
  const enabled = useContext(MotionContext);
  const activeShot = project.type === 'render' ? project.renders[shot] : null;
  const embedType = activeShot?.video ? 'youtube' : activeShot?.drive ? 'drive' : project.type;
  const embedMedia = activeShot?.video || activeShot?.drive?.match(/\/d\/([^/]+)/)?.[1] || project.media;
  const isVideo = ['youtube', 'drive'].includes(embedType);
  const availableModes = [['layout', 'Layout'], ['solid', 'Solid'], ['material', 'Material'], ['lighting', 'Lighting'], ['final', 'Final render']].filter(([mode]) => activeShot?.[mode] && !(mode === 'solid' && activeShot.hideSolidMode));
  const effectiveMode = activeShot?.[renderMode] ? renderMode : availableModes[0]?.[0];
  const rendered = activeShot?.[effectiveMode] || activeShot?.image || project.image;
  const sourceUrl = embedType === 'youtube' ? `https://www.youtube.com/watch?v=${embedMedia}` : embedType === 'drive' ? `https://drive.google.com/file/d/${embedMedia}/view` : project.link || (project.type === 'render' ? rendered : project.type === 'website' ? project.media : '');
  const changeShot = next => { setMediaLoaded(false); setMediaFailed(false); setShot(next); };
  useEffect(() => {
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const listener = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = [...ref.current.querySelectorAll('button, a[href], input, select, textarea, iframe')].filter(n => !n.disabled && n.getClientRects().length);
        const first = nodes[0]; const last = nodes.at(-1);
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', listener);
    return () => { document.body.style.overflow = old; window.removeEventListener('keydown', listener); previous?.focus(); };
  }, [onClose]);
  useEffect(() => {
    if (!isVideo) return;
    const timer = setTimeout(() => { if (!mediaLoaded) setMediaFailed(true); }, 14000);
    return () => clearTimeout(timer);
  }, [mediaLoaded, retried, isVideo, embedMedia]);
  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div ref={ref} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex="-1" initial={enabled ? { y: 45, scale: 0.97 } : false} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="dialog-heading"><span className="eyebrow">{project.category} {project.year && ` / ${project.year}`}</span><button onClick={onClose} className="icon-button" aria-label="Tutup karya"><X/></button></div>
      <div className={`dialog-media ${!isVideo ? 'still' : ''}`}>
        {isVideo ? <>{!mediaLoaded && <div className="media-loading" role="status">{mediaFailed ? <><p>Preview belum bisa dimuat. Buka sumber aslinya untuk menonton.</p><button className="outline-button" onClick={() => { setMediaFailed(false); setMediaLoaded(false); setRetried(v => v + 1); }}>Coba lagi</button></> : <><span className={enabled ? 'loading-ring' : 'loading-ring paused'}/><p>Memuat video…</p></>}</div>}<iframe key={`${embedMedia}-${retried}`} src={embedType === 'youtube' ? `https://www.youtube-nocookie.com/embed/${embedMedia}?autoplay=1&rel=0` : `https://drive.google.com/file/d/${embedMedia}/preview`} title={project.title} width="1280" height="720" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onLoad={() => { setMediaLoaded(true); setMediaFailed(false); }} onError={() => setMediaFailed(true)}/></> : <MediaImage src={rendered} alt={project.title} priority/>}
      </div>
      {project.type === 'render' && (availableModes.length > 0 || project.renders.length > 1) && <div className="render-controls"><div role="group" aria-label="Tahap render">{availableModes.map(([mode, label]) => <button key={mode} className={effectiveMode === mode ? 'selected' : ''} onClick={() => setRenderMode(mode)} aria-pressed={effectiveMode === mode}>{label}</button>)}</div>{project.renders.length > 1 && <div className="shot-controls"><button className="icon-button" aria-label="Shot sebelumnya" onClick={() => changeShot((shot - 1 + project.renders.length) % project.renders.length)}><ChevronLeft/></button><span>SHOT {shot + 1} / {project.renders.length}</span><button className="icon-button" aria-label="Shot selanjutnya" onClick={() => changeShot((shot + 1) % project.renders.length)}><ChevronRight/></button></div>}</div>}
      <div className="dialog-description"><div><h2 id="dialog-title">{project.title}</h2>{project.role && <span className="accent">{project.role}</span>}<p>{project.description}</p></div><div className="dialog-links">{sourceUrl && sourceUrl !== project.repo && <a className="outline-button" href={sourceUrl} target="_blank" rel="noopener noreferrer">{['website', 'backend', 'web3'].includes(project.type) ? 'Buka project' : 'Buka sumber asli'}<ExternalLink size={15}/></a>}{project.repo && <a className="outline-button" href={project.repo} target="_blank" rel="noopener noreferrer">Lihat kode<ExternalLink size={15}/></a>}</div></div>
      {isVideo && <p className="embed-note">Jika video dibatasi oleh pemiliknya, gunakan “Buka sumber asli”.</p>}
    </motion.div>
  </motion.div>;
}

function App() {
  const reduced = useReducedMotion();
  const [motionOn, setMotionOn] = useState(() => { try { return localStorage.getItem('umraithi-motion') !== 'off'; } catch { return true; } });
  const enabled = motionOn && !reduced;
  const [project, setProject] = useState(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  useEffect(() => { document.documentElement.dataset.motion = enabled ? 'on' : 'off'; }, [enabled]);
  const toggle = () => { setMotionOn(!motionOn); try { localStorage.setItem('umraithi-motion', motionOn ? 'off' : 'on'); } catch {} };
  const close = React.useCallback(() => setProject(null), []);
  return <MotionContext.Provider value={enabled}>
    <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ ease: EASE }}>
      <a className="skip-link" href="#portfolio">Lewati ke karya</a>
      <motion.div className="reading-progress" style={{ scaleX: enabled ? progress : scrollYProgress }}/>
      <Header enabled={enabled} onToggle={toggle}/>
      <main>
        <Hero onProject={setProject}/>
        <Portfolio onProject={setProject}/>
        <About/>
        <Journey onProject={setProject}/>
        <Contact onProject={setProject}/>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#home">UMRAITHI<span>✦</span></a>
        <span>© {new Date().getFullYear()} AHMAD UMRAITHI. CODE WITH PURPOSE.</span>
        <div>
          <a href={LINKEDIN.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Ahmad Umraithi"><Linkedin size={17}/></a>
          <a href={`mailto:${EMAIL}`} aria-label="Email Ahmad Umraithi"><Mail size={17}/></a>
          <a href="#home" aria-label="Kembali ke atas"><ArrowUpRight size={18}/></a>
        </div>
      </footer>
      <AnimatePresence>{project && <ProjectDialog key={project.title} project={project} onClose={close}/>}</AnimatePresence>
    </MotionConfig>
  </MotionContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
