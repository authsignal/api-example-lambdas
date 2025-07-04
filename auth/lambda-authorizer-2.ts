import { APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import jwt, { GetPublicKeyOrSecret } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

export type LambdaAuthorizer2Context = jwt.JwtPayload & { sub: string };

// Lambda authorizer that uses a public JWKS endpoint to validate the access token
export const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
  const authorizationHeader = event.headers?.Authorization || event.headers?.authorization;

  if (!authorizationHeader) {
    throw new Error("Invalid headers");
  }

  const accessToken = authorizationHeader.split(" ")[1];

  try {
    // Will throw an error if the access token is invalid
    const claims = await verifyTokenByJwksClient(accessToken);

    if (claims.aud !== clientId) {
      throw new Error("Invalid audience");
    }

    return {
      isAuthorized: true,
      context: {
        ...claims,
      },
    };
  } catch (err) {
    return {
      isAuthorized: false,
    };
  }
};

// Verify access token using JWKS client
export async function verifyTokenByJwksClient(accessToken: string): Promise<LambdaAuthorizer2Context> {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, getPublicKey, {}, function (err, decoded) {
      if (!err && isValidJwtPayload(decoded)) {
        resolve(decoded);
      } else {
        reject(err ?? new Error("Unauthorized"));
      }
    });
  });
}

// Get public key from JWKS endpoint
const getPublicKey: GetPublicKeyOrSecret = (header, callback) => {
  jwks.getSigningKey(header.kid, (err, signingKey) => {
    const publicKey = signingKey?.getPublicKey();

    if (publicKey) {
      callback(null, publicKey);
    } else {
      callback(err ?? new Error("Unauthorized"));
    }
  });
};

function isValidJwtPayload(payload?: jwt.JwtPayload | string): payload is LambdaAuthorizer2Context {
  return typeof payload === "object" && "sub" in payload;
}

const apiUrl = process.env.AUTHSIGNAL_URL!;
const tenantId = process.env.AUTHSIGNAL_TENANT!;
const clientId = process.env.AUTHSIGNAL_CLIENT!;

const jwks = jwksClient({
  jwksUri: `${apiUrl}/client/public/${tenantId}/.well-known/jwks`,
});
