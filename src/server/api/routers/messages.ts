import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const messagesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.message.findMany();
  }),
});
