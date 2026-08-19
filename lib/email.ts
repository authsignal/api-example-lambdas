import { ActionAttributes } from "@authsignal/node";
import axios from "axios";
import { AuthsignalBaseV2 } from "./base";
import { UserAttributes } from "./types";

type ChallengeEmailRequest = {
  authorizationToken: string;
  email?: string;
};

type VerifyEmailRequest = {
  authorizationToken: string;
  verificationCode: string;
};

type VerifyEmailResponse = {
  action: ActionAttributes;
  authorizationToken?: string;
  user: UserAttributes;
};

export class AuthsignalEmailV2 extends AuthsignalBaseV2 {
  constructor({ apiSecretKey, apiUrl }: { apiSecretKey: string; apiUrl: string }) {
    super({ apiSecretKey, apiUrl });
  }

  async challenge(request: ChallengeEmailRequest): Promise<void> {
    const { authorizationToken, email } = request;

    const url = `${this.apiUrl}/v2/client/challenge/email-otp`;

    const body = { email };

    const config = this.getClientRequestConfig(authorizationToken);

    try {
      await axios.post(url, body, config);
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }

  public async verify(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const { authorizationToken, verificationCode } = request;

    const url = `${this.apiUrl}/v2/client/verify/email-otp`;

    const body = { verificationCode };

    const config = this.getClientRequestConfig(authorizationToken);

    try {
      const response = await axios.post<VerifyEmailResponse>(url, body, config);

      return response.data;
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }
}
