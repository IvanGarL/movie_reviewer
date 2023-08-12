import axios, { AxiosRequestConfig, Method } from 'axios';
import 'dotenv/config';
import { PromiseTimeout } from './async';
import { isTestEnv } from './environment';
import { randomString, replaceStringParameters } from './strings';

/**
 * Enum with the available poster sizes
 */
export enum MoviePosterSizes {
    W92 = 'w92',
    W154 = 'w154',
    W185 = 'w185',
    W342 = 'w342',
    W500 = 'w500',
    W780 = 'w780',
    ORIGINAL = 'original',
}

/**
 * Interface for the movie object returned by the TMDB API.
 */
export interface TmdbMovie {
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
}

/**
 * Enum with all the API requests
 */
enum TheMovieDBRequest {
    GET_API_CONFIGURATION = 'GET_API_CONFIGURATION',
    GET_POPULAR_MOVIES = 'GET_POPULAR_MOVIES',
    POST_MOVIE_RATING = 'POST_MOVIE_RATING',
}

/**
 * Mapper with the API requests URIs
 */
const TheMovieDBRequestURI: Record<TheMovieDBRequest, string> = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: '/configuration',
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: '/movie/popular',
    [TheMovieDBRequest.POST_MOVIE_RATING]: '/movie/:id/rating',
};

/**
 * Mapper with the API requests methods
 */
const TheMovieDBRequestMethods: Record<TheMovieDBRequest, string> = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: 'GET',
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: 'GET',
    [TheMovieDBRequest.POST_MOVIE_RATING]: 'POST',
};

/**
 * Mapper with the API requests query-params variables
 */
type TheMovieDBRequestParams = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: void;
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: { page?: number; language?: string; region?: string };
    [TheMovieDBRequest.POST_MOVIE_RATING]: { guest_session_id: string };
};

/**
 * Mapper with the API requests paths variables
 */
type TheMovieDBRequestPaths = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: void;
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: void;
    [TheMovieDBRequest.POST_MOVIE_RATING]: { id: number };
};

/**
 * Mapper with the API requests body payloads
 */
type TheMovieDBPayloads = {
    [TheMovieDBRequest.GET_API_CONFIGURATION]: void;
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: void;
    [TheMovieDBRequest.POST_MOVIE_RATING]: { value: number };
};

/**
 * Mapper with the API requests response
 */
type TheMovieDBRequestResponse = {
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
    };
    [TheMovieDBRequest.GET_POPULAR_MOVIES]: {
        page: number;
        results: TmdbMovie[];
        total_pages: number;
        total_results: number;
    };
    [TheMovieDBRequest.POST_MOVIE_RATING]: {
        status_code: number;
        status_message: string;
    };
};

/**
 * TheMovieDB API client
 */
export class TheMovieDBAPIClient {
    private static instance: TheMovieDBAPIClient;

    private baseUrl: string;

    private imgBaseUrl: string;

    private apiKey: string;

    private guestSessionId: string;

    private constructor(baseUrl: string, apiKey: string, guestSessionId: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.guestSessionId = guestSessionId;
    }

    static getInstance(): TheMovieDBAPIClient {
        if (!TheMovieDBAPIClient.instance) {
            const baseUrl = process.env.TMDB_BASE_URL;
            const apiKey = process.env.TMDB_API_KEY;
            const guestSessionId = process.env.TMDB_API_GUEST_SESSION_ID;
            TheMovieDBAPIClient.instance = new TheMovieDBAPIClient(baseUrl, apiKey, guestSessionId);
            TheMovieDBAPIClient.instance.getApiConfiguration();
        }
        return TheMovieDBAPIClient.instance;
    }

    /**
     * Sends a request to the TMDB API using the axios library.
     * @param {TheMovieDBRequest} request
     * @param config.path The path variables to replace in the request URI
     * @param config.payload The body payload to send in the request
     * @param config.params The query-params to send in the request
     * @returns
     */
    private async request<R extends TheMovieDBRequest>(
        request: R,
        config?: {
            path?: TheMovieDBRequestPaths[R];
            payload?: TheMovieDBPayloads[R];
            params?: TheMovieDBRequestParams[R];
            logResponse?: boolean;
        },
    ): Promise<TheMovieDBRequestResponse[R]> {
        const url = replaceStringParameters(TheMovieDBRequestURI[request], config?.path);
        const options: AxiosRequestConfig = {
            method: TheMovieDBRequestMethods[request] as Method,
            baseURL: this.baseUrl,
            url,
            headers: {
                Authorization: isTestEnv() ? randomString() : `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        };

        if (config?.payload) {
            options.data = config.payload;
        }

        if (config?.params) {
            options.params = config.params;
        }

        try {
            console.log('TheMovieDB API request: ', JSON.stringify(options));

            const response = await PromiseTimeout(axios.request(options), 15000);
            if (config.logResponse) console.log('TheMovieDB API response: ', JSON.stringify(response?.data));

            return response?.data as TheMovieDBRequestResponse[R];
        } catch (error) {
            console.log('TheMovieDB API error:', error?.response?.data ?? error);
            throw error;
        }
    }

    /**
     * Gets the API configuration
     * @returns The API configuration
     */
    public async getApiConfiguration(): Promise<TheMovieDBRequestResponse[TheMovieDBRequest.GET_API_CONFIGURATION]> {
        const response = await this.request(TheMovieDBRequest.GET_API_CONFIGURATION, { logResponse: true });
        this.imgBaseUrl = response.images.secure_base_url;

        return response;
    }

    /**
     * Get today's popular movies
     * @param {TheMovieDBRequestParams} config.params.page The page number to fetch
     * @returns {TheMovieDBRequestResponse}
     */
    public async getPopularMovies(config?: {
        params?: TheMovieDBRequestParams[TheMovieDBRequest.GET_POPULAR_MOVIES];
    }): Promise<TheMovieDBRequestResponse[TheMovieDBRequest.GET_POPULAR_MOVIES]> {
        return this.request(TheMovieDBRequest.GET_POPULAR_MOVIES, { ...config, logResponse: false });
    }

    /**
     * Post a rating to a movie
     * @param config.paths.id The movie id
     * @param config.payload.value The rating value
     * @returns {TheMovieDBRequestResponse}
     */
    public async postMovieRating(config?: {
        path?: TheMovieDBRequestPaths[TheMovieDBRequest.POST_MOVIE_RATING];
        payload?: TheMovieDBPayloads[TheMovieDBRequest.POST_MOVIE_RATING];
    }): Promise<TheMovieDBRequestResponse[TheMovieDBRequest.POST_MOVIE_RATING]> {
        try {
            return this.request(TheMovieDBRequest.POST_MOVIE_RATING, {
                ...config,
                params: {
                    guest_session_id: this.guestSessionId,
                },
                logResponse: true,
            });
        } catch (error) {
            console.log('TheMovieDB API error trying to post review:', error?.response?.data ?? error);
        }
    }

    /**
     * Returns the full image URL
     * @param {string} path
     * @param {MoviePosterSizes} size
     * @returns {string}
     */
    public getImgUrl(path: string, size: MoviePosterSizes = MoviePosterSizes.W500): string {
        return `${this.imgBaseUrl}${size}${path}`;
    }
}
