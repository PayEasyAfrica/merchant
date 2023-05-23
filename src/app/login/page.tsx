import Image from "next/image";
import styles from "./page.module.css";
import textStyles from "../text.module.css";
import { PayEasyButton } from "@/components/payeasy_button/payeasy_button";
import { PayEasyInputWithLabel } from "@/components/payeasy_input/payeasy_input";

export default function Login() {
  return (
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
        <form action="" className={styles.form}>
          <div>
            <PayEasyInputWithLabel
              label="Code"
              id="code"
              type="text"
              placeholder="Enter merchant code"
            />

            <PayEasyInputWithLabel
              label="Terminal ID (optional)"
              id="terminalId"
              type="text"
              placeholder="Enter store terminal ID"
            />
          </div>

          <PayEasyButton>Monitor Transactions</PayEasyButton>
        </form>
      </div>
    </main>
  );
}
