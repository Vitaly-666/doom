const SETTINGS = require('../../settings');
const DB = require('../../application/modules/db/DB');
const User = require('../../application/modules/users/User');
const md5 = require('md5');

describe("Check User class", () => {

    const db = new DB(SETTINGS.DATABASE);
    const user = new User(db);

    // тесты на авторизацию
    it("user auth", async () => {
        expect(
            await user.auth()
        ).toBe(false);
        expect(
            await user.auth({ login: 'vasya', hash: md5(md5('vasya123') + 1), num: 1 })
        ).toBe(true);
    });

    // тесты на регистрацию
    /* it("user registration", async () => {
        expect(
            await user.registration({})
        ).toBe(false);
        expect(
            await user.registration({ login: 'kolya', nickname: 'коля', passHash: md5('kolya123') })
        ).toBe(false);
    }); */
    
    //тесты на логаут
    /* it("user logout", async () => {
        expect(
            await user.logout()    
        );
    }); */
});