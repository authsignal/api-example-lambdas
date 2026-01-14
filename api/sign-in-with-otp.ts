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
  challengeId?: string;
  accessToken?: string;
  refreshToken?: string;
}

const clientId = process.env.AUTHSIGNAL_CLIENT!;

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { challengeId, verificationCode, deviceId } = JSON.parse(event.body!) as RequestBody;

  const verifyResponse = await authsignal.verify({ challengeId, verificationCode });

  const { isVerified, email, phoneNumber, verificationMethod } = verifyResponse;

  if (!isVerified || !email) {
    return {
      isVerified: false,
    };
  }

  // Our flow combines sign-in and sign-up
  // So we create a user on the fly if they don't exist
  const userId = await getOrCreateUser(email);

  // If we're verifying email OTP and the user has registered their phone number
  // Then check if a 2nd OTP challenge is required on the device
  if (phoneNumber && verificationMethod === VerificationMethod.EMAIL_OTP) {
    const { state, idempotencyKey } = await authsignal.track({
      action: "secondFactorOtp",
      userId,
      attributes: {
        deviceId,
        ipAddress: event.requestContext.http.sourceIp,
      },
    });

    if (state === UserActionState.CHALLENGE_REQUIRED) {
      const secondChallengeResponse = await authsignal.challenge({
        userId,
        verificationMethod: VerificationMethod.WHATSAPP,
        action: "secondFactorOtp",
        idempotencyKey,
      });

      return {
        isVerified: true,
        challengeId: secondChallengeResponse.challengeId,
      };
    }
  }

  const { token } = await authsignal.claimChallenge({ challengeId, userId });

  const { accessToken, refreshToken } = await authsignal.createSession({ clientId, token });

  return {
    isVerified: true,
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
