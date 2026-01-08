import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

interface RequestBody {
  phoneNumber: string;
  idempotencyKey: string;
}

interface ResponseBody {
  challengeId: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { phoneNumber, idempotencyKey } = JSON.parse(event.body!) as RequestBody;

  const { challengeId } = await authsignal.challenge({
    verificationMethod: "WHATSAPP",
    phoneNumber,
    action: "secondFactorOtp",
    idempotencyKey,
    ipAddress: event.requestContext.http.sourceIp,
  });

  return {
    challengeId,
  };
};
