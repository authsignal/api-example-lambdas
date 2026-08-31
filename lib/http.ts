import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { AuthsignalError } from "@authsignal/node";
import { HttpError } from "./http-error";

export function toErrorResponse(error: unknown): APIGatewayProxyStructuredResultV2 {
  if (error instanceof AuthsignalError) {
    console.error("Authsignal error:", error.statusCode, error.errorCode, error.errorDescription);

    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        errorCode: error.errorCode,
        errorDescription: error.errorDescription,
      }),
    };
  }

  if (error instanceof HttpError) {
    console.error("Request error:", error.statusCode, error.errorCode, error.errorDescription);

    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        errorCode: error.errorCode,
        errorDescription: error.errorDescription,
      }),
    };
  }

  console.error("Unexpected error:", error);

  return {
    statusCode: 500,
    body: JSON.stringify({
      errorCode: "internal_server_error",
      errorDescription: "An unexpected error occurred",
    }),
  };
}
