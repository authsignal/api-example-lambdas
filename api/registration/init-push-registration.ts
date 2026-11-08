import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { authsignal } from "../../lib/authsignal";
import { toErrorResponse } from "../../lib/http";

// Starts a flow for registering a push credential via the Authsignal Flows SDK
export const handler = async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;

  try {
    const { challengeToken } = await authsignal.startFlow({
      actionCode: "registerPushV2",
      user: { userId },
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
