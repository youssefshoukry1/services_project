"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { mockData } from "../../mockData";
import styles from "./home-directory.module.css";

const labels = { painters: "Painting", cleaning: "Cleaning", auto_repair: "Auto repair" };

function ServiceIcon({ type }) {
  const paths = {
    all: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    painters: <><path d="M4 5h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M18 8h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-8v4m0 0v4" /></>,
    cleaning: <><path d="m4 20 8-8m-1-7 1.3 3.7L16 10l-3.7 1.3L11 15l-1.3-3.7L6 10l3.7-1.3L11 5Z" /><path d="m19 3 .6 1.4L21 5l-1.4.6L19 7l-.6-1.4L17 5l1.4-.6L19 3Z" /></>,
    auto_repair: <><path d="M5 17v2m14-2v2M4 13l2-6h12l2 6M3 13h18v4H3v-4Z" /><path d="M7 15h.01M17 15h.01" /></>,
  };
  return <svg className={styles.filterIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}
const mixedCompanies = Array.from(
  { length: Math.max(...mockData.categories.map((item) => mockData.companies.filter((company) => company.categoryId === item.id).length)) },
  (_, index) => mockData.categories.map((item) => mockData.companies.filter((company) => company.categoryId === item.id)[index]).filter(Boolean),
).flat();

export default function HomeDirectory() {
  const [category, setCategory] = useState("all");
  const companies = category === "all" ? mixedCompanies : mockData.companies.filter((company) => company.categoryId === category);
  const filters = [{ id: "all", title: "All services" }, ...mockData.categories.map((item) => ({ id: item.id, title: labels[item.id] ?? item.title }))];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.intro}>
          <span className={styles.eyebrow}>Explore ServiceHub</span>
          <h1>Find the right local professional.</h1>
          <p>Browse services and connect directly with companies.</p>
        </header>
        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label="Service filters">
            <div className={styles.sidebarHeading}>Services</div>
            <nav className={styles.serviceNav} aria-label="Filter by service">
              {filters.map((filter) => (
                <button key={filter.id} type="button" className={`${styles.filter} ${category === filter.id ? styles.active : ""}`} aria-pressed={category === filter.id} onClick={() => setCategory(filter.id)}>
                  <ServiceIcon type={filter.id} />
                  <span>{filter.title}</span>
                  <span className={styles.filterCount}>{filter.id === "all" ? mockData.companies.length : mockData.companies.filter((company) => company.categoryId === filter.id).length}</span>
                </button>
              ))}
            </nav>
          </aside>
          <section className={styles.results} aria-labelledby="results-heading">
            <header className={styles.resultsHeading}>
              <span className={styles.resultCount} aria-live="polite">{companies.length} {companies.length === 1 ? "company" : "companies"}</span>
              <h2 id="results-heading">{filters.find((filter) => filter.id === category)?.title}</h2>
            </header>
            <div className={styles.grid}>
              {companies.map((company) => (
                <Link key={company.id} href={`/services/${company.categoryId}/${company.id}`} className={styles.card}>
                  <div className={styles.art}><Image src={company.logo} alt="" fill sizes="(max-width: 599px) 90vw, (max-width: 999px) 42vw, 260px" className={styles.artLogo} /></div>
                  <div className={styles.cardBody}>
                    <span className={styles.category}>{labels[company.categoryId] ?? company.categoryId}</span>
                    <h3>{company.name}</h3>
                    <span className={styles.location}>{company.address}</span>
                    <p>{company.shortDesc}</p>
                    <span className={styles.cardFoot}>Explore company <span aria-hidden="true">↗</span></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
