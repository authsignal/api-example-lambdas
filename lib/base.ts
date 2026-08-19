import { AuthsignalError } from "@authsignal/node";
import { AxiosError } from "axios";

export class AuthsignalBaseV2 {
  apiSecretKey: string;
  apiUrl: string;

  constructor({ apiSecretKey, apiUrl }: { apiSecretKey: string; apiUrl: string }) {
    this.apiSecretKey = apiSecretKey;
    this.apiUrl = apiUrl;
  }

  protected getServerRequestConfig() {
    return {
      auth: {
        username: this.apiSecretKey,
        password: "",
      },
      headers: {
        "User-Agent": "authsignal-node",
      },
    };
  }

  protected getClientRequestConfig(authorizationToken: string) {
    return {
      headers: {
        "User-Agent": "authsignal-node",
        "X-Authsignal-Authorization-Token": authorizationToken,
      },
    };
  }

  protected mapToAuthsignalError(error: unknown): AuthsignalError {
    if (error instanceof AxiosError) {
      const { response } = error;

      if (response?.data) {
        const { error: errorCode, errorDescription } = response.data;

        console.log("errorCode", errorCode);
        console.log("errorDescription", errorDescription);

        return new AuthsignalError(response.status, errorCode, errorDescription, error);
      }
    }

    if (error instanceof Error) {
      console.log("error", error.message);

      return new AuthsignalError(500, "unexpected_error", error.message);
    }

    return new AuthsignalError(500, "unexpected_error");
  }
}
