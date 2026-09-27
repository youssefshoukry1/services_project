import styles from "./card-reference.module.css";

export default function CardReference() {
  return (
    <main className={styles.page}>
      <div className={styles.parent}>
        <div className={styles.card}>
          <div className={styles.contentBox}>
            <span className={styles.cardTitle}>3D Card</span>
            <p className={styles.cardContent}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
            <span className={styles.seeMore}>See More</span>
          </div>
          <div className={styles.dateBox}>
            <span>June</span>
            <strong>29</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
