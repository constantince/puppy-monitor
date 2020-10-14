import assert from 'assert';
import Errors from '../src/requires/error';

const err = new Errors();

describe('error.ts test begin', () => {
    it('performance function excuted should return a string', (done) => {
        assert.equal(err.performance(), 'performace to do');
        done();
    });
});
