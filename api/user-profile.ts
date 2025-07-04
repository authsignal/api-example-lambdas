import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import { authsignal } from "../lib/authsignal";
import { LambdaAuthorizer2Context } from "../auth/lambda-authorizer-2";

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<LambdaAuthorizer2Context>) => {
  const userId = event.requestContext.authorizer.lambda.sub;

  const user = await authsignal.getUser({ userId });

  return user;
};
