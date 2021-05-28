import { Router } from 'express';

import authRouter from './auth.routes';
import botRouter from './bot.routes';

const routes = Router();

routes.use('/', botRouter);
routes.use('/auth/google', authRouter);

export default routes;
