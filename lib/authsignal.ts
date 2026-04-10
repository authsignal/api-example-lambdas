import { Authsignal, VerificationMethod } from "@authsignal/node";
import axios, { AxiosError } from "axios";

const apiSecretKey = process.env.AUTHSIGNAL_SECRET!;
const apiUrl = process.env.AUTHSIGNAL_URL!;

const v1ApiUrl = `${apiUrl}/v1`;
const v2ApiUrl = `${apiUrl}/v2`;

export const authsignal = new Authsignal({ apiSecretKey, apiUrl: v1ApiUrl });

type ChallengeRequest = {
  challengeId?: string;
  userId?: string;
  actionCode?: string;
  verificationMethod?: "SMS" | "EMAIL_OTP" | "WHATSAPP";
  scope?: string;
  clientId?: string;
  attributes?: {
    email?: string;
    phoneNumber?: string;
    locale?: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    custom?: any;
  };
};

type ChallengeResponse = {
  challengeId: string;
  expiresAt: number;
};

type VerifyRequest = {
  challengeId?: string;
  verificationCode?: string;
  authorizationToken?: string;
  clientId?: string;
};

type ChallengeAttributes = {
  email?: string;
  phoneNumber?: string;
};

enum ChallengeState {
  CHALLENGE_REQUIRED = "CHALLENGE_REQUIRED",
  CHALLENGE_SUCCEEDED = "CHALLENGE_SUCCEEDED",
  CHALLENGE_FAILED = "CHALLENGE_FAILED",
}

type VerifyResponse = {
  isVerified: boolean;
  failureReason?: string;
  verificationMethod?: VerificationMethod;
  attributes?: ChallengeAttributes;
  action?: {
    state: ChallengeState;
  };
  user?: {
    userId: string;
    email?: string;
    phoneNumber?: string;
  };
  session?: {
    accessToken: string;
    refreshToken: string;
  };
};

type IdentifyUserRequest = {
  userId: string;
  challengeId: string;
};

type IdentifyUserResponse = {
  userId: string;
  session?: {
    accessToken: string;
    refreshToken: string;
  };
};

class AuthsignalV2 {
  apiSecretKey: string;
  apiUrl: string;

  constructor({ apiSecretKey, apiUrl }: { apiSecretKey: string; apiUrl: string }) {
    this.apiSecretKey = apiSecretKey;
    this.apiUrl = apiUrl;
  }

  async challenge(request: ChallengeRequest): Promise<ChallengeResponse> {
    const url = `${this.apiUrl}/v2/challenge`;

    const config = this.getRequestConfig();

    try {
      const response = await axios.post<ChallengeResponse>(url, request, config);

      return response.data;
    } catch (error) {
      throw mapToAuthsignalError(error);
    }
  }

  public async verify(request: VerifyRequest): Promise<VerifyResponse> {
    const url = `${this.apiUrl}/v2/verify`;

    const config = this.getRequestConfig();

    try {
      const response = await axios.post<VerifyResponse>(url, request, config);

      return response.data;
    } catch (error) {
      throw mapToAuthsignalError(error);
    }
  }

  public async identifyUser(request: IdentifyUserRequest): Promise<IdentifyUserResponse> {
    const url = `${this.apiUrl}/v1/identify`;

    const config = this.getRequestConfig();

    try {
      const response = await axios.post<IdentifyUserResponse>(url, request, config);

      return response.data;
    } catch (error) {
      throw mapToAuthsignalError(error);
    }
  }

  private getRequestConfig() {
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

export function mapToAuthsignalError(error: unknown): AuthsignalError {
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

function formatMessage(statusCode: number, errorCode: string, errorDescription?: string) {
  return `AuthsignalError: ${statusCode} - ${formatDescription(errorCode, errorDescription)}`;
}

function formatDescription(errorCode: string, errorDescription?: string) {
  return errorDescription && errorDescription.length > 0 ? errorDescription : errorCode;
}

export const authsignalV2 = new AuthsignalV2({ apiSecretKey, apiUrl });
