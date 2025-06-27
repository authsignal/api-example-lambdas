import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import { UserContext } from "../lib/authsignal";

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<UserContext>): Promise<UserContext> => {
  const user = event.requestContext.authorizer.lambda;

  return user;
};
