const Answer = require('../application/routers/Answer');

describe("Check Answer class", () => {

    const answer = new Answer;

    it("good answer", () => {
        expect(answer.good({ any: 123 }))
            .toEqual({ result: 'ok', data: { any: 123 } });
    });

    it("bad answer", () => {
        expect(answer.bad(8696))
            .toEqual({ result: 'error', error: { code: 8696, text: undefined } });
    });
});