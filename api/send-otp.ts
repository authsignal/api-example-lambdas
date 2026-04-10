import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignalV2 } from "../lib/authsignal";

interface RequestBody {
  verificationMethod: "EMAIL_OTP" | "WHATSAPP";
  email?: string;
  phoneNumber?: string;
  deviceId?: string;
}

interface ResponseBody {
  challengeId: string;
  errorDescription?: string;
  errorCode?: string;
}

const clientId = process.env.AUTHSIGNAL_CLIENT!;

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { email, phoneNumber, verificationMethod, deviceId } = JSON.parse(event.body!) as RequestBody;

  const challengeRequest = {
    actionCode: "signIn",
    verificationMethod,
    clientId,
    attributes: {
      email,
      phoneNumber,
      deviceId,
      ipAddress: event.requestContext.http.sourceIp,
    },
  };

  const { challengeId } = await authsignalV2.challenge(challengeRequest);

  return {
    challengeId,
  };
};
