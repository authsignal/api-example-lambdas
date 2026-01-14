import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../lib/authsignal";
import { AuthsignalError } from "@authsignal/node";

interface RequestBody {
  challengeId?: string;
  verificationMethod?: "EMAIL_OTP" | "WHATSAPP";
  email?: string;
  phoneNumber?: string;
  deviceId?: string;
}

interface ResponseBody {
  challengeId: string;
  errorDescription?: string;
  errorCode?: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { challengeId, email, phoneNumber, verificationMethod, deviceId } = JSON.parse(event.body!) as RequestBody;

  // Handle re-send
  if (challengeId) {
    try {
      await authsignal.challenge({ challengeId });
    } catch (err) {
      if (err instanceof AuthsignalError) {
        return {
          challengeId,
          errorCode: err.errorCode,
          errorDescription: err.errorDescription,
        };
      }
    }

    return { challengeId };
  }

  const response = await authsignal.challenge({
    verificationMethod,
    email,
    phoneNumber,
    action: "signIn",
    ipAddress: event.requestContext.http.sourceIp,
    deviceId,
  });

  return {
    challengeId: response.challengeId,
  };
};
