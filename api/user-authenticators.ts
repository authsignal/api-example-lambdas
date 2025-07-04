import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

export const handler = async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;

  const userAuthenticators = await authsignal.getAuthenticators({ userId });

  return userAuthenticators;
};
