import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { authsignal } from "../../lib/authsignal";
import { toErrorResponse } from "../../lib/http";
import { HttpError } from "../../lib/http-error";

interface RequestBody {
  challengeToken: string;
}

interface ResponseBody {
  accessToken: string;
  refreshToken: string;
}

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<ResponseBody | APIGatewayProxyStructuredResultV2> => {
  const { challengeToken } = JSON.parse(event.body!) as RequestBody;

  try {
    const { action, session } = await authsignal.verifyFlow({
      actionCode: "signInV2",
      challengeToken,
    });

    if (action.state !== "CHALLENGE_SUCCEEDED" || !session) {
      throw new HttpError(401, "invalid_action_state", `Sign-in failed. Current action state: ${action.state}`);
    }

    return session;
  } catch (error) {
    return toErrorResponse(error);
  }
};
