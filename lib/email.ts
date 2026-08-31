import axios from "axios";
import { AuthsignalBaseV2 } from "./base";
import { FlowUser, FlowAction } from "./types";

type ChallengeRequest = {
  challengeToken: string;
  email?: string;
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

export class AuthsignalEmailV2 extends AuthsignalBaseV2 {
  constructor({ apiSecretKey, apiUrl }: { apiSecretKey: string; apiUrl: string }) {
    super({ apiSecretKey, apiUrl });
  }

  async challenge(request: ChallengeRequest): Promise<void> {
    const { challengeToken, email } = request;

    const url = `${this.apiUrl}/client/flows/challenge/email-otp`;

    const body = { email };

    const config = this.getClientRequestConfig(challengeToken);

    try {
      await axios.post(url, body, config);
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }

  public async verify(request: VerifyRequest): Promise<VerifyResponse> {
    const { challengeToken, verificationCode } = request;

    const url = `${this.apiUrl}/client/flows/verify/email-otp`;

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
