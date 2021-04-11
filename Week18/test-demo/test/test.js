import { equal } from 'assert';
import add from '../add.js';

describe('add function testing.', function () {
    it('1 + 2 shuld be 3', function () {
        equal(add(1, 2), 3);
    });
    it('5 + 9 shuld be 14', function () {
        equal(add(5, 9), 14);
    });
});

describe('add function testing.', function () {
    it('3 + 4 shuld be 7', function () {
        equal(add(3, 4), 7);
    });
    it('7 + 8 shuld be 15', function () {
        equal(add(7, 8), 15);
    });
});