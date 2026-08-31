import { VerificationMethod } from "@authsignal/node";

export type UserLookup = { userId: string } | { email: string } | { phoneNumber: string };

export type FlowAction = {
  state: FlowState;
  completedSteps: CompletedActionStep[];
  nextStep?: ActionStep;
};

export type ActionStep = {
  stepType: ActionStepType;
  verificationMethods: VerificationMethod[];
};

export type CompletedActionStep = {
  stepType: ActionStepType;
  verificationMethod?: VerificationMethod;
  userAuthenticatorId: string;
};

export enum ActionStepType {
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

export type FlowUser = {
  userId: string;
  isIdentified: boolean;
  email?: string;
  phoneNumber?: string;
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

export type AuthenticationSession = {
  accessToken: string;
  refreshToken: string;
};

export enum FlowState {
  CHALLENGE_REQUIRED = "CHALLENGE_REQUIRED",
  CHALLENGE_SUCCEEDED = "CHALLENGE_SUCCEEDED",
  CHALLENGE_FAILED = "CHALLENGE_FAILED",
}
