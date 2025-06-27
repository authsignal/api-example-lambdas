import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

interface RequestBody {
  token: string;
  clientId: string;
}

interface ResponseBody {
  accessToken: string;
  refreshToken: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { token, clientId } = JSON.parse(event.body!) as RequestBody;

  const { accessToken, refreshToken } = await authsignal.createSession({
    token,
    clientId,
  });

  return {
    accessToken,
    refreshToken,
  };
};
