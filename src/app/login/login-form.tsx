"use client";
import styles from "./page.module.css";
import { PayEasyButton } from "@/components/payeasy_button/payeasy_button";
import { PayEasyInputWithLabel } from "@/components/payeasy_input/payeasy_input";
import { Util } from "@/util";
import { LoginValidationSchema } from "@/validation-schema";
import { FormikHelpers, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

type LoginFormValues = {
  code: string;
  terminalId: string;
};

export const LoginForm = () => {
  const router = useRouter();

  const handleSubmit = (
    values: LoginFormValues,
    helpers: FormikHelpers<LoginFormValues>
  ) => {
    helpers.setSubmitting(true);

    Util.http
      .post("/merchants/auth/login", values)
      .then((res) => {
        const { data } = res.data as Record<string, unknown>;

        localStorage.setItem("authData", JSON.stringify(data));
        router.replace("/");
      })
      .catch((error) => {
        Util.handleHttpError(error, ({ message, errors }) => {
          if (errors) {
            helpers.setErrors(errors);
            return;
          }

          toast.error(message);
        });
      })
      .finally(() => helpers.setSubmitting(false));
  };

  useEffect(() => {
    if (localStorage.authData) {
      router.replace("/");
    }
  }, [router]);

  return (
    <>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={LoginValidationSchema}
        initialValues={{ code: "", terminalId: "" }}
      >
        {(props) => {
          return (
            <form onSubmit={props.handleSubmit} className={styles.form}>
              <div>
                <PayEasyInputWithLabel
                  label="Code"
                  id="code"
                  type="text"
                  name="code"
                  value={props.values.code}
                  error={props.errors.code}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  placeholder="Enter merchant code"
                />

                <PayEasyInputWithLabel
                  label="Terminal ID (optional)"
                  id="terminalId"
                  name="terminalId"
                  value={props.values.terminalId}
                  error={props.errors.terminalId}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  type="text"
                  placeholder="Enter store terminal ID"
                />
              </div>

              <PayEasyButton
                loading={props.isSubmitting}
                disabled={props.isSubmitting}
              >
                Monitor Transactions
              </PayEasyButton>
            </form>
          );
        }}
      </Formik>

      <ToastContainer limit={2} hideProgressBar autoClose={3000} />
    </>
  );
};
