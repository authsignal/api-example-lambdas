import { UserAttributes } from "@authsignal/node";
import { APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

export type LambdaAuthorizer1Context = { userId: string } & UserAttributes;

// Lambda authorizer that uses the Authsignal SDK to validate the access token
export const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
  const authorizationHeader = event.headers?.Authorization || event.headers?.authorization;

  if (!authorizationHeader) {
    throw new Error("Invalid headers");
  }

  const accessToken = authorizationHeader.split(" ")[1];

  try {
    // Will throw an error if the access token is invalid
    const { user } = await authsignal.validateSession({ accessToken, clientId });

    return {
      isAuthorized: true,
      context: {
        ...user,
      },
    };
  } catch {
    return {
      isAuthorized: false,
    };
  }
};

const clientId = process.env.AUTHSIGNAL_CLIENT!;
