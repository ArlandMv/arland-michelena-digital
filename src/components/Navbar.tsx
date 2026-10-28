import React, { useState, useEffect } from 'react';
import { Menu, X, User, ArrowUpRight } from 'lucide-react';
import { WHATSAPP_URL } from '../config/contact';
import { HERO_DATA } from '../data/portfolioData';

interface NavbarProps {
  onOpenSchedule: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSchedule }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['servicios', 'trabajo', 'capacidades', 'proceso', 'sobre-mi', 'contacto'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Servicios', href: '#servicios', id: 'servicios' },
    { label: 'Trabajo', href: '#trabajo', id: 'trabajo' },
    { label: 'Capacidades', href: '#capacidades', id: 'capacidades' },
    { label: 'Proceso', href: '#proceso', id: 'proceso' },
    { label: 'Sobre mí', href: '#sobre-mi', id: 'sobre-mi' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-[#0D0D0F]/95 backdrop-blur-md border-[#292930] shadow-lg shadow-black/40'
          : 'bg-[#0D0D0F]/85 backdrop-blur-sm border-[#292930]'
      }`}
    >
      <div className="h-20 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <a
            id="brand-logo-link"
            href="#"
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="relative h-8 w-8 rounded bg-[#1B1B21] border border-[#292930] p-1 flex items-center justify-center overflow-hidden group-hover:border-[#B66A43] transition-colors">
              <img
                src={HERO_DATA.logoUrl}
                alt="ARLAND Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  // Fallback if network blocked
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-[#B67ABA] font-bold text-xs tracking-tighter absolute">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['IBM_Plex_Sans'] font-semibold text-[16px] text-[#F4F1ED] tracking-[-0.01em] leading-none group-hover:text-[#B67ABA] transition-colors">
                {HERO_DATA.name}
              </span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#A8A6AD] tracking-normal leading-tight mt-1">
                {HERO_DATA.title}
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav */}
        <nav
          id="desktop-navigation"
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 font-['IBM_Plex_Sans']"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                id={`nav-link-${item.id}`}
                href={item.href}
                className={`text-[14px] transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#B67ABA] font-semibold'
                    : 'text-[#d3c1cf] hover:text-[#F4F1ED]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B67ABA] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <a
            id="header-cta-button"
            href="#contacto"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#7A2E84] text-[#F4F1ED] font-['IBM_Plex_Sans'] text-[14px] font-semibold rounded-[6px] border border-[#292930] hover:border-[#B66A43] hover:bg-[#67276B] transition-all focus:outline-none shadow-sm cursor-pointer"
          >
            Hablemos de tu proyecto
          </a>

          <button
            id="header-profile-icon"
            type="button"
            // Agenda deshabilitada hasta implementar agenda real (ver .docs/016-agenda-reuniones.md).
            // Antes: onClick={onOpenSchedule}
            disabled
            aria-disabled="true"
            title="Agenda en desarrollo"
            aria-label="Agenda en desarrollo"
            className="w-8 h-8 rounded-full bg-[#7A2E84] flex items-center justify-center text-[#F4F1ED] focus:outline-none cursor-not-allowed opacity-50"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F4F1ED] hover:text-[#B66A43] focus:outline-none"
            aria-label="Abrir menú móvil"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden bg-[#0D0D0F] border-b border-[#292930] px-5 py-5 flex flex-col gap-3 shadow-xl"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 text-sm rounded ${
                activeSection === item.id
                  ? 'bg-[#1B1B21] text-[#B67ABA] font-semibold'
                  : 'text-[#d3c1cf] hover:bg-[#141418] hover:text-[#F4F1ED]'
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[#292930] flex flex-col gap-2">
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-[#7A2E84] text-[#F4F1ED] text-sm font-semibold rounded-[6px] border border-[#292930]"
            >
              Hablemos de tu proyecto
            </a>
            {/* Antes abría ScheduleModal (onOpenSchedule); ahora WhatsApp. Ver .docs/016-agenda-reuniones.md */}
            <a
              id="mobile-whatsapp-cta"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 bg-[#1B1B21] hover:bg-[#292930] text-[#B66A43] text-sm font-semibold rounded-[6px] border border-[#292930] flex items-center justify-center gap-1.5"
            >
              <span>Conversemos por WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
