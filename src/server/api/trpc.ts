import { db } from "@/server/db";
import {
  getAuth,
  type SignedInAuthObject,
  type SignedOutAuthObject,
} from "@clerk/nextjs/server";
import * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import SuperJSON from "superjson";
import { ZodError } from "zod";

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

//eslint-disable-next-line
export const createTRPCContextInner = async ({ auth }: AuthContext) => {
  return {
    auth,
    db,
  };
};

export const createTRPCContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  return await createTRPCContextInner({ auth: getAuth(opts.req) });
};

const t = trpc.initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);
