import { Authsignal } from "@authsignal/node";
import axios from "axios";
import { ChallengeAttributes, AuthenticationSession, UserLookup, FlowAction, FlowUser } from "./types";
import { AuthsignalBaseV2 } from "./base";
import { AuthsignalEmailV2 } from "./email";
import { AuthsignalSmsV2 } from "./sms";
import { AuthsignalWhatsAppV2 } from "./whatsapp";

const apiSecretKey = process.env.AUTHSIGNAL_SECRET!;
const apiUrl = process.env.AUTHSIGNAL_URL!;

export const authsignal = new Authsignal({ apiSecretKey, apiUrl });

type StartFlowRequest = {
  actionCode: string;
  attributes?: ChallengeAttributes;
  clientId?: string;
  user?: UserLookup;
};

type StartFlowResponse = {
  action: FlowAction;
  challengeToken: string;
  user?: FlowUser;
};

type VerifyFlowRequest = {
  actionCode: string;
  challengeToken: string;
};

type VerifyFlowResponse = {
  action: FlowAction;
  session?: AuthenticationSession;
  user?: FlowUser;
};

type IdentifyUserRequest = {
  userId: string;
  challengeToken: string;
};

type IdentifyUserResponse = {
  userId: string;
  session?: AuthenticationSession;
};

class AuthsignalV2 extends AuthsignalBaseV2 {
  email: AuthsignalEmailV2;
  sms: AuthsignalSmsV2;
  whatsapp: AuthsignalWhatsAppV2;

  constructor(params: { apiSecretKey: string; apiUrl: string }) {
    super(params);

    this.email = new AuthsignalEmailV2(params);
    this.sms = new AuthsignalSmsV2(params);
    this.whatsapp = new AuthsignalWhatsAppV2(params);
  }

  public async startFlow(request: StartFlowRequest): Promise<StartFlowResponse> {
    const url = `${this.apiUrl}/flows`;

    const config = this.getServerRequestConfig();

    try {
      const response = await axios.post<StartFlowResponse>(url, request, config);

      return response.data;
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }

  public async verifyFlow(request: VerifyFlowRequest): Promise<VerifyFlowResponse> {
    const url = `${this.apiUrl}/flows/verify`;

    const config = this.getServerRequestConfig();

    try {
      const response = await axios.post<VerifyFlowResponse>(url, request, config);

      return response.data;
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }

  public async identifyUser(request: IdentifyUserRequest): Promise<IdentifyUserResponse> {
    const url = `${this.apiUrl}/identify`;

    const config = this.getServerRequestConfig();

    try {
      const response = await axios.post<IdentifyUserResponse>(url, request, config);

      return response.data;
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }
}

export const authsignalV2 = new AuthsignalV2({ apiSecretKey, apiUrl });
