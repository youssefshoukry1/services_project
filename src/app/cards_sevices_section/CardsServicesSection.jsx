"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./cards-services.module.css";

const services = [
  {
    number: "01",
    title: "Painting",
    description: "Trusted painters for a clean, lasting finish.",
    image: "/images/services/painting-service.webp",
    alt: "Teal paint roller, brush, and paint can",
    href: "/services/painters",
  },
  {
    number: "02",
    title: "Deep Cleaning",
    description: "Fresh, spotless spaces without the hassle.",
    image: "/images/services/cleaning-service.webp",
    alt: "Professional cleaning spray, cloth, and brush",
    href: "/services/cleaning",
  },
  {
    number: "03",
    title: "Car Repair",
    description: "Reliable mechanics to keep you moving.",
    image: "/images/services/car-repair-service.webp",
    alt: "Modern car with professional repair tools",
    href: "/services/auto_repair",
  },
];

export default function CardsServicesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll("[data-service-card]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add(styles.visible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.visible);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="services-heading">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>Services you can trust</span>
          <h2 id="services-heading">Help for every day.</h2>
          <p>Choose a service and find a top-rated local professional.</p>
        </header>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <article data-service-card className={`${styles.reveal} ${index % 2 === 0 ? styles.fromLeft : styles.fromRight}`} key={service.title}>
              <div className={styles.perspective}>
                <div className={styles.card}>
                  <Image src={service.image} alt={service.alt} fill sizes="(max-width: 699px) 320px, (max-width: 1049px) 45vw, 340px" className={styles.image} />
                  <div className={styles.imageShade} aria-hidden="true" />
                  <div className={styles.badge} aria-hidden="true">
                    <span>Service</span>
                    <strong>{service.number}</strong>
                  </div>
                  <div className={styles.content}>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <Link href={service.href} className={styles.button}>
                      Show more
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
