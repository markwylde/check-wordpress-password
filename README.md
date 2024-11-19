# check-wordpress-password

`check-wordpress-password` is a simple Node.js module designed to verify if a password matches a WordPress-generated password hash. It is particularly useful for developers looking to authenticate users against WordPress-stored credentials.

## Features

- Verify passwords against WordPress `$P$` and `$H$` password hashes.
- Uses a custom Base64 encoding for secure password hashing.
- Written in TypeScript for type safety.

## Installation

To use `check-wordpress-password` in your project, install it using npm:

```bash
npm install check-wordpress-password
```

## Usage

To verify a password against a WordPress password hash, simply import the module and use the `checkPassword` function:

```typescript
import checkPassword from 'check-wordpress-password';

// Sample usage
const password = 'my-super-secret-password';
const hash = '$P$B7Uo6J7dq/rh./6eMoOpqAQHiQCNR0.';

const isValid = checkPassword(password, hash);

console.log(isValid); // Outputs: true or false
```

## API

### `checkPassword(password: string, hash: string): boolean`

Verifies a password against a given hashed password.

- **password**: The plain text password you want to verify.
- **hash**: The WordPress-generated hash to check the password against.

**Returns**: `true` if the password matches the hash, otherwise `false`.

## Development

### Build

To build the project, run:

```bash
npm run build
```

### Tests

To execute the test suite, use:

```bash
npm run test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
