import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

interface RequestBody {
  accessToken: string;
}

export const handler = async (event: APIGatewayProxyEventV2) => {
  const { accessToken } = JSON.parse(event.body!) as RequestBody;

  await authsignal.revokeSession({ accessToken });

  return {
    statusCode: 204,
  };
};
