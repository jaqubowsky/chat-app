import { messagesRouter } from "@/server/api/routers/messages";
import { createTRPCRouter } from "@/server/api/trpc";
import { usersRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
