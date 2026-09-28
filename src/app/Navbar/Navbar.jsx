"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./navbar.module.css";
import NavbarSearch from "./NavbarSearch";

const services = [
  { name: "Painting", detail: "Walls & finishes", href: "/services/painters" },
  { name: "Cleaning", detail: "Home & workspace", href: "/services/cleaning" },
  { name: "Auto Repair", detail: "Care for your car", href: "/services/auto_repair" },
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
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const servicesButtonRef = useRef(null);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 80);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    setIsServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isServicesOpen) return;

    const closeOnOutsidePress = (event) => {
      if (!servicesRef.current?.contains(event.target)) setIsServicesOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setIsServicesOpen(false);
      servicesButtonRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isServicesOpen]);

  const servicesActive = pathname.startsWith("/services");

  return (
    <header className={`${styles.shell} ${isScrolled ? styles.scrolled : ""}`}>
      <nav aria-label="Main navigation" className={styles.nav}>
        <Link href="/" className={styles.logo} aria-label="ServiceHub home">
          Service<span>Hub</span>
        </Link>

        <div className={styles.items}>
          <div
            ref={servicesRef}
            className={styles.servicesWrap}
            onMouseEnter={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setIsServicesOpen(true);
            }}
            onMouseLeave={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setIsServicesOpen(false);
            }}
          >
            <button
              ref={servicesButtonRef}
              type="button"
              className={`${styles.navLink} ${styles.servicesButton} ${servicesActive ? styles.active : ""}`}
              aria-expanded={isServicesOpen}
              aria-controls="navbar-services-menu"
              onClick={() => setIsServicesOpen((open) => !open)}
            >
              Services
              <Chevron />
            </button>

            {isServicesOpen && (
              <div id="navbar-services-menu" className={styles.dropdown}>
                <div className={styles.dropdownHeading}>Explore services</div>
                {services.map((service) => (
                  <Link key={service.href} href={service.href} onClick={() => setIsServicesOpen(false)} className={styles.serviceItem}>
                    <span className={styles.serviceDot} aria-hidden="true" />
                    <span>
                      <strong>{service.name}</strong>
                      <small>{service.detail}</small>
                    </span>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ))}
                <Link href="/services" onClick={() => setIsServicesOpen(false)} className={styles.viewAll}>
                  View all services
                </Link>
              </div>
            )}
          </div>

        </div>
        <NavbarSearch isScrolled={isScrolled} />
        <Link href="/add-company" className={styles.cta} aria-label="Add Company - Free">
          <span className={styles.ctaFull}>Add Company - Free</span>
          <span className={styles.ctaCompact}>Add Free</span>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </nav>
    </header>
  );
}
