import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { authsignal } from "../../lib/authsignal";
import { toErrorResponse } from "../../lib/http";

interface RequestBody {
  challengeToken: string;
  phoneNumber?: string;
}

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2 | undefined> => {
  const { challengeToken, phoneNumber } = JSON.parse(event.body!) as RequestBody;

  try {
    await authsignal.sms.challenge({ challengeToken, phoneNumber });
  } catch (error) {
    return toErrorResponse(error);
  }
};
