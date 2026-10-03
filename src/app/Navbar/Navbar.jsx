"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./navbar.module.css";
import NavbarSearch from "./NavbarSearch";
import ServiceIcon from "../ServiceIcon";

const services = [
  { name: "Malerarbeiten", detail: "Wände & Oberflächen", href: "/services/painters", icon: "painters" },
  { name: "Reinigung", detail: "Zuhause & Büro", href: "/services/cleaning", icon: "cleaning" },
  { name: "Autoreparatur", detail: "Service für Ihr Auto", href: "/services/auto_repair", icon: "auto_repair" },
];

function Chevron() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDienstleistungenOpen, setIsDienstleistungenOpen] = useState(false);
  const servicesRef = useRef(null);
  const servicesButtonRef = useRef(null);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 80);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    setIsDienstleistungenOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isDienstleistungenOpen) return;

    const closeOnOutsidePress = (event) => {
      if (!servicesRef.current?.contains(event.target)) setIsDienstleistungenOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setIsDienstleistungenOpen(false);
      servicesButtonRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isDienstleistungenOpen]);

  const servicesActive = pathname.startsWith("/services");

  return (
    <header className={`${styles.shell} ${isScrolled ? styles.scrolled : ""}`}>
      <nav aria-label="Hauptnavigation" className={styles.nav}>
        <Link href="/" className={styles.logo} aria-label="ServiceHub Startseite">
          Service<span>Hub</span>
        </Link>

        <div className={styles.items}>
          <div
            ref={servicesRef}
            className={styles.servicesWrap}
            onMouseEnter={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setIsDienstleistungenOpen(true);
            }}
            onMouseLeave={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setIsDienstleistungenOpen(false);
            }}
          >
            <button
              ref={servicesButtonRef}
              type="button"
              className={`${styles.navLink} ${styles.servicesButton} ${servicesActive ? styles.active : ""}`}
              aria-expanded={isDienstleistungenOpen}
              aria-controls="navbar-services-menu"
              onClick={() => setIsDienstleistungenOpen((open) => !open)}
            >
              Leistungen
              <Chevron />
            </button>

            {isDienstleistungenOpen && (
              <div id="navbar-services-menu" className={styles.dropdown}>
                <div className={styles.dropdownHeading}>Dienstleistungen entdecken</div>
                {services.map((service) => (
                  <Link key={service.href} href={service.href} onClick={() => setIsDienstleistungenOpen(false)} className={styles.serviceItem}>
                    <ServiceIcon type={service.icon} className={styles.serviceIcon} />
                    <span>
                      <strong>{service.name}</strong>
                      <small>{service.detail}</small>
                    </span>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ))}
                <Link href="/services" onClick={() => setIsDienstleistungenOpen(false)} className={styles.viewAll}>
                  Alle Dienstleistungen ansehen
                </Link>
              </div>
            )}
          </div>

        </div>
        <NavbarSearch isScrolled={isScrolled} />
        <Link href="/add-company" className={styles.cta} aria-label="Unternehmenseintrag vorbereiten">
          <span className={styles.ctaFull}>Eintrag vorbereiten</span>
          <span className={styles.ctaCompact}>Eintrag erstellen</span>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </nav>
    </header>
  );
}
