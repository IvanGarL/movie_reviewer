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
    reviews: {
        id: string;
        comment: string;
        rating: number;
        username: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
}