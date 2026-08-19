import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignalV2 } from "../../lib/authsignal";

interface RequestBody {
  authorizationToken: string;
  phoneNumber: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<void> => {
  const request = JSON.parse(event.body!) as RequestBody;

  await authsignalV2.sms.challenge(request);
};
