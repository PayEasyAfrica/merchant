import { Util } from "@/util";
import styles from "./three-dot-loader.module.css";

export const ThreeDotLoader = (props: { className?: string }) => {
  return (
    <div className={Util.classNames(styles.threeDotLoader, props.className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
