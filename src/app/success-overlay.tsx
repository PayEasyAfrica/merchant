import { useEffect, useState } from "react";
import styles from "./page.module.css";
import textStyles from "./text.module.css";
import { Util } from "@/util";

export const SuccessOverlay = (props: { amount: string; name: string }) => {
  let [overlayClass, setOverlayClass] = useState(styles.successOverlay);

  useEffect(() => {
    if (props.name && props.amount) {
      setOverlayClass(
        Util.classNames(styles.successOverlay, styles.mountOverlay)
      );

      setTimeout(() => {
        setOverlayClass(
          Util.classNames(
            styles.successOverlay,
            styles.mountOverlay,
            styles.showOverlay
          )
        );
      }, 1);

      setTimeout(() => {
        setOverlayClass(
          Util.classNames(styles.successOverlay, styles.mountOverlay)
        );
        setTimeout(() => {
          setOverlayClass(styles.successOverlay);
        }, 200);
      }, 1500);
    }
  }, [props.amount, props.name]);

  return (
    <div className={overlayClass}>
      <p className={textStyles.payeasyTitle}>₦{props.amount}</p>
      <p className={textStyles.bodyLarge}>{props.name}</p>
    </div>
  );
};
