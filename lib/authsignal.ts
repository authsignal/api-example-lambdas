import { ActionAttributes, Authsignal, UserAttributes, VerificationMethod } from "@authsignal/node";
import axios, { AxiosError } from "axios";
import { ChallengeAttributes, SessionAttributes, UserLookup } from "./types";
import { AuthsignalBaseV2 } from "./base";
import { AuthsignalEmailV2 } from "./email";
import { AuthsignalSmsV2 } from "./sms";
import { AuthsignalWhatsAppV2 } from "./whatsapp";

const apiSecretKey = process.env.AUTHSIGNAL_SECRET!;
const apiUrl = process.env.AUTHSIGNAL_URL!;

export const authsignal = new Authsignal({ apiSecretKey, apiUrl: `${apiUrl}/v1` });

type InitFlowRequest = {
  actionCode: string;
  attributes?: ChallengeAttributes;
  clientId?: string;
  user?: UserLookup;
};

type InitFlowResponse = {
  action: ActionAttributes;
  authorizationToken: string;
  user?: UserAttributes;
};

type VerifyFlowRequest = {
  actionCode: string;
  authorizationToken: string;
};

type VerifyFlowResponse = {
  action: ActionAttributes;
  session?: SessionAttributes;
  user?: UserAttributes;
};

type IdentifyUserRequest = {
  userId: string;
  authorizationToken: string;
};

type IdentifyUserResponse = {
  userId: string;
  session?: SessionAttributes;
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

  public async initFlow(request: InitFlowRequest): Promise<InitFlowResponse> {
    const url = `${this.apiUrl}/v2/challenge`;

    const config = this.getServerRequestConfig();

    try {
      const response = await axios.post<InitFlowResponse>(url, request, config);

      return response.data;
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }

  public async verifyFlow(request: VerifyFlowRequest): Promise<VerifyFlowResponse> {
    const url = `${this.apiUrl}/v2/verify`;

    const config = this.getServerRequestConfig();

    try {
      const response = await axios.post<VerifyFlowResponse>(url, request, config);

      return response.data;
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }

  public async identifyUser(request: IdentifyUserRequest): Promise<IdentifyUserResponse> {
    const url = `${this.apiUrl}/v1/identify`;

    const config = this.getServerRequestConfig();

    try {
      const response = await axios.post<IdentifyUserResponse>(url, request, config);

      return response.data;
    } catch (error) {
      throw this.mapToAuthsignalError(error);
    }
  }
}

class AuthsignalError extends Error {
  statusCode: number;
  errorCode: string;
  errorDescription?: string;
  axiosError?: AxiosError;

  constructor(statusCode: number, errorCode: string, errorDescription?: string, axiosError?: AxiosError) {
    const message = formatMessage(statusCode, errorCode, errorDescription);

    super(message);

    this.name = "AuthsignalError";

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
    this.axiosError = axiosError;
  }
}

function formatMessage(statusCode: number, errorCode: string, errorDescription?: string) {
  return `AuthsignalError: ${statusCode} - ${formatDescription(errorCode, errorDescription)}`;
}

function formatDescription(errorCode: string, errorDescription?: string) {
  return errorDescription && errorDescription.length > 0 ? errorDescription : errorCode;
}

export const authsignalV2 = new AuthsignalV2({ apiSecretKey, apiUrl });
