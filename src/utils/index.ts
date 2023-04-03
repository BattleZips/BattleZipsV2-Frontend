/**
 * Generates a fixed-time promise to delay execution of subsequent actions 
 * 
 * @param {number} ms - number of millesecond to delay 
 * @returns {Promise<unknown>} - promise that will resolve in fixed time
 */
export const delay = (ms: number): Promise<unknown> =>
    new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate a random number inside a specified range
 * 
 * @param {number} min - range minimum 
 * @param {number} max - range maximum 
 * @returns {number} - random number
 */
export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shorten ethereum address to provide cleaner display format
 * 
 * @param {string | null | undefined} address - ethereum address 
 * @param {string |null | underfined } ensName - ens name if one exists 
 * @param {number} chars - number of address characters to display on each side of splice
 * @returns {string} - shortened address
 */
export const formatAddress = (
    address: string | null | undefined,
    ensName: string | null | undefined,
    chars = 4
): string => {
    if (ensName) return ensName;
    else if (address)
        return `${address
            .substring(0, chars + 2)
            .toLowerCase()}...${address.substring(42 - chars)}`;
    else return '';
}