import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<any>) => {
  const { sub } = event.requestContext.authorizer.lambda;

  const userAuthenticators = await authsignal.getAuthenticators({ userId: sub });

  return userAuthenticators;
};
