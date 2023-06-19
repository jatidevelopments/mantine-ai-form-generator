/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { gptRouter } from './gpt';
import { postRouter } from './post';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  post: postRouter,
  gpt: gptRouter,
});

export type AppRouter = typeof appRouter;
