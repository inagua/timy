const expect = require('chai').expect;
const minimist = require('minimist');
const Timy = require('../timy');

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
                    "project": "112505",
                    "stop": "2018-09-26T07:06:22.141Z"
                },
            ],
            "current": {
                "project": "110105",
                "start": "2018-09-26T13:04:17.075Z"
            }
        };
    });

    describe('.handleSetup', function () {

        it('should create new JSON if empty and setup argument provided', function () {
            expect(Timy.handleSetup(undefined, minimist(['--setup']))).to.eql({
                "aliases": {},
                "tracks": [],
                "current": {}
            });
        });

        it('should not create new JSON if empty but no setup argument provided', function () {
            expect(Timy.handleSetup(undefined, minimist(['--toto']))).to.eql(undefined);
        });

        it('should create new JSON if not empty and setup argument provided', function () {
            expect(Timy.handleSetup(json, minimist(['--setup']))).to.eql({
                "aliases": {},
                "tracks": [],
                "current": {}
            });
        });

        it('should not create new JSON if not empty but no setup argument provided', function () {
            expect(Timy.handleSetup(json, minimist(['--toto']))).to.eql(json);
        });

    });

});
