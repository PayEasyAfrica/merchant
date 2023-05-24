import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  LabelHTMLAttributes,
} from "react";
import styles from "./payeasy_input.module.css";
import textStyles from "../../app/text.module.css";
import { Util } from "@/util";

type PayEasyInputLabelProps = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

type PayEasyInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type PayEasyInputWithLabelProps = {
  label: string;
  error?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const PayEasyInputLabel = (props: PayEasyInputLabelProps) => {
  return (
    <label
      {...props}
      className={Util.classNames(textStyles.bodyLarge, props.className)}
    />
  );
};

export const PayEasyInput = (props: PayEasyInputProps) => {
  return (
    <input
      {...props}
      className={Util.classNames(styles.payeasyInput, props.className)}
    />
  );
};

export const PayEasyInputWithLabel = (props: PayEasyInputWithLabelProps) => {
  const { label, error, ...inputProps } = props;
  return (
    <div className={styles.payeasyInputWithLabel}>
      <div>
        <PayEasyInputLabel htmlFor={props.id} className={textStyles.bodyLarge}>
          {label}
        </PayEasyInputLabel>

        <PayEasyInput {...inputProps} />
      </div>
      <p className={textStyles.bodySmall}>{error}</p>
    </div>
  );
};
