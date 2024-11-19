import test from 'node:test';
import assert from 'node:assert';
import { checkPassword, generateHash } from './index';

const testHashes = [
  { password: 'MyPassword', hash: '$P$B.zQTNucMpey3847Jg.G6H33KQT9jJ1' },
  { password: 'testing123', hash: '$P$BHJ3LEUbNp8IE8phLSaWtgXusQJcBP.' },
  { password: '£@testing123@', hash: '$P$B8a.FgVZ7APRpGw4MI66qLZKiFh2LL/' },
  { password: '!', hash: '$P$BeiCATFzIadqECJtGPAnJjf5eewW4b0' },

];

test('test list of hashes', () => {
  testHashes.forEach(({ password, hash }) => {
    assert.ok(checkPassword(password, hash));
  });
});


test('should return true if password is correct', () => {
  const password =  'ThisIsMyPassword';
  const hash = generateHash(password, 10);
  const success = checkPassword(password, hash);

  assert.equal(success, true);
})

test('should return false if password is incorrect', () => {
  const password =  'incorrect';
  const hash = generateHash('correct', 10);
  const success = checkPassword(password, hash);

  assert.equal(success, false);
});

test('should return false if hash is invalid', () => {
  const password =  'incorrect';
  const hash = 'invalid';
  const success = checkPassword(password, hash);

  assert.equal(success, false);
});

test('should return false if password is empty', () => {
  const password =  '';
  const hash = generateHash('correct', 10);
  const success = checkPassword(password, hash);

  assert.equal(success, false);
});

test('should return false if hash is empty', () => {
  const password =  'incorrect';
  const hash = '';
  const success = checkPassword(password, hash);

  assert.equal(success, false);
});
