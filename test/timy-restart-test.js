const expect = require('chai').expect;
const minimist = require('minimist');
const Timy = require('../timy');
const now = new Date();

describe('Timy', function () {

    var json;

    beforeEach(function(){
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
    });

    describe('.handleRestart', function () {

        // it('1/ should exit on error if a current task exist WITH report parameter', function (done) {
        //     json.current = {
        //         "project": "110105",
        //         "start": "2018-09-26T13:04:17.075Z"
        //     };
        //     const backup = Object.assign({}, json);
        //     expect(Timy.handleRestart(json, minimist(['--restart']), now, function (changed, error) {
        //         expect(changed).to.eql(false);
        //         expect(error).to.eql(' /!\\ Can not restart because a task is pending.');
        //         expect(json).to.eql(backup);
        //         done();
        //     }));
        // });
        //
        // it('2/ should NOT exit on error if a current task exist WITHOUT report parameter', function (done) {
        //     json.current = {
        //         "project": "110105",
        //         "start": "2018-09-26T13:04:17.075Z"
        //     };
        //     const backup = Object.assign({}, json);
        //     expect(Timy.handleRestart(json, minimist(['--AnyThingElse']), now, function (changed, error) {
        //         expect(changed).to.eql(false);
        //         expect(error).to.eql(undefined);
        //         expect(json).to.eql(backup);
        //         done();
        //     }));
        // });
        //
        // it('3/ should exit on error if no closed tracks exist WITH report parameter', function (done) {
        //     json.tracks = undefined;
        //     const backup = Object.assign({}, json);
        //     expect(Timy.handleRestart(json, minimist(['--restart']), now, function (changed, error) {
        //         expect(changed).to.eql(false);
        //         expect(error).to.eql(' /!\\ Can not restart because no closed task.');
        //         expect(json).to.eql(backup);
        //         done();
        //     }));
        // });
        //
        // it('4/ should NOT exit on error if no closed tracks exist WITHOUT report parameter', function (done) {
        //     json.tracks = undefined;
        //     const backup = Object.assign({}, json);
        //     expect(Timy.handleRestart(json, minimist(['--AnyThingElse']), now, function (changed, error) {
        //         expect(changed).to.eql(false);
        //         expect(error).to.eql(undefined);
        //         expect(json).to.eql(backup);
        //         done();
        //     }));
        // });
        //
        // it('5/ should create current from last closed track WITH report parameter', function (done) {
        //     Timy.handleRestart(json, minimist(['--restart']), now, function (changed, error) {
        //         expect(changed).to.eql(true);
        //         expect(error).to.eql(undefined);
        //         expect(json.current).to.eql({
        //             project: "ConquerTheWorld",
        //             start: now,
        //             stop: undefined,
        //             comments: undefined
        //         });
        //         done();
        //     });
        // });
        //
        // it('6/ should NOT create current from last closed track WITHOUT report parameter', function (done) {
        //     const backup = Object.assign({}, json);
        //     Timy.handleRestart(json, minimist(['--AnyThingElse']), now, function (changed, error) {
        //         expect(changed).to.eql(false);
        //         expect(error).to.eql(undefined);
        //         expect(json).to.eql(backup);
        //         done();
        //     });
        // });
        //
        // it('7/ should not take comments of the restarted track', function (done) {
        //     json.tracks[json.tracks.length - 1].comments = [ 'setup environment', 'call client' ];
        //     Timy.handleRestart(json, minimist(['--restart']), now, function (changed, error) {
        //         expect(changed).to.eql(true);
        //         expect(error).to.eql(undefined);
        //         expect(json.current).to.eql({
        //             project: "ConquerTheWorld",
        //             start: now,
        //             stop: undefined,
        //             comments: undefined
        //         });
        //         done();
        //     });
        // });


    });

});
