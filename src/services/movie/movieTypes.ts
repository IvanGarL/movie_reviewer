import { ReviewResponse } from '../review/reviewTypes';

/**
 * Response for the GET /movies/{tmdbId}/reviews endpoint
 */
export interface MovieReviewsResponse {
    id: string;
    tmdbId: number;
    title: string;
    overview: string;
    posterPath: string;
    releaseDate: Date;
    reviews: ReviewResponse[];
    pageCount: number;
    pages: number;
}
