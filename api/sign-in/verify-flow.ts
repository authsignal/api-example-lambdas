import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignalV2 } from "../../lib/authsignal";

interface RequestBody {
  authorizationToken: string;
}

interface ResponseBody {
  accessToken: string;
  refreshToken: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { authorizationToken } = JSON.parse(event.body!) as RequestBody;

  const { action, session } = await authsignalV2.verifyFlow({
    actionCode: "signInV2",
    authorizationToken,
  });

  if (action.state !== "CHALLENGE_SUCCEEDED" || !session) {
    throw new Error(`Sign-in failed. Current action state: ${action.state}`);
  }

  return session;
};
