import Image from "next/image";
import styles from "./page.module.css";
import textStyles from "../text.module.css";
import "react-toastify/dist/ReactToastify.css";
import { LoginForm } from "./login-form";

export default function Login() {
  return (
    <>
      <main className={styles.main}>
        <div>
          <div className={styles.leftContent}>
            <div>
              <div className={styles.logo}>
                <Image
                  src="/payeasy.svg"
                  alt="PayEasy Logo"
                  width={57}
                  height={66}
                  priority
                />
              </div>

              <div className={styles.textContent}>
                <h1 className={textStyles.payeasyTitle}>
                  Monitor Your Transactions!
                </h1>

                <p className={styles.body}>
                  Enter your merchant code to monitor your PayEasy transactions
                  made through this terminal
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <LoginForm />
        </div>
      </main>
    </>
  );
}
