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

const SearchForm = () => {
  return (
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
  );
};

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

        <SearchForm />

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

      <div className={styles.desktopView}>
        <div className={styles.cards}>
          <div className={styles.card} data-card-bg1>
            <div className={styles.cardContent}>
              <div>
                <p className={textStyles.payeasyBody}>Transactions(Amount)</p>

                <Image
                  src="/svg_icons/cash.svg"
                  alt="Cash Icon"
                  width={48}
                  height={48}
                  priority
                />
              </div>

              <p className={textStyles.payeasyTitleMedium}>₦ 20,000.00</p>
            </div>
          </div>
          <div className={styles.card} data-card-bg2>
            <div className={styles.cardContent}>
              <div>
                <p className={textStyles.payeasyBody}>Transactions(Count)</p>

                <Image
                  src="/svg_icons/trend.svg"
                  alt="Trend Icon"
                  width={48}
                  height={48}
                  priority
                />
              </div>

              <p className={textStyles.payeasyTitleMedium}>100</p>
            </div>
          </div>
          <div className={styles.card} data-card-bg3>
            <div className={styles.cardContent}>
              <div>
                <p className={textStyles.payeasyBody}>Terminal ID</p>

                <Image
                  src="/svg_icons/terminal.svg"
                  alt="Terminal Icon"
                  width={48}
                  height={48}
                  priority
                />
              </div>

              <p className={textStyles.payeasyTitleMedium}>123456</p>
            </div>
          </div>
          <div className={`${styles.card} ${styles.barcodeCard}`} data-card-bg4>
            <div className={styles.barcodeCardContent}>
              <div>
                <p className={textStyles.titleMedium}>Scan to pay!</p>

                <p className={textStyles.bodySmall}>
                  Share this barcode with customers to get transactions on this
                  terminal.
                </p>
              </div>

              <div>
                <Image
                  src={dummyBarcode}
                  alt="Terminal Barcode"
                  width={77}
                  height={73}
                  className={styles.barcode}
                  priority
                />

                <PayEasyNoFillIconButton>
                  <Image
                    src="/svg_icons/print.svg"
                    alt="Print Icon"
                    width={18}
                    height={18}
                    priority
                  />
                  <span className={textStyles.titleSmall}>Print</span>
                </PayEasyNoFillIconButton>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.titleBar}>
          <p className={textStyles.headlineSmall}>Transactions</p>

          <div>
            <SearchForm />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th className={textStyles.labelLarge}>Names</th>
                <th className={textStyles.labelLarge}>Date</th>
                <th className={textStyles.labelLarge}>Amount</th>
                <th className={textStyles.labelLarge}>Reference</th>
                <th className={textStyles.labelLarge}>Status</th>
              </tr>
            </thead>

            <tbody>
              {Array(100)
                .fill(null)
                .map((_, i) => {
                  return (
                    <tr key={`tr_${i}`}>
                      <td className={textStyles.bodySmall}>Menyaga Emmanuel</td>
                      <td className={textStyles.bodySmall}>
                        May, 02 2023, 2:00pm
                      </td>
                      <td className={textStyles.bodySmall}>₦10,000</td>
                      <td className={textStyles.bodySmall}>wdfdghtew</td>
                      <td className={textStyles.bodySmall}>Completed</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
