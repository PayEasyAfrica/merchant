import styles from "./payeasy_button.module.css";
import textStyles from "../../app/text.module.css";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { Util } from "@/util";

type PayEasyButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const PayEasyButton = (props: PayEasyButtonProps) => {
  return (
    <button
      {...props}
      className={Util.classNames(
        styles.payeasyButton,
        textStyles.bodyMedium,
        props.className
      )}
    />
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
