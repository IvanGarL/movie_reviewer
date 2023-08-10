import { Response } from 'express';
import * as J from 'joi';
import { EntityManager } from 'typeorm';
import { AuthRequest } from '../../common/authCommonTypes';
import { Review } from '../../entities/Review';
import { User, UserRoles } from '../../entities/User';
import { middleware } from '../../middlewares/auth';
import HttpError from '../../utils/exception';
import { mapReview } from './reviewMappers';

export default class ReviewService {
    /**
     * @api {POST} /reviews Submits a new review
     * @apiName SubmitReview
     * @apiGroup Review
     * @apiVersion  1.0.0
     * @apiPermission USER
     * @apiParam  {Number} tmdbId Movie TMDB ID
     * @apiParam  {String} userName User name
     * @apiParam  {Number} rating User rating
     * @apiParam  {String} [comment] User comment
     * @apiSuccess (201) {String} message Review submitted
     * @apiSuccess (201) {Object} review Review object
     * @apiError (400) {String} message Error submitting review
     * @apiError (400) {String} message User already reviewed this movie
     * @apiError (500) {String} message Internal server error
     * @apiSuccessExample {json} Success-Response:
     * {
     *     "message": "Review created successfully"
     *     "review": {
     *        "id": "asdasd-123123-asdasd-123123",
     *        "movieTmdbId": 123,
     *        "username": "ivangarl",
     *        "rating": 8.0,
     *        "comment": "Great movie",
     *        "createdAt": "2021-01-01T00:00:00.000Z",
     *        "updatedAt": "2021-01-01T00:00:00.000Z"
     *      }
     * }
     */
    public async submitReview(req: AuthRequest, res: Response): Promise<void> {
        const submitReviewValidationSchema = J.object({
            tmdbId: J.number().min(1).required(),
            userName: J.string().required(),
            rating: J.number().min(1).max(10).precision(2).required(),
            comment: J.string().optional().allow(''),
        });
        return await middleware(req, res, {
            bodyValidation: submitReviewValidationSchema,
            roles: [UserRoles.USER],
            validateToken: true,
            handler: async (req: AuthRequest, res: Response, manager: EntityManager) => {
                if (!req.body) throw new HttpError(400, 'Invalid request body parameters');

                const { tmdbId, userName, rating, comment } = req.body;
                const existingReview = await manager.findOne(Review, {
                    where: {
                        movieTmdbId: Number(tmdbId),
                        username: userName,
                    },
                });

                if (existingReview) {
                    const updatePayload = comment ? { rating, comment } : { rating };
                    await manager.update(Review, existingReview.id, updatePayload);

                    return res.status(200).send({ message: 'Review updated successfully' });
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
                        userId: user.id,
                    }),
                );

                return res.status(201).send(mapReview('Review created successfully', newReview));
            },
        });
    }
}
