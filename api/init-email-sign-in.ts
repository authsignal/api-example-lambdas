import { APIGatewayProxyEventV2 } from "aws-lambda";
import { v4 as uuid, v4 } from "uuid";
import { authsignal } from "../lib/authsignal";

interface RequestBody {
  email: string;
}

interface ResponseBody {
  token: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<ResponseBody> => {
  const { email } = JSON.parse(event.body!) as RequestBody;

  // Our flow combines sign-in and sign-up
  // So we create a user on the fly if they don't exist
  const userId = await getOrCreateUser(email);

  const { token } = await authsignal.track({
    userId,
    action: "signIn",
    attributes: {
      email,
    },
  });

  return {
    token,
  };
};

async function getOrCreateUser(email: string): Promise<string> {
  const { users } = await authsignal.queryUsers({
    email,
  });

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
