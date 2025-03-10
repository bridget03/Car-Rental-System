import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function withAuth(
  handler: NextApiHandler,
  allowedRoles: string[] = []
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (allowedRoles.length && !allowedRoles.includes((token.user as { role: string }).role)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    (req as any).user = token.user;

    return handler(req, res);
  };
}
