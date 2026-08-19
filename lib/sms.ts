import { ActionAttributes } from "@authsignal/node";
import axios from "axios";
import { AuthsignalBaseV2 } from "./base";
import { UserAttributes } from "./types";

type ChallengeSmsRequest = {
  authorizationToken: string;
  phoneNumber?: string;
};

type VerifySmsRequest = {
  authorizationToken: string;
  verificationCode: string;
};

type VerifySmsResponse = {
  action: ActionAttributes;
  authorizationToken?: string;
  user: UserAttributes;
};

export class AuthsignalSmsV2 extends AuthsignalBaseV2 {
  constructor({ apiSecretKey, apiUrl }: { apiSecretKey: string; apiUrl: string }) {
    super({ apiSecretKey, apiUrl });
  }

  async challenge(request: ChallengeSmsRequest): Promise<void> {
    const { authorizationToken, phoneNumber } = request;

    const url = `${this.apiUrl}/v2/client/challenge/sms`;

    const body = { phoneNumber };

    const config = this.getClientRequestConfig(authorizationToken);

    try {
      await axios.post(url, body, config);
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }

  public async verify(request: VerifySmsRequest): Promise<VerifySmsResponse> {
    const { authorizationToken, verificationCode } = request;

    const url = `${this.apiUrl}/v2/client/verify/sms`;

    const body = { verificationCode };

    const config = this.getClientRequestConfig(authorizationToken);

    try {
      const response = await axios.post<VerifySmsResponse>(url, body, config);

      return response.data;
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }
}
