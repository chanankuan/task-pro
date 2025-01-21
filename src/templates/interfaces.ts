export interface VerificationEmailContext {
  userName: string;
  confirmationLink: string;
  privacyPolicyLink: string;
  supportLink: string;
  year: number;
}

export interface ForgotPasswordContext {
  userName: string;
  resetLink: string;
  privacyPolicyLink: string;
  supportLink: string;
  year: number;
}

export interface WelcomeMessageContext {
  userName: string;
  privacyPolicyLink: string;
  supportLink: string;
  year: number;
}

export interface SupportContext {
  caseId: string;
  userEmail: string;
  description: string;
  privacyPolicyLink: string;
  supportLink: string;
  year: number;
}

export interface SupportReceiptContext {
  caseId: string;
  userName: string;
  description: string;
  privacyPolicyLink: string;
  supportLink: string;
  year: number;
}
