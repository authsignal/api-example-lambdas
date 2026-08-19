import { ActionAttributes } from "@authsignal/node";
import axios from "axios";
import { AuthsignalBaseV2 } from "./base";
import { UserAttributes } from "./types";

type ChallengeWhatsAppRequest = {
  authorizationToken: string;
  phoneNumber?: string;
};

type VerifyWhatsAppRequest = {
  authorizationToken: string;
  verificationCode: string;
};

type VerifyWhatsAppResponse = {
  action: ActionAttributes;
  authorizationToken?: string;
  user: UserAttributes;
};

export class AuthsignalWhatsAppV2 extends AuthsignalBaseV2 {
  constructor({ apiSecretKey, apiUrl }: { apiSecretKey: string; apiUrl: string }) {
    super({ apiSecretKey, apiUrl });
  }

  async challenge(request: ChallengeWhatsAppRequest): Promise<void> {
    const { authorizationToken, phoneNumber } = request;

    const url = `${this.apiUrl}/v2/client/challenge/whatsapp`;

    const body = { phoneNumber };

    const config = this.getClientRequestConfig(authorizationToken);

    try {
      await axios.post(url, body, config);
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }

  public async verify(request: VerifyWhatsAppRequest): Promise<VerifyWhatsAppResponse> {
    const { authorizationToken, verificationCode } = request;

    const url = `${this.apiUrl}/v2/client/verify/whatsapp`;

    const body = { verificationCode };

    const config = this.getClientRequestConfig(authorizationToken);

    try {
      const response = await axios.post<VerifyWhatsAppResponse>(url, body, config);

      return response.data;
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }
}
