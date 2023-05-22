import Image from "next/image";
import styles from "./page.module.css";
import textStyles from "./text.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <div className={styles.leftContent}>
          <div>
            <Image
              src="/payeasy.svg"
              alt="PayEasy Logo"
              width={57}
              height={66}
              priority
            />

            <div className={styles.textContent}>
              <h1 className={styles.title}>Monitor Your Transactions!</h1>

              <p className={styles.body}>
                Enter your merchant code to monitor your PayEasy transactions
                made through this terminal
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <form action="" className={styles.form}>
          <div>
            <div className={styles.payeasyInput}>
              <label htmlFor="" className={textStyles.bodyLarge}>
                Code
              </label>

              <input type="text" placeholder="Enter merchant code" />
            </div>

            <div className={styles.payeasyInput}>
              <label htmlFor="" className={textStyles.bodyLarge}>
                Terminal ID (optional)
              </label>

              <input type="text" placeholder="Enter store terminal ID" />
            </div>
          </div>

          <button
            className={`${styles.payeasyButton} ${textStyles.bodyMedium}`}
          >
            Monitor Transactions
          </button>
        </form>
      </div>
    </main>
  );
}
