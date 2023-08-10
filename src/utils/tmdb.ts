export enum MoviePosterSizes {
    W92 = 'w92',
    W154 = 'w154',
    W185 = 'w185',
    W342 = 'w342',
    W500 = 'w500',
    W780 = 'w780',
    ORIGINAL = 'original',
}

export enum TheMovieDBRequest {
    GET_API_CONFIGURATION = 'GET_API_CONFIGURATION',
    GET_POPULAR_MOVIES = 'GET_POPULAR_MOVIES',
    POST_MOVIE_RATING = 'POST_MOVIE_RATING',
}

export const TheMovieDBRequestURI: Record<TheMovieDBRequest, string> = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: '/configuration',
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: '/movie/popular',
    [TheMovieDBRequest.POST_MOVIE_RATING]: '/movie/:id/rating',
}

export const TheMovieDBRequestMethods: Record<TheMovieDBRequest, string> = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: 'GET',
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: 'GET',
    [TheMovieDBRequest.POST_MOVIE_RATING]: 'POST',
}

export type TheMovieDBRequestParams = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: void;
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: { page?: number, language?: string, region?: string };
    [TheMovieDBRequest.POST_MOVIE_RATING]: { guest_session_id: string };
}

export type TheMovieDBRequestPaths = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: void;
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: void;
    [TheMovieDBRequest.POST_MOVIE_RATING]: { id: string };
}

export type TheMovieDBPayloads = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: void;
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: void;
    [TheMovieDBRequest.POST_MOVIE_RATING]: { value: number };
}

export type TheMovieDBRequestResponse = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: {
        images: {
            base_url: string;
            secure_base_url: string;
            backdrop_sizes: string[];
            logo_sizes: string[];
            poster_sizes: MoviePosterSizes[];
            profile_sizes: string[];
            still_sizes: string[];
        };
        change_keys: string[];
    },
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: {
        page: number;
        results: {
            adult: boolean;
            backdrop_path: string;
            genre_ids: number[];
            id: number;
            original_language: string;
            original_title: string;
            overview: string;
            popularity: number;
            poster_path: string;
            release_date: string;
            title: string;
            video: boolean;
            vote_average: number;
            vote_count: number;
        }[];
        total_pages: number;
        total_results: number;
    },
    [TheMovieDBRequest.POST_MOVIE_RATING]: {
        status_code: number;
        status_message: string;
    },
}

export class TheMovieDBAPI {

    private baseUrl: string;

    private imgBaseUrl: string;

    private apiKey: string;

    private guestSessionId: string;

    constructor(baseUrl: string, apiKey: string, guestSessionId: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.guestSessionId = guestSessionId;
    }

}