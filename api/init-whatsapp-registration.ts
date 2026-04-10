import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { authsignal } from "../lib/authsignal";
import { AuthScope } from "@authsignal/node";

interface RequestBody {
  phoneNumber: string;
}

interface ResponseBody {
  challengeId: string;
}

export const handler = async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<ResponseBody> => {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("userId", userId);

  const { phoneNumber } = JSON.parse(event.body!) as RequestBody;

  const { challengeId } = await authsignal.challenge({
    userId,
    verificationMethod: "WHATSAPP",
    phoneNumber,
    action: "enrollPhoneNumber",
    ipAddress: event.requestContext.http.sourceIp,
    scope: AuthScope.addAuthenticators,
  });

  return {
    challengeId,
  };
};
