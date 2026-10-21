import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../../lib/authsignal";
import { toErrorResponse } from "../../lib/http";

interface RequestBody {
  challengeToken: string;
}

export const handler = async (event: APIGatewayProxyEventV2) => {
  const { challengeToken } = JSON.parse(event.body!) as RequestBody;

  try {
    const validateChallengeResponse = await authsignal.validateChallenge({
      token: challengeToken,
      action: "signInWithPin",
    });

    console.log("Validate Challenge Response:", validateChallengeResponse);

    const createSessionResponse = await authsignal.createSession({
      token: challengeToken,
      clientId: process.env.AUTHSIGNAL_CLIENT!,
      action: "signInWithPin",
    });

    console.log("Create Session Response:", createSessionResponse);

    return createSessionResponse;
  } catch (error) {
    return toErrorResponse(error);
  }
};
