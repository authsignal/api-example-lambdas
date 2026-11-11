import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../lib/authsignal";
import { toErrorResponse } from "../lib/http";

// Starts a flow with a push verification step for a user and redirects to the pre-built UI to complete it.
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
    const { challengeUrl } = await authsignal.startFlow({
      actionCode: "signInWithPushV2",
      user: { email },
      clientId: process.env.AUTHSIGNAL_CLIENT,
    });

    return {
      statusCode: 302,
      headers: {
        Location: challengeUrl,
      },
      body: "",
    };
  } catch (error) {
    return toErrorResponse(error);
  }
};
