import Image from "next/image";
import Link from "next/link";
import { mockData } from "../../../mockData";
import styles from "./services.module.css";

const presentation = {
  painters: {
    label: "Painting",
    description: "Interior, exterior, decorative finishes, and specialist coatings.",
    image: "/images/services/painting-service.webp",
    alt: "Paint roller, paint can, and brush",
  },
  cleaning: {
    label: "Cleaning",
    description: "Home, office, glass, eco-friendly, and industrial cleaning.",
    image: "/images/services/cleaning-service.webp",
    alt: "Professional cleaning tools",
  },
  auto_repair: {
    label: "Auto repair",
    description: "Maintenance, diagnostics, tires, transmissions, and bodywork.",
    image: "/images/services/car-repair-service.webp",
    alt: "Car and professional repair tools",
  },
};

export const metadata = {
  title: "Browse Services | ServiceHub",
  description: "Browse trusted local painting, cleaning, and auto repair professionals.",
};

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span aria-current="page">Services</span>
        </nav>

        <header className={styles.hero}>
          <span className={styles.eyebrow}>Find the right professional</span>
          <h1>What can we help with?</h1>
          <p>Explore local services, compare clear pricing, and contact companies directly.</p>
        </header>

        <section className={styles.grid} aria-label="Service categories">
          {mockData.categories.map((category, index) => {
            const item = presentation[category.id];
            const companyCount = mockData.companies.filter(
              (company) => company.categoryId === category.id,
            ).length;

            return (
              <article className={styles.card} style={{ "--delay": `${index * 110}ms` }} key={category.id}>
                <Link href={`/services/${category.id}`} aria-label={`Browse ${category.title}`}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 699px) 92vw, (max-width: 1049px) 46vw, 360px"
                      className={styles.image}
                    />
                    <div className={styles.count}>{companyCount} companies</div>
                  </div>
                  <div className={styles.content}>
                    <span>{item.label}</span>
                    <h2>{category.title}</h2>
                    <p>{item.description}</p>
                    <div className={styles.action}>
                      Explore service
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
