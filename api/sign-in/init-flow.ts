import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignalV2 } from "../../lib/authsignal";

interface ResponseBody {
  authorizationToken: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { authorizationToken } = await authsignalV2.initFlow({
    actionCode: "signInV2",
    clientId: process.env.AUTHSIGNAL_CLIENT,
    attributes: {
      ipAddress: event.requestContext.http.sourceIp,
    },
  });

  return {
    authorizationToken,
  };
};
