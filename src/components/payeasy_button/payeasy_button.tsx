import styles from "./payeasy_button.module.css";
import textStyles from "../../app/text.module.css";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { Util } from "@/util";
import { ThreeDotLoader } from "../three-dot-loader/three-dot-loader";

type PayEasyButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { loading?: boolean };

export const PayEasyButton = (props: PayEasyButtonProps) => {
  const { loading, children, ...buttonProps } = props;

  if (props.loading) {
    return (
      <button
        {...buttonProps}
        className={Util.classNames(
          styles.payeasyButton,
          textStyles.bodyMedium,
          props.className
        )}
        disabled
      >
        <ThreeDotLoader className={styles.loader} />
      </button>
    );
  }

  return (
    <button
      {...buttonProps}
      className={Util.classNames(
        styles.payeasyButton,
        textStyles.bodyMedium,
        props.className
      )}
    >
      {children}
    </button>
  );
};

export const PayEasyNoFillIconButton = (props: PayEasyButtonProps) => {
  return (
    <button
      {...props}
      className={Util.classNames(
        styles.payeasyNoFillIconButton,
        textStyles.bodyMedium,
        props.className
      )}
    />
  );
};

export const PayEasyOutlineButton = (props: PayEasyButtonProps) => {
  return (
    <button
      {...props}
      className={Util.classNames(
        styles.payeasyOutlineButton,
        textStyles.bodyMedium,
        props.className
      )}
    />
  );
};
