export type SmtpSendPayload = {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
};
