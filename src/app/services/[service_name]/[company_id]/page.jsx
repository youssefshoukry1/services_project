import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockData } from "../../../../../mockData";
import RelatedCompanies from "./RelatedCompanies";
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
  if (!listing) return { title: "Unternehmen nicht gefunden | ServiceHub" };
  return { title: `${listing.company.name} | ServiceHub`, description: listing.company.shortDesc };
}

export default async function CompanyDetailPage({ params }) {
  const { service_name: serviceName, company_id: companyId } = await params;
  const listing = getListing(serviceName, companyId);
  if (!listing) notFound();
  const { category, company } = listing;
  const city = company.address.split(", ").at(-1)?.replace(/^\d{5}\s+/, "");
  const relatedCompanies = mockData.companies
    .filter((item) => item.categoryId === category.id && item.id !== company.id)
    .sort((first, second) => {
      const firstIsLocal = first.address.endsWith(city);
      const secondIsLocal = second.address.endsWith(city);
      return Number(secondIsLocal) - Number(firstIsLocal);
    });

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Brotkrumennavigation">
          <Link href="/">Startseite</Link><span aria-hidden="true">/</span>
          <Link href="/services">Dienstleistungen</Link><span aria-hidden="true">/</span>
          <Link href={`/services/${category.id}`}>{category.title}</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{company.name}</span>
        </nav>

        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <header className={styles.hero}>
              <div className={styles.heroPhoto}>
                <Image src={company.image} alt={`${company.name}: Fachkraft bei der Arbeit`} fill sizes="(max-width: 849px) 100vw, 720px" className={styles.heroPhotoImage} priority />
              </div>
              <div className={styles.heroContent}>
                <div className={styles.logo}><Image src={company.logo} alt={`${company.name} Logo`} fill sizes="112px" className={styles.logoImage} /></div>
                <div className={styles.heroText}>
                  <h1>{company.name}</h1>
                  <p className={styles.address}>{company.address}</p>
                  <p className={styles.summary}>{company.shortDesc}</p>
                </div>
              </div>
            </header>

            <section className={styles.section} aria-labelledby="services-heading">
              <div className={styles.sectionTitle}>
                <h2 id="services-heading">Leistungen &amp; angegebene Preise</h2>
              </div>
              <ul className={styles.priceList}>
                {company.prices.map((item) => (
                  <li key={item.service}>
                    <span>{item.service}</span>
                    <strong>{item.price}</strong>
                  </li>
                ))}
              </ul>
              <p className={styles.priceNote}>Die Preise stammen aus dem Eintrag. Klären Sie Leistungsumfang, Steuern, Material, Anfahrt und Endpreis vor der Beauftragung direkt mit dem Unternehmen.</p>
            </section>
          </div>

          <aside className={styles.contact} aria-labelledby="contact-heading">
            <h2 id="contact-heading">{company.name} kontaktieren</h2>
            <p>Besprechen Sie Ihr Vorhaben und fordern Sie direkt ein Angebot an.</p>
            <a className={styles.primaryAction} href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone} anrufen</a>
            <a className={styles.secondaryAction} href={`mailto:${company.email}`}>E-Mail senden</a>
            <dl className={styles.details}>
              <div><dt>Adresse</dt><dd>{company.address}</dd></div>
              <div><dt>Telefon</dt><dd><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a></dd></div>
              <div><dt>E-Mail</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
              <div><dt>Webseite</dt><dd><a href={company.website} target="_blank" rel="noopener noreferrer">Webseite besuchen <span aria-hidden="true">↗</span></a></dd></div>
            </dl>
          </aside>
        </div>
        {relatedCompanies.length > 0 && (
          <section className={styles.related} aria-labelledby="related-heading">
            <h2 id="related-heading">Ähnliche Angebote</h2>
            <RelatedCompanies companies={relatedCompanies} categoryId={category.id} />
          </section>
        )}
        <Link className={styles.backLink} href={`/services/${category.id}`}>← Weitere Unternehmen für {category.title.toLowerCase()} ansehen</Link>
      </div>
    </main>
  );
}
