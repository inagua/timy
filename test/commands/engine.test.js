const expect = require('chai').expect;
const minimist = require('minimist');
const Engine = require('../../commands/engine');


describe('Engine', function () {

    var engine;
    var jsonWithCurrent;

    beforeEach(function () {
        engine = new Engine();

        jsonWithCurrent = {
            current: {
                "project": "110105",
                "start": "2018-09-26T13:04:17.075Z"
            }
        };

    });


    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            engine.cli(minimistOptions, usage);
            // expect(minimistOptions).to.eql({alias: {"a": "alias"}, string: ["alias"]});
            expect(usage).to.eql({
                command: '--alias|a \"alias:project\"--comment \"Some comment\"',
                comments: []
            });
        });
    });


    describe('.handle()', function () {

        it('should add new alias to a project with *alias* argument', function (done) {
            engine.handle({}, minimist(['--alias', 'MyAlias:MyProject']))
                .then(status => {

                    console.log('>>>>> 1:', JSON.stringify(status));

                    expect(status).to.eql({
                        activated: true,
                        modified: true,
                        json: {aliases: {'MyAlias': 'MyProject'}}
                    });
                    done();
                })
        });

        it('should put comment on current track', function (done) {
            const comment = 'make some refactoring';
            engine.handle(jsonWithCurrent, minimist(['--comment', comment]))
                .then(status => {
                    expect(status).to.eql({
                        activated: true,
                        modified: true,
                        json: {
                            current: {
                                "start": "2018-09-26T13:04:17.075Z",
                                "project": "110105",
                                "comments": [comment]
                            }
                        }
                    });
                    done();
                });
        });



    });
});
