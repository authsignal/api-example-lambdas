import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import { authsignal, UserContext } from "../lib/authsignal";

// Generates an Authsignal token for enrolling a new passkey via Client SDK
export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<UserContext>) => {
  const { requestContext } = event;

  const userId = requestContext.authorizer?.lambda.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const email = requestContext.authorizer?.lambda.email;

  const { token } = await authsignal.track({
    userId,
    action: "registerPasskey",
    attributes: {
      scope: "add:authenticators",
      email,
    },
  });

  return {
    token,
  };
};
