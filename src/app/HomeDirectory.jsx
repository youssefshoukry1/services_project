"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { mockData } from "../../mockData";
import styles from "./home-directory.module.css";

const labels = { painters: "Painting", cleaning: "Cleaning", auto_repair: "Auto repair" };
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
                  <span className={styles.dot} aria-hidden="true" />
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
                <Link key={company.id} href={`/services/${company.categoryId}#${company.id}`} className={styles.card}>
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
