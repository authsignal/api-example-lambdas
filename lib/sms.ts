import axios from "axios";
import { AuthsignalBaseV2 } from "./base";
import { FlowUser, FlowAction } from "./types";

type ChallengeRequest = {
  challengeToken: string;
  phoneNumber?: string;
};

type VerifyRequest = {
  challengeToken: string;
  verificationCode: string;
};

type VerifyResponse = {
  action: FlowAction;
  challengeToken?: string;
  user: FlowUser;
};

export class AuthsignalSmsV2 extends AuthsignalBaseV2 {
  constructor({ apiSecretKey, apiUrl }: { apiSecretKey: string; apiUrl: string }) {
    super({ apiSecretKey, apiUrl });
  }

  async challenge(request: ChallengeRequest): Promise<void> {
    const { challengeToken, phoneNumber } = request;

    const url = `${this.apiUrl}/client/flows/challenge/sms`;

    const body = { phoneNumber };

    const config = this.getClientRequestConfig(challengeToken);

    try {
      await axios.post(url, body, config);
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }

  public async verify(request: VerifyRequest): Promise<VerifyResponse> {
    const { challengeToken, verificationCode } = request;

    const url = `${this.apiUrl}/client/flows/verify/sms`;

    const body = { verificationCode };

    const config = this.getClientRequestConfig(challengeToken);

    try {
      const response = await axios.post<VerifyResponse>(url, body, config);

      return response.data;
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }
}
