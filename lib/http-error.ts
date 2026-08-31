export class HttpError extends Error {
  statusCode: number;
  errorCode: string;
  errorDescription?: string;

  constructor(statusCode: number, errorCode: string, errorDescription?: string) {
    super(errorDescription ?? errorCode);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
  }
}
