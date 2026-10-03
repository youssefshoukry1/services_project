import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockData } from "../../../../../mockData";
import styles from "./company-detail.module.css";

function getListing(serviceName, companyId) {
  const category = mockData.categories.find((item) => item.id === serviceName);
  const company = mockData.companies.find((item) => item.id === companyId && item.categoryId === serviceName);
  return category && company ? { category, company } : null;
}

export function generateStaticParams() {
  return mockData.companies.map((company) => ({ service_name: company.categoryId, company_id: company.id }));
}

export async function generateMetadata({ params }) {
  const { service_name: serviceName, company_id: companyId } = await params;
  const listing = getListing(serviceName, companyId);
  if (!listing) return { title: "Company not found | ServiceHub" };
  return { title: `${listing.company.name} | ServiceHub`, description: listing.company.shortDesc };
}

export default async function CompanyDetailPage({ params }) {
  const { service_name: serviceName, company_id: companyId } = await params;
  const listing = getListing(serviceName, companyId);
  if (!listing) notFound();
  const { category, company } = listing;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/services">Services</Link><span aria-hidden="true">/</span>
          <Link href={`/services/${category.id}`}>{category.title}</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{company.name}</span>
        </nav>

        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <header className={styles.hero}>
              <div className={styles.logo}><Image src={company.logo} alt={`${company.name} logo`} fill sizes="112px" className={styles.logoImage} priority /></div>
              <div className={styles.heroText}>
                <span className={styles.category}>{category.title}</span>
                <h1>{company.name}</h1>
                <p className={styles.address}>{company.address}</p>
                <p className={styles.summary}>{company.shortDesc}</p>
              </div>
            </header>

            <section className={styles.section} aria-labelledby="services-heading">
              <div className={styles.sectionTitle}>
                <h2 id="services-heading">Services &amp; listed prices</h2>
                <span>{company.prices.length} {company.prices.length === 1 ? "service" : "services"}</span>
              </div>
              <ul className={styles.priceList}>
                {company.prices.map((item) => (
                  <li key={item.service}>
                    <span>{item.service}</span>
                    <strong>{item.price}</strong>
                  </li>
                ))}
              </ul>
              <p className={styles.priceNote}>Prices are shown as provided in the listing. Ask the company to confirm the full scope, taxes, materials, travel costs, and final price before booking.</p>
            </section>
          </div>

          <aside className={styles.contact} aria-labelledby="contact-heading">
            <span className={styles.contactEyebrow}>Get in touch</span>
            <h2 id="contact-heading">Contact {company.name}</h2>
            <p>Discuss your project and request a detailed quote directly from the company.</p>
            <a className={styles.primaryAction} href={`tel:${company.phone.replace(/\s/g, "")}`}>Call {company.phone}</a>
            <a className={styles.secondaryAction} href={`mailto:${company.email}`}>Email company</a>
            <dl className={styles.details}>
              <div><dt>Address</dt><dd>{company.address}</dd></div>
              <div><dt>Phone</dt><dd><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a></dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
              <div><dt>Website</dt><dd><a href={company.website} target="_blank" rel="noopener noreferrer">Visit company website <span aria-hidden="true">↗</span></a></dd></div>
            </dl>
          </aside>
        </div>
        <Link className={styles.backLink} href={`/services/${category.id}`}>← Browse more {category.title.toLowerCase()} companies</Link>
      </div>
    </main>
  );
}
