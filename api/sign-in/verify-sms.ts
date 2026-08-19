import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignalV2 } from "../../lib/authsignal";

interface RequestBody {
  authorizationToken: string;
  verificationCode: string;
}

export const handler = async (event: APIGatewayProxyEventV2) => {
  const request = JSON.parse(event.body!) as RequestBody;

  const response = await authsignalV2.sms.verify(request);

  return response;
};
