import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

interface RequestBody {
  challengeId: string;
  verificationCode: string;
}

interface ResponseBody {
  isVerified: boolean;
}

export const handler = async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<ResponseBody> => {
  const { challengeId, verificationCode } = JSON.parse(event.body!) as RequestBody;

  const { isVerified } = await authsignal.verify({ challengeId, verificationCode });

  return {
    isVerified,
  };
};
