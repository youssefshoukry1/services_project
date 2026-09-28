import Image from "next/image";
import Link from "next/link";
import { mockData } from "../../mockData";
import styles from "./home-directory.module.css";

const serviceDetails = {
  painters: { label: "Painting", description: "Fresh finishes for every space." },
  cleaning: { label: "Cleaning", description: "A spotless home or workplace." },
  auto_repair: { label: "Auto repair", description: "Reliable care for your car." },
};

export default function HomeDirectory() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.intro}>
          <span className={styles.eyebrow}>Explore ServiceHub</span>
          <h1>Find the right local professional.</h1>
          <p>Browse services and connect directly with companies.</p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label="Service categories">
            <div className={styles.sidebarHeading}>Services</div>
            <nav className={styles.serviceNav} aria-label="Jump to service">
              {mockData.categories.map((category) => (
                <a key={category.id} href={`#${category.id}`} className={styles.serviceNavLink}>
                  <span className={styles.navDot} aria-hidden="true" />
                  <span>{serviceDetails[category.id].label}</span>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              ))}
            </nav>
          </aside>

          <div className={styles.rows}>
            {mockData.categories.map((category) => {
              const details = serviceDetails[category.id];
              const companies = mockData.companies.filter((company) => company.categoryId === category.id);

              return (
                <section id={category.id} className={styles.section} aria-labelledby={`${category.id}-heading`} key={category.id}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span>{companies.length} companies</span>
                      <h2 id={`${category.id}-heading`}>{details.label}</h2>
                      <p>{details.description}</p>
                    </div>
                    <Link href={`/services/${category.id}`} className={styles.viewAll}>View all <span aria-hidden="true">↗</span></Link>
                  </div>

                  <div className={styles.scroller} aria-label={`${details.label} companies`} tabIndex={0}>
                    <div className={styles.track}>
                      {companies.map((company) => (
                        <Link key={company.id} href={`/services/${category.id}#${company.id}`} className={styles.card}>
                          <div className={styles.art}>
                            <Image src={company.logo} alt="" fill sizes="(max-width: 699px) 170px, 200px" className={styles.artLogo} />
                          </div>
                          <div className={styles.cardBody}>
                            <span className={styles.location}>{company.address}</span>
                            <h3>{company.name}</h3>
                            <p>{company.shortDesc}</p>
                            <span className={styles.cardFoot}>Explore company <span aria-hidden="true">↗</span></span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
