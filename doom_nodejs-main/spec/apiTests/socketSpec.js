const md5 = require("md5");
const io = require('socket.io-client');
const SETTINGS = require('../../settings');

// Перед каждым запуском тестов необходимо перезапускать сервер //

describe('check socket requests', () => {

    let socket;
    const login = 'vasya';
    const rightPassword = 123;
    const wrongPassword = 111;
    const num = Math.random();
    const testMessge = 'test message';

    beforeEach((done) => {
        socket = io(`${SETTINGS.HOST}:${SETTINGS.PORT}`);

        socket.on('connect', () => {
            console.log('\nworked...');
            done();
        });

        socket.on('disconnect', () => {
            console.log('disconnected...');
        });
    });

    afterEach((done) => { 
        if (socket.connected) {
            console.log('disconnecting');
            socket.disconnect(); 
        } else {
            console.log('no connection to break...');
        }
        done();
    });

    describe('Test login /', () => {
        it('with right password', (done) => {
            socket.on(SETTINGS.MESSAGES.LOGIN, token => {
                expect(token).toBeTruthy();
                if (token) {
                    expect(token.length).toEqual(32);
                    expect(token).toMatch(/[a-f]\d/);
                }
                done();
            });
            const hash = md5(md5(login + rightPassword) + num);
            socket.emit(SETTINGS.MESSAGES.LOGIN, { login, hash, num });
        });

        it('with wrong password', (done) => {
            socket.on(SETTINGS.MESSAGES.LOGIN, token => {
                expect(token).toBeFalsy();
                done();
            });
            const hash = md5(md5(login + wrongPassword) + num);
            socket.emit(SETTINGS.MESSAGES.LOGIN, { login, hash, num });
        });
    });
});