const expect = require('chai').expect;
const minimist = require('minimist');
const Timy = require('../timy');

describe('Timy', function () {

    const now = new Date();

    describe('.handleStop', function () {

        it('should stop current', function (done) {
            Timy.handleStop({
                current: { project: 'GothamProject', start: "2018-09-26T06:53:13.716Z" }
            }, minimist(['--stop']), now, function (status, json) {
                expect(status).to.eql({activated: true, changed: true, error: undefined});
                expect(json).to.eql({
                    current: {},
                    tracks: [{
                        project: "GothamProject", start: "2018-09-26T06:53:13.716Z", stop: now
                    }]

                });
                done();
            });
        });

        it('should failed if no current track', function (done) {
            Timy.handleStop({}, minimist(['--stop']), now, function (status, json) {
                expect(status).to.eql({activated: true, changed: false, error: '/!\\ No current task to stop'});
                expect(json).to.eql({});
                done();
            });
        });

        it('should do nothing if no stop argument provided', function (done) {
            Timy.handleStop({}, minimist(['--toto', 'ConquerTheWorld']), undefined, function (status, json, error) {
                expect(status).to.eql({activated: false, changed: false, error: undefined});
                expect(json).to.eql({});
                done();
            });
        });

        it('should remove provided duration in minutes before to stop', function (done) {
            const start = new Date('2018-09-26T06:53:13.716Z');
            const stop = new Date('2018-09-26T16:53:s13.716Z');
            const stop10minutesBefore = new Date(stop.getTime() - 10*60*1000);
            Timy.handleStop({
                current: {project: 'GothamProject', start: start,}
            }, minimist(['--stop', '19']), stop, function (status, json) {
                expect(status).to.eql({activated: true, changed: true, error: undefined});
                expect(json).to.eql({
                    current: {},
                    tracks: [{project: "GothamProject", start: start, stop: stop10minutesBefore}]
                });
                done();
            });
        });

        it('should provide an error if the parameter isNaN', function (done) {
            const start = new Date('2018-09-26T06:53:13.716Z');
            const stop = new Date('2018-09-26T16:53:s13.716Z');
            const json = { current: {project: 'GothamProject', start: start }};
            Timy.handleStop(json, minimist(['--stop', 'NotANumber']), stop, function (status, json) {
                expect(status).to.eql({activated: true, changed: false, error: '/!\\ Parameter should be a count of minutes'});
                expect(json).to.eql(json);
                done();
            });
        });

    });

});
