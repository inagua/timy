const expect = require('chai').expect;
const minimist = require('minimist');
const RestartCommand = require('../../commands/restart.command');


describe('Restart Command', function () {

    const now = new Date();
    var json;
    var restartCommand;

    beforeEach(function () {
        json = {
            "aliases": {
                "myprojectalias": "112505",
            },
            "tracks": [
                {
                    "start": "2018-09-26T06:53:13.716Z",
                    "project": "ConquerTheWorld",
                    "stop": "2018-09-26T07:06:22.141Z"
                },
            ],
            "current": {}
        };

        restartCommand = new RestartCommand();
    });


    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            restartCommand.cli(minimistOptions, usage);
            expect(minimistOptions).to.eql({alias: {}});
            expect(usage).to.eql({
                command: '--restart undefined',
                comments: []
            });
        });
    });


    describe('.handle()', function () {

        it('1/ should exit on error if a current task exist WITH report parameter', function (done) {
            json.current = {
                "project": "110105",
                "start": "2018-09-26T13:04:17.075Z"
            };
            const backup = Object.assign({}, json);
            restartCommand.handle(json, minimist(['--restart']), now).catch(error => {
                expect(error).to.eql('/!\\ Can not restart because a task is pending.');
                done();
            });

        });

        it('2/ should NOT exit on error if a current task exist WITHOUT report parameter', function (done) {
            json.current = {
                "project": "110105",
                "start": "2018-09-26T13:04:17.075Z"
            };
            const backup = Object.assign({}, json);
            restartCommand.handle(json, minimist(['--AnyThingElse']), now)
                .then(status => {
                    expect(status).to.eql({activated: false, modified: false, json: backup});
                    done();
                })
            ;
        });

        it('3/ should exit on error if no closed tracks exist WITH report parameter', function (done) {
            json.tracks = undefined;
            restartCommand.handle(json, minimist(['--restart']), now)
                .catch(error => {
                    expect(error).to.eql('/!\\ Can not restart because no closed task.');
                    done();
                })
        });

        it('4/ should NOT exit on error if no closed tracks exist WITHOUT report parameter', function (done) {
            json.tracks = undefined;
            const backup = Object.assign({}, json);
            restartCommand.handle(json, minimist(['--AnyThingElse']), now).then((status) => {
                expect(status).to.eql({activated: false, modified: false, json: backup});
                done();
            });
        });

        it('5/ should create current from last closed track WITH restart parameter', function (done) {
            restartCommand.handle(json, minimist(['--restart']), now).then(status => {
                expect(status.activated).to.eql(true);
                expect(status.modified).to.eql(true);
                expect(status.json.current).to.eql({
                    project: "ConquerTheWorld",
                    start: now,
                    stop: undefined,
                    comments: undefined
                });
                done();
            });
        });

        it('6/ should NOT create current from last closed track WITHOUT report parameter', function (done) {
            const backup = Object.assign({}, json);
            restartCommand.handle(json, minimist(['--AnyThingElse']), now).then(status => {
                expect(status).to.eql({
                    activated: false,
                    modified: false,
                    json: backup
                });
                done();
            });
        });

        it('7/ should not take comments of the restarted track', function (done) {
            json.tracks[json.tracks.length - 1].comments = ['setup environment', 'call client'];
            restartCommand.handle(json, minimist(['--restart']), now).then(status => {
                expect(status.activated).to.eql(true);
                expect(status.modified).to.eql(true);
                expect(status.json.current).to.eql({
                    project: "ConquerTheWorld",
                    start: now,
                    stop: undefined,
                    comments: undefined
                });
                done();
            });
        });

    });

});
