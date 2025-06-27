import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import { authsignal, UserContext } from "../lib/authsignal";

// Generates an Authsignal token for registering a new passkey via Client SDK
export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<UserContext>) => {
  const userId = event.requestContext.authorizer.lambda.userId;
  const email = event.requestContext.authorizer.lambda.email;

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
