const expect = require('chai').expect;
const minimist = require('minimist');
const Timy = require('../timy');

describe('Timy', function () {

    const now = new Date();

    describe('.handleStop', function () {

        it('should stop current', function (done) {
            Timy.handleStop({
                current: {
                    project: 'GothamProject',
                    start: "2018-09-26T06:53:13.716Z",
                }
            }, minimist(['--stop']), now, function (status, json) {
                expect(status).to.eql({activated: true, changed: true, error: undefined});
                expect(json).to.eql({
                    current: {},
                    tracks: [{
                        project: "GothamProject",
                        start: "2018-09-26T06:53:13.716Z",
                        stop: now
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

    });

});
