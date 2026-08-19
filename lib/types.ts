import { VerificationMethod } from "@authsignal/node";

export type UserLookup = { userId: string } | { email: string } | { phoneNumber: string };

export type ActionAttributes = {
  state: ChallengeState;
  completedSteps: CompletedVerificationStep[];
  nextStep?: VerificationStep;
};

export type VerificationStep = {
  stepType: VerificationStepType;
  verificationMethods: VerificationMethod[];
};

export type CompletedVerificationStep = {
  stepType: VerificationStepType;
  verificationMethod?: VerificationMethod;
  userAuthenticatorId: string;
};

export enum VerificationStepType {
  VERIFICATION_REQUIRED = "VERIFICATION_REQUIRED",
  ENROLLMENT_REQUIRED = "ENROLLMENT_REQUIRED",
  ENROLLMENT_OPTIONAL = "ENROLLMENT_OPTIONAL",
}

export type ChallengeAttributes = {
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  custom?: any;
  locale?: string;
};

export type UserAttributes = {
  userId: string;
  isIdentified: boolean;
  email?: string;
  emailVerified: boolean;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
  username?: string;
  displayName?: string;
  authenticators: UserAuthenticatorAttributes[];
};

export type UserAuthenticatorAttributes = {
  userAuthenticatorId: string;
  verificationMethod: VerificationMethod;
  email?: string;
  phoneNumber?: string;
  username?: string;
  displayName: string;
};

export type SessionAttributes = {
  accessToken: string;
  refreshToken: string;
};

export enum ChallengeState {
  CHALLENGE_REQUIRED = "CHALLENGE_REQUIRED",
  CHALLENGE_SUCCEEDED = "CHALLENGE_SUCCEEDED",
  CHALLENGE_FAILED = "CHALLENGE_FAILED",
}
