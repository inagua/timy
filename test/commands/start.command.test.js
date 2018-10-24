const expect = require('chai').expect;
const minimist = require('minimist');
const StartCommand = require('../../commands/start.command');

describe('Start Command', function () {

    const now = new Date();
    var startCommand;

    beforeEach(function () {
        startCommand = new StartCommand();
    });


    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            startCommand.cli(minimistOptions, usage);
            expect(minimistOptions).to.eql({alias: {}});
            expect(usage).to.eql({
                command: ' --start AliasOrProject',
                comments: []
            });
        });
    });


    describe('.handle()', function () {

        it('should create new current according to provided project', function (done) {
            startCommand.handle({}, minimist(['--start', 'ConquerTheWorld']), now)
                .then(
                    status => {
                        expect(status).to.eql({
                            activated: true,
                            modified: true,
                            json: {
                                "current": { start: now, project: "ConquerTheWorld" }
                            }
                        });
                        done();
                    }
                );
        });

        it('should provide an error if no value is provided for the start argument', function (done) {
            startCommand.handle({}, minimist(['--start']), undefined).catch(error => {
                expect(error).to.eql({activated: true, error: '/!\\ Project is missing!'});
                done();
            });
        });

        it('should create new current according to defined alias if matching', function (done) {
            const json = {aliases: {'Minus': 'ConquerTheWorld'}};
            startCommand.handle(json, minimist(['--start', 'minus']), now).then(status => {
                expect(status).to.eql({
                    activated: true,
                    modified: true,
                    json: {
                        aliases: {'Minus': 'ConquerTheWorld'},
                        current: {start: now, project: "ConquerTheWorld"}
                    }
                });
                done();
            });
        });

        it('should stop existing current before create new one', function (done) {
            const json = {current: {project: "110105", start: "2018-09-26T13:04:17.075Z"}};
            startCommand.handle(json, minimist(['--start', 'ConquerTheWorld']), now).then(status => {
                expect(status).to.eql({
                    activated: true,
                    modified: true,
                    json: {
                        tracks: [
                            {project: "110105", start: "2018-09-26T13:04:17.075Z", stop: now}
                        ],
                        current: {start: now, project: "ConquerTheWorld"}
                    }
                });
                done();
            });
        });

        it('should do nothing if but no start argument provided', function (done) {
            startCommand.handle({}, minimist(['--toto', 'ConquerTheWorld']), undefined).then(status => {
                expect(status).to.eql({
                    activated: false,
                    modified: false,
                    json: {}
                });
                done();
            });
        });

    });

});
