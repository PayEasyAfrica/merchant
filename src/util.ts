import axios, { AxiosError } from "axios";

export class Util {
  static classNames(...names: (string | undefined)[]) {
    return names.filter((name) => !!name).join(" ");
  }

  static env() {
    return {
      apiUrl: process.env.API_URL,
    };
  }

  static http = axios.create({ baseURL: Util.env().apiUrl });

  static handleHttpError = (
    error: AxiosError,
    handler: (_: {
      message: string;
      errors: Record<string, unknown>;
    }) => unknown
  ) => {
    const errorData = error?.response?.data as Record<string, unknown>;
    const message = (errorData?.message as string) || error.message;
    const errors = (errorData?.errors as Record<string, unknown>) || null;

    handler({ message, errors });
  };

  static formatNumber(number?: number, precision = 2) {
    return (+(number || 0).toFixed(precision)).toLocaleString();
  }
}
