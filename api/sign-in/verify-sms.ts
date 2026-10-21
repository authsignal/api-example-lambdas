import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { authsignal } from "../../lib/authsignal";
import { toErrorResponse } from "../../lib/http";
import { OtpVerifyResponse } from "@authsignal/node";

interface RequestBody {
  challengeToken: string;
  verificationCode: string;
}

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2 | OtpVerifyResponse> => {
  const { challengeToken, verificationCode } = JSON.parse(event.body!) as RequestBody;

  try {
    return await authsignal.sms.verify({ challengeToken, verificationCode });
  } catch (error) {
    return toErrorResponse(error);
  }
};
