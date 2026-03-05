import { Router } from 'express';
import { MovieInsightController } from '../controllers/MovieInsightController';
import { validateMovieInsightRequest } from '../middlewares/validation';
import { rateLimiter } from '../middlewares/security';

const router = Router();
const controller = new MovieInsightController();

router.post(
  '/movie-insight',
  rateLimiter,
  validateMovieInsightRequest,
  (req, res, next) => controller.getMovieInsight(req, res, next)
);

export default router;
