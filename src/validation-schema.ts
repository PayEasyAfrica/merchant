import * as Yup from "yup";

export const LoginValidationSchema = Yup.object().shape({
  code: Yup.string()
    .matches(/^[a-zA-Z0-9]{6}$/, "Enter a valid merchant code")
    .required("Merchant code is required"),
  terminalId: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Only alpha numeric characters are allowed")
    .optional(),
});
