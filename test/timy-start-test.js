const expect = require('chai').expect;
const minimist = require('minimist');
const Timy = require('../timy');

describe('Timy', function () {

    const now = new Date();

    describe('.handleStart', function () {

        it('should create new current according to provided project', function (done) {
            Timy.handleStart({}, minimist(['--start', 'ConquerTheWorld']), now, function (status, json, error) {
                expect(status).to.eql({activated: true, changed: true, error: undefined});
                expect(json).to.eql({
                    "current": {
                        start: now,
                        project: "ConquerTheWorld"
                    }
                });
                done();
            });
        });

        it('should provide an error if no value is provided for the start argument', function (done) {
            Timy.handleStart({}, minimist(['--start']), undefined, function (status, json, error) {
                expect(status).to.eql({activated: true, changed: false, error: '/!\\ Project is missing!'});
                expect(json).to.eql({});
                done();
            });
        });

        it('should create new current according to defined alias if matching', function (done) {
            const json = {
                aliases: {
                    minus: 'ConquerTheWorld'
                }
            };
            Timy.handleStart(json, minimist(['--start', 'minus']), now, function (status, json, error) {
                expect(status).to.eql({activated: true, changed: true, error: undefined});
                expect(json).to.eql({
                    aliases: {
                        minus: 'ConquerTheWorld'
                    },
                    current: {
                        start: now,
                        project: "ConquerTheWorld"
                    }
                });
                done();
            });

        });

        it('should stop existing current before create new one', function (done) {
            const json = {
                current: {
                    project: "110105",
                    start: "2018-09-26T13:04:17.075Z"
                }
            };
            Timy.handleStart(json, minimist(['--start', 'ConquerTheWorld']), now, function (status, json, error) {
                expect(status).to.eql({activated: true, changed: true, error: undefined});
                expect(json).to.eql({
                    tracks: [
                        {
                            project: "110105",
                            start: "2018-09-26T13:04:17.075Z",
                            stop: now
                        }
                    ],
                    current: {
                        start: now,
                        project: "ConquerTheWorld"
                    }
                });
                done();
            });
        });

        it('should do nothing if but no start argument provided', function (done) {
            Timy.handleStart({}, minimist(['--toto', 'ConquerTheWorld']), undefined, function (status, json, error) {
                expect(status).to.eql({activated: false, changed: false, error: undefined});
                expect(json).to.eql({});
                done();
            });
        });
    });

});
