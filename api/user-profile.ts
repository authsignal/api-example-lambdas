import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import { authsignal } from "../lib/authsignal";
import { RequestAuthorizer2Context } from "../auth/request-authorizer-2";

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<RequestAuthorizer2Context>) => {
  const userId = event.requestContext.authorizer.lambda.sub;

  const user = await authsignal.getUser({ userId });

  return user;
};
