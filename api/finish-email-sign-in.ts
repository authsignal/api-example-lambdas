import { APIGatewayProxyEventV2 } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { authsignal } from "../lib/authsignal";
import { UserActionState, VerificationMethod } from "@authsignal/node";

interface RequestBody {
  challengeId: string;
  verificationCode: string;
  deviceId?: string;
}

interface ResponseBody {
  isVerified: boolean;
  isSecondFactorOtpRequired: boolean;
  userId?: string;
  idempotencyKey?: string;
  challengeId?: string;
  accessToken?: string;
  refreshToken?: string;
}

const clientId = process.env.AUTHSIGNAL_CLIENT!;

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { deviceId, challengeId, verificationCode } = JSON.parse(event.body!) as RequestBody;

  const { isVerified, email, phoneNumber } = await authsignal.verify({ challengeId, verificationCode });

  if (!isVerified || !email) {
    return {
      isVerified: false,
      isSecondFactorOtpRequired: false,
    };
  }

  // Our flow combines sign-in and sign-up
  // So we create a user on the fly if they don't exist
  const userId = await getOrCreateUser(email);

  if (phoneNumber) {
    // Check if 2nd factor OTP is required on device
    const { state, idempotencyKey } = await authsignal.track({
      action: "secondFactorOtp",
      userId,
      attributes: {
        deviceId,
        ipAddress: event.requestContext.http.sourceIp,
      },
    });

    if (state === UserActionState.CHALLENGE_REQUIRED) {
      const { challengeId } = await authsignal.challenge({
        userId,
        verificationMethod: VerificationMethod.WHATSAPP,
        action: "secondFactorOtp",
        idempotencyKey,
      });

      return {
        isVerified: true,
        isSecondFactorOtpRequired: true,
        userId,
        idempotencyKey,
        challengeId,
      };
    }
  }

  const { token } = await authsignal.claimChallenge({ challengeId, userId });

  const { accessToken, refreshToken } = await authsignal.createSession({
    token,
    clientId,
    action: "signIn",
  });

  return {
    isVerified: true,
    isSecondFactorOtpRequired: false,
    accessToken,
    refreshToken,
  };
};

async function getOrCreateUser(email: string) {
  const { users } = await authsignal.queryUsers({ email });

  if (users.length > 0) {
    return users[0].userId;
  }

  const userId = uuid();

  await authsignal.updateUser({
    userId,
    attributes: {
      email,
    },
  });

  return userId;
}
