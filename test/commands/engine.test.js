const expect = require('chai').expect;
const minimist = require('minimist');
const Engine = require('../../commands/engine');


describe('Engine', function () {

    var engine;

    beforeEach(function () {
        engine = new Engine();
    });


    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            engine.cli(minimistOptions, usage);
            // expect(minimistOptions).to.eql({alias: {"a": "alias"}, string: ["alias"]});
            expect(usage).to.eql({
                command: '--alias|a \"alias:project\"',
                comments: []
            });
        });
    });


    describe('.handle()', function () {

        it('should add new alias to a project with *alias* argument', function (done) {
            engine.handle({}, minimist(['--alias', 'MyAlias:MyProject']))
                .then(status => {
                    expect(status).to.eql({
                        activated: true,
                        modified: true,
                        json: {aliases: {'MyAlias': 'MyProject'}}
                    });
                    done();
                })
        });

    });
});
