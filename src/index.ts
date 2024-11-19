import crypto from 'node:crypto';

/**
 * Returns the custom Base64 alphabet used for encoding.
 *
 * @returns {string} The Base64 alphabet.
 */
function itoa64(): string {
    return './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
}

/**
 * Hashes a password using the provided salt and settings.
 *
 * @param {string} password - The password to hash.
 * @param {string} setting - The hash setting string containing salt and iteration count.
 * @param {string} itoa64 - The custom Base64 alphabet.
 * @returns {string} The hashed password.
 * @throws {Error} If the iteration count or salt length is invalid.
 */
function cryptPrivate(password: string, setting: string, itoa64: string): string {
    const count_log2 = itoa64.indexOf(setting[3]);
    if (count_log2 < 7 || count_log2 > 30) {
        throw new Error('Invalid iteration count');
    }

    const count = 1 << count_log2;
    const salt = setting.slice(4, 12);
    if (salt.length !== 8) {
        throw new Error('Invalid salt length');
    }
    let hash = crypto.createHash('md5').update(salt + password).digest();
    for (let i = 0; i < count; i++) {
        hash = crypto.createHash('md5').update(Buffer.concat([hash, Buffer.from(password)])).digest();
    }
    return setting.slice(0, 12) + encode64(hash, 16, itoa64);
}

/**
 * Encodes binary data to a string using a custom Base64 alphabet.
 *
 * @param {Buffer} input - The input buffer to encode.
 * @param {number} count - The number of bytes to encode.
 * @param {string} itoa64 - The custom Base64 alphabet.
 * @returns {string} The encoded string.
 */
function encode64(input: Buffer, count: number, itoa64: string): string {
    let output = '';
    let i = 0;
    while (i < count) {
        let value = input[i++];
        output += itoa64[value & 0x3f];

        if (i < count) {
            value |= input[i] << 8;
            output += itoa64[(value >> 6) & 0x3f];
            i++;
        } else {
            output += itoa64[(value >> 6) & 0x3f];
            break;
        }
        if (i < count) {
            value |= input[i] << 16;
            output += itoa64[(value >> 12) & 0x3f];
            i++;
        } else {
            output += itoa64[(value >> 12) & 0x3f];
            break;
        }

        output += itoa64[(value >> 18) & 0x3f];
    }

    return output;
}

/**
 * Generates a hash for a given password using a random salt and specified iteration count.
 *
 * @param {string} password - The password to hash.
 * @param {number} iterationCountLog2 - Log2 of the iteration count (must be between 7 and 30).
 * @returns {string} The generated hashed password.
 * @throws {Error} If the iteration count log2 is out of range.
 */
export function generateHash(password: string, iterationCountLog2: number): string {
    const itoa64Str = itoa64();
    if (iterationCountLog2 < 7 || iterationCountLog2 > 30) {
        throw new Error('Invalid iteration count log2');
    }

    // Convert the iteration count log2 to the corresponding character from the itoa64
    const countChar = itoa64Str[iterationCountLog2];

    // Create a random 8-character salt
    const saltBytes = crypto.randomBytes(6); // 6 bytes to encode as 8 characters
    const salt = encode64(saltBytes, 6, itoa64Str);

    // Create hash setting string
    const setting = `$P$${countChar}${salt}`;

    return cryptPrivate(password, setting, itoa64Str);
}

/**
 * Verifies a password against a hashed password.
 *
 * @param {string} password - The password to verify.
 * @param {string} hash - The hashed password.
 * @returns {boolean} True if the password matches the hash, otherwise false.
 */
export function checkPassword(password: string, hash: string): boolean {
    const itoa64Str = itoa64();
    if (hash.startsWith('$P$') || hash.startsWith('$H$')) {
        const computedHash = cryptPrivate(password, hash, itoa64Str);
        return computedHash === hash;
    } else {
        // Unsupported hash format
        return false;
    }
}
