import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal, authsignalV2 } from "../lib/authsignal";

interface RequestBody {
  authorizationToken: string;
}

interface ResponseBody {
  accessToken: string;
  refreshToken: string;
}

const clientId = process.env.AUTHSIGNAL_CLIENT!;

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { authorizationToken } = JSON.parse(event.body!) as RequestBody;

  const { session } = await authsignalV2.verify({ authorizationToken, clientId });

  if (!session) {
    throw new Error("Invalid token");
  }

  const { accessToken, refreshToken } = session;

  return {
    accessToken,
    refreshToken,
  };
};
