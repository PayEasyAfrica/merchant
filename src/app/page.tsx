import Image from "next/image";
import styles from "./page.module.css";
import textStyles from "./text.module.css";
import {
  PayEasyButton,
  PayEasyNoFillIconButton,
} from "@/components/payeasy_button/payeasy_button";
import { dummyBarcode } from "@/barcode";
import { PayEasyInput } from "@/components/payeasy_input/payeasy_input";
import { SuccessOverlay } from "./success-overlay";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image
          src="/payeasy_organge.svg"
          alt="PayEasy Logo"
          width={96}
          height={61}
          priority
        />

        <PayEasyNoFillIconButton className={styles.logoutButton}>
          <Image
            src="/svg_icons/logout_filled.svg"
            alt="Logout Icon"
            width={24}
            height={24}
            priority
          />
          Logout
        </PayEasyNoFillIconButton>
      </div>

      <div className={styles.mobileView}>
        <div className={styles.barcode}>
          <Image
            src={dummyBarcode}
            alt="Terminal Barcode"
            width={300}
            height={300}
            className={styles.barcode}
            priority
          />
        </div>

        <form action="" className={styles.searchInputContainer}>
          <PayEasyInput
            className={styles.searchInput}
            placeholder="Search by reference"
          />

          <PayEasyButton className={styles.searchButton}>
            <Image
              src="/svg_icons/search.svg"
              alt="Search Icon"
              width={18}
              height={18}
              priority
            />
          </PayEasyButton>
        </form>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th className={textStyles.labelLarge}>Names</th>
                <th className={textStyles.labelLarge}>Amount</th>
                <th className={textStyles.labelLarge}>Reference</th>
              </tr>
            </thead>

            <tbody>
              {Array(100)
                .fill(null)
                .map((_, i) => {
                  return (
                    <tr key={`tr_${i}`}>
                      <td className={textStyles.bodySmall}>Menyaga Emmanuel</td>
                      <td className={textStyles.bodySmall}>₦10,000</td>
                      <td className={textStyles.bodySmall}>wdfdghtew</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <SuccessOverlay name="" amount="" />
      </div>
    </main>
  );
}
