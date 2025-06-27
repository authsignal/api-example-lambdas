import { APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

const clientId = process.env.AUTHSIGNAL_CLIENT!;

export const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
  const authorizationHeader = event.headers?.Authorization || event.headers?.authorization;

  if (!authorizationHeader) {
    throw new Error("Invalid headers");
  }

  const accessToken = authorizationHeader.split(" ")[1];

  const { user } = await authsignal.validateSession({ accessToken, clientId });

  return {
    isAuthorized: true,
    context: {
      ...user,
    },
  };
};
