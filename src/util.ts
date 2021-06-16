import knex, { Knex } from "knex";
import { sign, verify } from "jsonwebtoken";
import { APPLICATION_CONTEXT, IUser, Req, Res } from "./typings";
import { RequestGenericInterface } from "fastify";

export function connectToDB(config: { client: string; connection: string | { filename: string }; pool?: { min: number; max: number } }): Knex {
    return knex(config);
}

// create a JWT created from a string formatted like id::timeitwascreated
export function createFormattedJWT({ id, tokenLastUpdatedAt }: { id: string; tokenLastUpdatedAt: Date }, JWT_KEY: string): string {
    return sign(`${id}::${tokenLastUpdatedAt.toUTCString()}`, JWT_KEY);
}

// decrypt a JWT into a id::timeitwascreated string, but if token is malformed then it'll return null in appropriate spots
export function decryptFormattedJWT(token: string, JWT_KEY: string): { id: string | null; tokenLastUpdatedAt: Date | null } {
    const decodedToken = verify(token, JWT_KEY) as string;
    const [id, tokenLastUpdatedAt] = decodedToken.split("::");

    let verifiedID: string | null = null;
    let verifiedDate: Date | null = null;

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) verifiedID = id as string;

    if (!Number.isNaN(Date.parse(tokenLastUpdatedAt))) verifiedDate = new Date(tokenLastUpdatedAt as string);

    return { id: verifiedID, tokenLastUpdatedAt: verifiedDate };
}

// check if a request is properly authenticated with Bearer token
export async function isAuth(
    req: Req<RequestGenericInterface>,
    res: Res<RequestGenericInterface>,
    context: APPLICATION_CONTEXT,
): Promise<(boolean | (string | null))[]> {
    const authorizationHeader = req.headers.authorization?.slice(7).trim();
    if (!authorizationHeader) return [false, "This route requires authentication!"];
    const data = decryptFormattedJWT(authorizationHeader, context.JWT_KEY);

    if (!data.id || !data.tokenLastUpdatedAt) return [false, "Malformed token!"];
    const user = await context.DATABASE<IUser>("users").where("id", data.id).first();
    if (!user || data.tokenLastUpdatedAt.toUTCString() !== new Date(user.tokenLastUpdatedAt).toUTCString()) return [false, "Invalid token!"];

    return [true, null];
}
