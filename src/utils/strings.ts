import { Chance } from 'chance';

const chance = new Chance();

/**
 * Create a random string
 * @param length 
 * @returns {string}
 */
export const randomString = (length?: number): string => chance.string({ length: length ?? 20 });


/**
 * It replaces some parameters in a string, the string should be in this way: 'account/:accountIt'
 * @param {string} value  text to clear of accents and special characters
 * @returns {string} text without accents or special characters
 */
export const replaceStringParameters = <T>(string: string, parameters?: T): string => {
    if (!parameters) return string;

    Object.keys(parameters).forEach(key => {
        string = string.replace(`:${key}`, parameters[key]);
    });

    return string;
};