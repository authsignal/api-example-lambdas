import { APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import jwt, { GetPublicKeyOrSecret } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const apiUrl = process.env.AUTHSIGNAL_URL!;
const tenantId = process.env.AUTHSIGNAL_TENANT!;
const clientId = process.env.AUTHSIGNAL_CLIENT!;

const jwks = jwksClient({
  jwksUri: `${apiUrl}/client/public/${tenantId}/.well-known/jwks`,
});

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
async function verifyTokenByJwksClient(accessToken: string): Promise<jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, getPublicKey, {}, function (err, decoded) {
      if (!err && isDecodedJwtPayload(decoded)) {
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

function isDecodedJwtPayload(decoded?: jwt.JwtPayload | string): decoded is jwt.JwtPayload {
  return typeof decoded === "object" && "sub" in decoded;
}
