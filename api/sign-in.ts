import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

interface RequestBody {
  token: string;
}

interface ResponseBody {
  accessToken: string;
  refreshToken: string;
}

const clientId = process.env.AUTHSIGNAL_CLIENT!;

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { token } = JSON.parse(event.body!) as RequestBody;

  const { accessToken, refreshToken } = await authsignal.createSession({
    token,
    clientId,
  });

  return {
    accessToken,
    refreshToken,
  };
};
