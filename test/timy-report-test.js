const expect = require('chai').expect;
const minimist = require('minimist');
const Timy = require('../timy');

describe('Timy', function () {

    var json;

    beforeEach(function () {
        json = {
            "aliases": {
                "gtechna": "112505",
                "CivilCalendar": "110105"
            },
            "tracks": [
                // 2018-09-25
                {
                    "start": "2018-09-26T06:53:13.716Z",
                    "project": "112505",
                    "stop": "2018-09-25T07:06:22.141Z",
                    "comments": ["a", "b"]
                },
                {
                    "start": "2018-09-26T07:06:22.141Z",
                    "project": "110105",
                    "stop": "2018-09-25T09:48:30.921Z",
                    "comments": ["c"]
                },
                // 2018-09-26
                {
                    "start": "2018-09-26T06:53:13.716Z",
                    "project": "112505",
                    "stop": "2018-09-26T07:06:22.141Z",
                    "comments": ["d", "e"]
                },
                {
                    "start": "2018-09-26T07:06:22.141Z",
                    "project": "110105",
                    "stop": "2018-09-26T09:48:30.921Z",
                    "comments": ["f"]
                },
                {
                    "start": "2018-09-26T10:43:22.644Z",
                    "project": "110105",
                    "stop": "2018-09-26T11:43:06.945Z",
                    "comments": ["g", "h"]
                },
                {
                    "start": "2018-09-26T11:43:06.945Z",
                    "project": "112505",
                    "stop": "2018-09-26T13:04:17.075Z",
                    "comments": ["i"]
                },
            ],
            "current": {
                "start": "2018-09-26T13:04:17.075Z",
                "project": "110105",
                "comments": [
                    "Setup local environment"
                ],
            }

        };
    });

    describe('.handleReport', function () {

        it('should create an item per project for the current day if report argument is provided', function () {
            const now = new Date('2018-09-26T14:14:37.075Z');
            expect(Timy.handleReport(json, minimist(['--report']), now)).to.eql({
                projects: [
                    {project: '110105', alias: 'CivilCalendar', seconds: 17532, comments: ["f", "g", "h"]},
                    {project: '112505', alias: 'gtechna', seconds: 5658, comments: ["d", "e", "i"]}
                ],
                current: {project: "110105", alias: "CivilCalendar", seconds: 4220},
                seconds: 17532 + 5658
            });
        });

        it('should return nothing if report argument is missing', function () {
            const now = new Date('2018-09-26T14:14:37.075Z');
            expect(Timy.handleReport(json, minimist(['--toto']), now)).to.eql(undefined);
        });

        it('[BUGFIX] should not add empty comments or alias if not present in tracks', function () {
            const now = new Date('2018-09-28T14:14:37.075Z');
            json.current = undefined;
            json.tracks.push({
                "start": "2018-09-28T11:43:06.945Z",
                "project": "GothamProject",
                "stop": "2018-09-28T13:04:17.075Z"
            });

            expect(Timy.handleReport(json, minimist(['--report']), now)).to.eql({
                projects: [{project: 'GothamProject', seconds: 4870, comments: []}],
                seconds: 4870
            });
        });

    });

});
