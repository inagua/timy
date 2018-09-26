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

    describe('.handleComment', function () {

        it('should put comment on current track', function () {
            const comment = 'make some refactoring';
            Timy.handleComment(json, minimist(['--comment', comment]));
            expect(json.current).to.eql({
                "start": "2018-09-26T13:04:17.075Z",
                "project": "110105",
                "comments": [comment]
            });
        });

        it('should do nothing if there is no current track', function () {
            json.current = {};
            Timy.handleComment(json, minimist(['--comment', "some comment"]));
            expect(json.current).to.eql({});
        });

    });

});
