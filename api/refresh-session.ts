import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

interface RequestBody {
  refreshToken: string;
}

interface ResponseBody {
  accessToken: string;
  refreshToken: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { refreshToken } = JSON.parse(event.body!) as RequestBody;

  return await authsignal.refreshSession({ refreshToken });
};
