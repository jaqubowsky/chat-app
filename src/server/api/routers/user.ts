import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string(),
        username: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (user) {
        return;
      }

      return ctx.db.user.create({
        data: {
          id: input.id,
          email: input.email,
          username: input.username,
        },
      });
    }),
});
