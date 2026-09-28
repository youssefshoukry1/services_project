"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { mockData } from "../../../mockData";
import styles from "./navbar-search.module.css";

const normalize = (value) => value.trim().toLowerCase();

function getResults(search, location) {
  const term = normalize(search);
  const area = normalize(location);
  if (!term && !area) return { categories: [], companies: [] };

  const categories = area ? [] : mockData.categories.filter((category) =>
    term && `${category.title} ${category.id.replaceAll("_", " ")}`.toLowerCase().includes(term),
  );

  const companies = mockData.companies
    .filter((company) => {
      const category = mockData.categories.find((item) => item.id === company.categoryId);
      const searchable = [company.name, company.shortDesc, category?.title, ...company.prices.map((item) => item.service)].join(" ").toLowerCase();
      return (!term || searchable.includes(term)) && (!area || company.address.toLowerCase().includes(area));
    })
    .sort((a, b) => {
      const score = (company) => (company.name.toLowerCase().startsWith(term) ? 2 : company.name.toLowerCase().includes(term) ? 1 : 0);
      return score(b) - score(a) || a.name.localeCompare(b.name);
    });

  return { categories, companies };
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m20 20-4-4" /></svg>;
}

export default function NavbarSearch({ isScrolled }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState({ search: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const wrapRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!search.trim() && !location.trim()) return;
    const timer = window.setTimeout(() => {
      setSubmitted({ search, location });
      setLoading(false);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [search, location]);

  useEffect(() => {
    if (!resultsOpen && !expanded) return;
    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) {
        setResultsOpen(false);
        setExpanded(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setResultsOpen(false);
        if (isScrolled) setExpanded(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [resultsOpen, expanded, isScrolled]);

  useEffect(() => {
    if (!isScrolled) setExpanded(false);
  }, [isScrolled]);

  useEffect(() => {
    if (isScrolled && expanded) searchInputRef.current?.focus();
  }, [isScrolled, expanded]);

  const results = useMemo(() => getResults(submitted.search, submitted.location), [submitted]);
  const count = results.categories.length + results.companies.length;
  const hasQuery = Boolean(search.trim() || location.trim());

  function update(field, value) {
    if (field === "search") setSearch(value);
    else setLocation(value);
    setLoading(Boolean((field === "search" ? value : search).trim() || (field === "location" ? value : location).trim()));
    setResultsOpen(Boolean((field === "search" ? value : search).trim() || (field === "location" ? value : location).trim()));
    if (!(field === "search" ? value : search).trim() && !(field === "location" ? value : location).trim()) setSubmitted({ search: "", location: "" });
  }

  function submit(event) {
    event.preventDefault();
    if (!hasQuery) { searchInputRef.current?.focus(); return; }
    setSubmitted({ search, location });
    setLoading(false);
    setResultsOpen(true);
  }

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${isScrolled ? styles.compact : ""}`}>
      {isScrolled && <button type="button" className={styles.openButton} aria-label="Open search" aria-expanded={expanded} onClick={() => { setExpanded((open) => !open); setResultsOpen(false); }}><SearchIcon /><span>Search</span></button>}
      {(!isScrolled || expanded) && (
        <div className={styles.panel}>
          <form role="search" className={styles.form} onSubmit={submit}>
            <label className={styles.field}>
              <span className="sr-only">Service or company</span>
              <SearchIcon />
              <input ref={searchInputRef} type="text" inputMode="search" autoComplete="off" value={search} onChange={(event) => update("search", event.target.value)} onFocus={() => { if (hasQuery) setResultsOpen(true); }} placeholder="Service or company" />
            </label>
            <label className={`${styles.field} ${styles.locationField}`}>
              <span className="sr-only">City or area</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></svg>
              <input type="text" autoComplete="address-level2" value={location} onChange={(event) => update("location", event.target.value)} onFocus={() => { if (hasQuery) setResultsOpen(true); }} placeholder="City or area" />
            </label>
            <button type="submit" className={styles.submit} aria-label="Search services and companies">{loading ? <span className={styles.spinner} aria-hidden="true" /> : <SearchIcon />}<span>Search</span></button>
          </form>

          {resultsOpen && hasQuery && (
            <div className={styles.results} role="region" aria-label="Search results" aria-live="polite" aria-busy={loading}>
              {loading ? <div className={styles.skeletons} role="status" aria-label="Searching">{[0, 1, 2, 3].map((item) => <div key={item}><span /><span /></div>)}</div> : count ? <>
                <div className={styles.resultsHeading}><span>Results</span><span>{count} found</span></div>
                {results.categories.map((category) => <Link key={category.id} href={`/services/${category.id}`} className={styles.result} onClick={() => { setResultsOpen(false); setExpanded(false); }}><span className={styles.categoryIcon}><SearchIcon /></span><span className={styles.resultText}><strong>{category.title}</strong><small>Service category</small></span><span aria-hidden="true">↗</span></Link>)}
                {results.companies.map((company) => <Link key={company.id} href={`/services/${company.categoryId}#${company.id}`} className={styles.result} onClick={() => { setResultsOpen(false); setExpanded(false); }}><span className={styles.logo}><Image src={company.logo} alt="" fill sizes="42px" /></span><span className={styles.resultText}><strong>{company.name}</strong><small>{company.address}</small></span><span aria-hidden="true">↗</span></Link>)}
              </> : <div className={styles.empty}><strong>No matches found</strong><span>Try another service, company, or area.</span></div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
