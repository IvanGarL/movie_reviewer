import { Response } from 'express';
import * as J from 'joi';
import { EntityManager } from 'typeorm';
import { AuthRequest } from '../../common/authCommonTypes';
import { Review } from '../../entities/Review';
import { User, UserRoles } from '../../entities/User';
import { middleware } from '../../middlewares/auth';
import HttpError from '../../utils/exception';

export default class ReviewService {
    public async submitReview(req: AuthRequest, res: Response): Promise<void> {
        const submitReviewValidationSchema = J.object({
            tmdbId: J.number().required(),
            userName: J.string().required(),
            rating: J.number().min(1).max(10).precision(2).required(),
            comment: J.string().optional().allow(''),
        });
        return middleware(req, res, {
            bodyValidation: submitReviewValidationSchema,
            roles: [UserRoles.USER],
            validateToken: true,
            handler: async (req: AuthRequest, res: Response, manager: EntityManager) => {
                if (!req.body) throw new HttpError(400, 'Invalid request body parameters');

                const { tmdbId, userName, rating, comment } = req.body;
                const existingReview = await manager.findOne(Review, {
                    where: {
                        movieTmdbId: tmdbId,
                        username: userName,
                    },
                });

                if (existingReview) {
                    await manager.update(Review, { id: existingReview.id }, { rating, comment: comment || '' });
                    res.status(200).send({ message: 'Review updated successfully' });
                }

                const { userId } = req.decodedToken;
                const user = await manager.findOne(User, { where: { id: userId, username: userName } });
                if (!user) throw new HttpError(404, `Username: ${userName} doesn't match your user id`);

                const newReview = await manager.save(
                    new Review({
                        rating,
                        comment: comment || '',
                        movieTMDBId: tmdbId,
                        username: userName,
                    }),
                );

                return res.status(201).send({ message: 'Review created successfully', review: newReview });
            },
        });
    }
}
