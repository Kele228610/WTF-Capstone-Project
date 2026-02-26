import styles from './CallToAction.module.css';

const CallToAction = () => {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.blur}></div>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Start learning for<br />free today
          </h2>
          <p className={styles.description}>
            No credit card required. Gain access to hundreds of lessons instantly.
          </p>
          <button className={styles.button}>Create Free Account</button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
