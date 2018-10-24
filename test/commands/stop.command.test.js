const expect = require('chai').expect;
const minimist = require('minimist');
const StopCommand = require('../../commands/stop.command');


describe('Stop Command', function () {

    const now = new Date();
    var stopCommand;

    beforeEach(function () {
        stopCommand = new StopCommand();
    });

    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            stopCommand.cli(minimistOptions, usage);
            expect(minimistOptions).to.eql({alias: {}});
            expect(usage).to.eql({
                command: ' --stop [minutesToRemove]',
                comments: ["minutesToRemove: optional count of minutes to remove to current date as stop date."]
            });
        });
    });


    describe('.handle()', function () {

        it('should stop current', function (done) {
            stopCommand.handle({
                current: {
                    project: 'GothamProject',
                    start: "2018-09-26T06:53:13.716Z"
                }
            }, minimist(['--stop']), now)
                .then(status => {
                    expect(status).to.eql({
                            activated: true,
                            modified: true,
                            json: {
                                current: {},
                                tracks: [{project: "GothamProject", start: "2018-09-26T06:53:13.716Z", stop: now}]
                            }
                        }
                    );
                    done();
                })
        });

        it('should failed if no current track', function (done) {
            stopCommand.handle({}, minimist(['--stop']), now)
                .catch(error => {
                    expect(error).to.eql('/!\\ No current task to stop');
                    done();
                })
        });

        it('should do nothing if no stop argument provided', function (done) {
            stopCommand.handle({}, minimist(['--toto', 'ConquerTheWorld']), undefined)
                .then(status => {
                    expect(status).to.eql({
                        activated: false,
                        modified: false,
                        json: {}
                    });
                    done();
                });
        });

        it('should remove provided duration in minutes before to stop', function (done) {
            const start = new Date('2018-09-26T06:53:13.716Z');
            const stop = new Date('2018-09-26T16:53:s13.716Z');
            const stop10minutesBefore = new Date(stop.getTime() - 10*60*1000);
            stopCommand.handle({current: {project: 'GothamProject', start: start}}, minimist(['--stop', '19']), stop)
                .then(status => {
                    expect(status).to.eql({activated: true, modified: true, json:{
                            current: {},
                            tracks: [{project: "GothamProject", start: start, stop: stop10minutesBefore}]
                        }});
                    done();
                });
        });

        it('should provide an error if the parameter isNaN', function (done) {
            const start = new Date('2018-09-26T06:53:13.716Z');
            const stop = new Date('2018-09-26T16:53:s13.716Z');
            const json = { current: {project: 'GothamProject', start: start }};
            stopCommand.handle(json, minimist(['--stop', 'NotANumber']), stop)
                .catch(error => {
                    expect(error).to.eql('/!\\ Parameter should be a count of minutes');
                    done();
                });
        });

    });

});
