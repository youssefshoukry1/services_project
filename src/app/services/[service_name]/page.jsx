import Link from "next/link";
import { notFound } from "next/navigation";
import { mockData } from "../../../../mockData";
import CompanyDirectory from "./CompanyDirectory";
import styles from "./service-page.module.css";

const categoryDetails = {
  painters: {
    eyebrow: "Painting professionals",
    description: "Refresh your space with experienced painters for interiors, exteriors, and decorative finishes.",
    icon: "paint",
  },
  cleaning: {
    eyebrow: "Cleaning professionals",
    description: "Find dependable cleaning teams for homes, offices, windows, and demanding deep-clean projects.",
    icon: "sparkles",
  },
  auto_repair: {
    eyebrow: "Automotive professionals",
    description: "Connect with local mechanics for maintenance, diagnostics, tires, bodywork, and repairs.",
    icon: "car",
  },
};

function getServiceData(serviceName) {
  const category = mockData.categories.find((item) => item.id === serviceName);
  if (!category) return null;

  return {
    category,
    companies: mockData.companies.filter((company) => company.categoryId === category.id),
    details: categoryDetails[category.id],
  };
}

function CategoryIcon({ type }) {
  if (type === "paint") {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 5 4-4 4 4-4 4m-8.2 4.6 5.6-5.6 2.8 2.8-5.6 5.6m-2.8-2.8-5.7 5.7a2 2 0 0 0 2.8 2.8l5.7-5.7" />
    );
  }

  if (type === "car") {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 17v2m14-2v2M4 13l2-6h12l2 6m-15 4h14a2 2 0 0 0 2-2v-2H3v2a2 2 0 0 0 2 2Zm2-4h.01M17 13h.01" />
    );
  }

  return (
    <path strokeLinecap="round" strokeLinejoin="round" d="m12 2 1.3 4.7L18 8l-4.7 1.3L12 14l-1.3-4.7L6 8l4.7-1.3L12 2Zm7 12 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14ZM5 13l.9 3.1L9 17l-3.1.9L5 21l-.9-3.1L1 17l3.1-.9L5 13Z" />
  );
}

export function generateStaticParams() {
  return mockData.categories.map((category) => ({
    service_name: category.id,
  }));
}

export async function generateMetadata({ params }) {
  const { service_name: serviceName } = await params;
  const service = getServiceData(serviceName);

  if (!service) {
    return { title: "Service not found | ServiceHub" };
  }

  return {
    title: `${service.category.title} | ServiceHub`,
    description: service.details.description,
  };
}

export default async function ServicePage({ params }) {
  const { service_name: serviceName } = await params;
  const service = getServiceData(serviceName);

  if (!service) notFound();

  const listedServices = service.companies.reduce(
    (total, company) => total + company.prices.length,
    0,
  );

  return (
    <main className={styles.page}>
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Link href="/services">Services</Link>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span aria-current="page">{service.category.title}</span>
        </nav>


        <CompanyDirectory
          companies={service.companies}
          categoryTitle={service.category.title}
        />

        <section className={styles.valueSection} aria-labelledby="category-benefits">


          <div className={styles.features}>
            <article>
              <span className={styles.featureNumber}>01</span>
              <h3>Local options</h3>
              <p>Compare professionals currently available in this category.</p>
            </article>
            <article>
              <span className={styles.featureNumber}>02</span>
              <h3>Clear pricing</h3>
              <p>Review listed services and starting prices before reaching out.</p>
            </article>
            <article>
              <span className={styles.featureNumber}>03</span>
              <h3>Direct contact</h3>
              <p>Connect with each company using the details they provide.</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
