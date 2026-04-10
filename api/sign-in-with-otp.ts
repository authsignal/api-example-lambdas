import { APIGatewayProxyEventV2 } from "aws-lambda";
import { v4 } from "uuid";
import { authsignalV2 } from "../lib/authsignal";
import { VerificationMethod } from "@authsignal/node";

interface RequestBody {
  challengeId: string;
  verificationCode: string;
}

interface ResponseBody {
  isVerified: boolean;
  session?: {
    accessToken: string;
    refreshToken: string;
  };
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { challengeId, verificationCode } = JSON.parse(event.body!) as RequestBody;

  const verifyResponse = await authsignalV2.verify({ challengeId, verificationCode });

  console.log("Verify response", verifyResponse);

  const { isVerified, action, attributes, session, user } = verifyResponse;

  // OTP is invalid
  if (!isVerified) {
    return {
      isVerified: false,
    };
  }

  // OTP is valid but another verification method is required
  // Initiate a second OTP challenge via WhatsApp
  if (action?.state === "CHALLENGE_REQUIRED") {
    await authsignalV2.challenge({
      challengeId,
      verificationMethod: VerificationMethod.WHATSAPP,
    });

    return {
      isVerified: true,
    };
  }

  // OTP is valid and a user already exists
  // Return session credentials
  if (session) {
    return {
      isVerified: true,
      session,
    };
  }

  // OTP is valid but user doesn't exist in Authsignal
  // Identify the user and then return session credentials
  if (!user) {
    const userId = await getOrCreateYourUser(attributes?.email!);

    const { session } = await authsignalV2.identifyUser({
      userId,
      challengeId,
    });

    return {
      isVerified: true,
      session,
    };
  }

  throw new Error("Sign-in failed - invalid state");
};

// In a real implementation you would lookup the user by email in your DB or IdP
// This examples uses Authsignal as the user DB so we just generate a new user ID
async function getOrCreateYourUser(_email: string): Promise<string> {
  const userId = v4();

  return userId;
}
