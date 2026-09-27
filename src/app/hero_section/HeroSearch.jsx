"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { mockData } from "../../../mockData";

function rank(text, query) {
  const value = text.toLowerCase();
  if (value === query) return 4;
  if (value.startsWith(query)) return 3;
  if (value.includes(query)) return 2;
  return 0;
}

function findMatches(query) {
  const term = query.trim().toLowerCase();
  if (!term) return { categories: [], companies: [] };

  const categories = mockData.categories
    .map((category) => ({ ...category, score: Math.max(rank(category.title, term), rank(category.id.replaceAll("_", " "), term)) }))
    .filter((category) => category.score > 0)
    .sort((a, b) => b.score - a.score);

  const companies = mockData.companies
    .map((company) => ({
      ...company,
      score: Math.max(
        rank(company.name, term) ? rank(company.name, term) + 2 : 0,
        rank(company.shortDesc, term),
        ...company.prices.map((item) => rank(item.service, term) + (rank(item.service, term) ? 1 : 0)),
      ),
    }))
    .filter((company) => company.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return { categories, companies };
}

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) return;
    const timer = window.setTimeout(() => {
      setSearchedQuery(query.trim());
      setIsLoading(false);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event) => {
      if (!searchRef.current?.contains(event.target)) setIsOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const results = useMemo(() => findMatches(searchedQuery), [searchedQuery]);
  const hasResults = results.categories.length + results.companies.length > 0;
  const showResults = isOpen && Boolean(query.trim());

  function handleQueryChange(event) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    setIsOpen(Boolean(nextQuery.trim()));
    setIsLoading(Boolean(nextQuery.trim()));
    if (!nextQuery.trim()) setSearchedQuery("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const term = query.trim();
    if (!term) {
      inputRef.current?.focus();
      return;
    }
    setSearchedQuery(term);
    setIsLoading(false);
    setIsOpen(true);
  }

  return (
    <div ref={searchRef} className="hero-rise relative z-20 mx-auto mt-7 max-w-3xl [animation-delay:1.4s] sm:mt-10">
      <form role="search" onSubmit={handleSubmit} className="rounded-[1.5rem] border border-gray-200/80 bg-white p-2.5 shadow-[0_20px_60px_-24px_rgba(0,80,80,0.3)] sm:rounded-[1.75rem] sm:p-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl bg-gray-50 px-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[#008080]/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5 shrink-0 text-[#008080]" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m20 20-4-4" /></svg>
            <span className="sr-only">Search companies or services</span>
            <input ref={inputRef} name="search" type="search" autoComplete="off" value={query} onChange={handleQueryChange} onFocus={() => { if (query.trim()) setIsOpen(true); }} aria-controls="hero-search-results" aria-expanded={showResults} placeholder="Search a service or company" className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400 sm:text-base" />
          </label>
          <button type="submit" className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#008080] px-7 font-bold text-white shadow-lg shadow-teal-900/15 transition active:scale-[0.98] hover:bg-[#006f6f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008080] sm:min-h-14">
            {isLoading ? <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m20 20-4-4" /></svg>}
            {isLoading ? "Searching" : "Search"}
          </button>
        </div>
      </form>

      {showResults && (
        <div id="hero-search-results" className="absolute inset-x-0 top-full z-30 mt-3 max-h-[min(62vh,460px)] overflow-y-auto rounded-[1.35rem] border border-gray-100 bg-white p-3 text-left shadow-[0_25px_65px_-25px_rgba(15,23,42,0.32)] sm:p-4" aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <div className="space-y-2" role="status" aria-label="Searching services and companies">
              {[0, 1, 2].map((item) => <div key={item} className="flex animate-pulse items-center gap-3 rounded-xl bg-gray-50 p-3 motion-reduce:animate-none"><span className="size-10 rounded-lg bg-gray-200" /><span className="flex-1 space-y-2"><span className="block h-3 w-1/3 rounded bg-gray-200" /><span className="block h-2.5 w-2/3 rounded bg-gray-200" /></span></div>)}
              <span className="sr-only">Searching…</span>
            </div>
          ) : hasResults ? (
            <>
              <div className="mb-2 flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400"><span>Search results</span><span>{results.categories.length + results.companies.length} found</span></div>
              {results.categories.length > 0 && <div className="mb-2 space-y-1">{results.categories.map((category) => <Link key={category.id} href={`/services/${category.id}`} className="flex min-h-14 items-center gap-3 rounded-xl px-3 transition hover:bg-teal-50 focus-visible:bg-teal-50 focus-visible:outline-none"><span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-[#008080]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" /></svg></span><span className="flex-1"><strong className="block text-sm text-gray-900">{category.title}</strong><small className="text-xs text-gray-500">Service category</small></span><span className="text-[#008080]" aria-hidden="true">↗</span></Link>)}</div>}
              {results.companies.length > 0 && <div className="space-y-1 border-t border-gray-100 pt-2">{results.companies.map((company) => <Link key={company.id} href={`/services/${company.categoryId}#${company.id}`} className="flex min-h-16 items-center gap-3 rounded-xl px-3 transition hover:bg-teal-50 focus-visible:bg-teal-50 focus-visible:outline-none"><span className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50"><Image src={company.logo} alt="" fill sizes="44px" className="object-contain p-1" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-gray-900">{company.name}</strong><small className="block truncate text-xs text-gray-500">{company.shortDesc}</small></span><span className="text-[#008080]" aria-hidden="true">↗</span></Link>)}</div>}
            </>
          ) : (
            <div className="px-4 py-7 text-center"><div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-teal-50 text-[#008080]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m20 20-4-4M8.5 11h5" /></svg></div><p className="text-sm font-bold text-gray-900">No matches found</p><p className="mt-1 text-xs text-gray-500">Try a company name or another service.</p></div>
          )}
        </div>
      )}
    </div>
  );
}
