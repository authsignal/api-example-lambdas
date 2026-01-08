import { APIGatewayProxyEventV2 } from "aws-lambda";
import { authsignal } from "../lib/authsignal";

interface RequestBody {
  userId: string;
  challengeId: string;
  verificationCode: string;
}

interface ResponseBody {
  isVerified: boolean;
  accessToken?: string;
  refreshToken?: string;
}

const clientId = process.env.AUTHSIGNAL_CLIENT!;

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { userId, challengeId, verificationCode } = JSON.parse(event.body!) as RequestBody;

  const { isVerified, phoneNumber } = await authsignal.verify({ challengeId, verificationCode });

  if (!isVerified || !phoneNumber) {
    return {
      isVerified: false,
    };
  }

  const { token } = await authsignal.claimChallenge({ challengeId, userId });

  const { accessToken, refreshToken } = await authsignal.createSession({
    token,
    clientId,
    action: "secondFactorOtp",
  });

  return {
    isVerified,
    accessToken,
    refreshToken,
  };
};
