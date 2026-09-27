"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./service-page.module.css";

const sortOptions = [
  { value: "recommended", label: "Recommended", detail: "Original listing order" },
  { value: "alphabetical", label: "Name A–Z", detail: "Browse alphabetically" },
  { value: "price", label: "Lowest starting price", detail: "Budget-friendly first" },
];

function getLowestPrice(company) {
  const prices = company.prices
    .map((item) => Number(item.price.match(/[\d.]+/)?.[0]))
    .filter(Number.isFinite);

  return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
}

function Icon({ type }) {
  const paths = {
    location: <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2.5l-4-1.5-1.3 2.1a13 13 0 0 1-8.8-8.8L9 7 7.5 3Z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.5 12 13l9-6.5M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />,
    external: <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6m0-6-9 9m7 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

export default function CompanyDirectory({ companies, categoryTitle }) {
  const directoryRef = useRef(null);
  const sortRef = useRef(null);
  const sortButtonRef = useRef(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (!sortOpen) return;
    const onPointerDown = (event) => {
      if (!sortRef.current?.contains(event.target)) setSortOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setSortOpen(false);
      sortButtonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sortOpen]);

  const visibleCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = companies.filter((company) =>
      [company.name, company.address, company.shortDesc].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );

    if (sortBy === "alphabetical") {
      return [...matches].sort((first, second) => first.name.localeCompare(second.name));
    }

    if (sortBy === "price") {
      return [...matches].sort((first, second) => getLowestPrice(first) - getLowestPrice(second));
    }

    return matches;
  }, [companies, query, sortBy]);

  useEffect(() => {
    const directory = directoryRef.current;
    if (!directory) return;

    const cards = directory.querySelectorAll("[data-company-card]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      cards.forEach((card) => card.classList.add(styles.companyVisible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.companyVisible);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5%" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [visibleCompanies]);

  return (
    <section ref={directoryRef} id="companies" className={styles.directory} aria-labelledby="directory-heading">
      <header className={styles.directoryHeading}>
        <div>
          <span>Available near you</span>
          <h2 id="directory-heading">Choose your professional.</h2>
        </div>
        <p>
          {companies.length} companies offering {categoryTitle.toLowerCase()} services.
        </p>
      </header>

      <div className={styles.directoryTools}>
        <label className={styles.searchBox}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-4-4" />
          </svg>
          <span className="sr-only">Search companies</span>
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by company or area"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          )}
        </label>

        <div ref={sortRef} className={styles.sortWrap}>
          <button ref={sortButtonRef} type="button" className={styles.sortBox} aria-label={`Sort companies: ${sortOptions.find((option) => option.value === sortBy).label}`} aria-expanded={sortOpen} aria-controls="company-sort-options" onClick={() => setSortOpen((open) => !open)}>
            <span className={styles.sortLabel}>Sort</span>
            <span className={styles.sortValue}>{sortOptions.find((option) => option.value === sortBy).label}</span>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" />
            </svg>
          </button>
          {sortOpen && (
            <div id="company-sort-options" className={styles.sortMenu}>
              {sortOptions.map((option) => (
                <button key={option.value} type="button" className={`${styles.sortOption} ${sortBy === option.value ? styles.sortSelected : ""}`} aria-pressed={sortBy === option.value} onClick={() => { setSortBy(option.value); setSortOpen(false); sortButtonRef.current?.focus(); }}>
                  <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                  {sortBy === option.value && <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4 10 4 4 8-8" /></svg>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className={styles.resultCount} aria-live="polite">
        {visibleCompanies.length} {visibleCompanies.length === 1 ? "company" : "companies"} found
      </p>

      {visibleCompanies.length > 0 ? (
        <div className={styles.companyGrid}>
          {visibleCompanies.map((company, index) => (
            <article
              id={company.id}
              data-company-card
              className={styles.companyReveal}
              style={{ "--company-delay": `${(index % 2) * 110}ms` }}
              key={company.id}
            >
              <div className={styles.companyCard}>
              <header className={styles.companyHeader}>
                <div className={styles.companyLogo}>
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    fill
                    sizes="64px"
                    className={styles.companyLogoImage}
                  />
                </div>
                <div className={styles.companyIdentity}>
                  <div className={styles.companyStatus}>
                    <span aria-hidden="true" />
                    Listed professional
                  </div>
                  <h3>{company.name}</h3>
                </div>
              </header>

              <p className={styles.companyDescription}>{company.shortDesc}</p>

              <div className={styles.location}>
                <Icon type="location" />
                <span>{company.address}</span>
              </div>

              <div className={styles.pricePanel}>
                <div className={styles.priceHeading}>
                  <span>Services &amp; pricing</span>
                  <span>{company.prices.length} options</span>
                </div>
                <ul>
                  {company.prices.map((item) => (
                    <li key={item.service}>
                      <span>{item.service}</span>
                      <strong>{item.price}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              <footer className={styles.companyActions}>
                <a className={styles.callButton} href={`tel:${company.phone.replace(/\s/g, "")}`}>
                  <Icon type="phone" />
                  Call now
                </a>
                <a className={styles.iconButton} href={`mailto:${company.email}`} aria-label={`Email ${company.name}`}>
                  <Icon type="mail" />
                </a>
                <a className={styles.websiteButton} href={company.website} target="_blank" rel="noreferrer">
                  Website
                  <Icon type="external" />
                </a>
              </footer>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-4-4M8.5 11h5" />
            </svg>
          </div>
          <h3>No companies found</h3>
          <p>Try a different company name or area.</p>
          <button type="button" onClick={() => setQuery("")}>Clear search</button>
        </div>
      )}
    </section>
  );
}
