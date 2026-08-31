import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { authsignalV2 } from "../../lib/authsignal";
import { toErrorResponse } from "../../lib/http";

interface RequestBody {
  email?: string;
}

interface ResponseBody {
  challengeToken: string;
}

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<ResponseBody | APIGatewayProxyStructuredResultV2> => {
  const { email } = JSON.parse(event.body!) as RequestBody;

  try {
    const { challengeToken } = await authsignalV2.startFlow({
      actionCode: "signInV2",
      user: email ? { email } : undefined,
      clientId: process.env.AUTHSIGNAL_CLIENT,
      attributes: {
        ipAddress: event.requestContext.http.sourceIp,
      },
    });

    return {
      challengeToken,
    };
  } catch (error) {
    return toErrorResponse(error);
  }
};
