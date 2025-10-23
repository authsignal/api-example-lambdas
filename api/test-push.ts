import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

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

  const userId = users[0].userId;

  const { url } = await authsignal.track({
    userId,
    action: "signInWithPush",
  });

  return {
    statusCode: 302,
    headers: {
      Location: url,
    },
    body: "",
  };
};
