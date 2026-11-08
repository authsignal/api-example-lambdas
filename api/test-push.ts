import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../lib/authsignal";
import { toErrorResponse } from "../lib/http";

// Starts a flow with a push verification step for a user and sends the push challenge to their device.
// Poll /client/flows/verify/push with the returned challenge token to see the outcome.
export const handler = async (event: APIGatewayProxyEventV2) => {
  const email = event.queryStringParameters?.email;

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "The 'email' query parameter is required." }),
    };
  }

  const { users } = await authsignal.queryUsers({ email });

  if (users.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "User not found." }),
    };
  }

  try {
    const { challengeToken } = await authsignal.startFlow({
      actionCode: "signInWithPushV2",
      user: { userId: users[0].userId },
      clientId: process.env.AUTHSIGNAL_CLIENT,
    });

    const response = await fetch(`${process.env.AUTHSIGNAL_URL}/client/flows/challenge/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authsignal-Challenge-Token": challengeToken,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: await response.text(),
      };
    }

    const { verificationCode } = (await response.json()) as { verificationCode?: string };

    return {
      challengeToken,
      verificationCode,
    };
  } catch (error) {
    return toErrorResponse(error);
  }
};
