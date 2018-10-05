const expect = require('chai').expect;
const minimist = require('minimist');
const AliasCommand = require('../commands/alias.command');


describe('Alias Command', function () {

    var aliasCommand;

    beforeEach(function () {
        aliasCommand = new AliasCommand();
    });


    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            aliasCommand.cli(minimistOptions, usage);
            expect(minimistOptions).to.eql({alias: {"a": "alias"}, string: ["alias"]});
            expect(usage).to.eql({
                command: '--alias|a \"alias:project\"',
                comments: []
            });
        });
    });


    describe('.handle()', function () {

        it('should add new alias to a project', function (done) {
            aliasCommand.handle({}, minimist(['--alias', 'MyAlias:MyProject']))
                .then(status => {
                    expect(status).to.eql({
                        activated: true,
                        modified: true,
                        json: {aliases: {myalias: 'MyProject'}}
                    });
                    done();
                });
        });

        it('should add new alias to a project', function (done) {
            aliasCommand.handle({}, minimist(['-a', 'MyAlias:MyProject']))
                .then(status => {
                    expect(status).to.eql({
                        activated: true,
                        modified: true,
                        json: {aliases: {myalias: 'MyProject'}}
                    });
                    done();
                });
        });

        it('should exit on error if no text provided', function (done) {
            aliasCommand.handle({}, minimist(['--alias']))
                .catch(error => {
                    expect(error).to.eql('/!\\ Invalid parameter for alias aka alias:project');
                    done();
                });
        });

        it('should exit on error if parameter is invalid', function (done) {
            aliasCommand.handle({}, minimist(['--alias', 'aliasWithoutProject']))
                .catch(error => {
                    expect(error).to.eql('/!\\ Invalid parameter for alias aka alias:project');
                    done();
                });
        });

        it('should do nothing if but no start argument provided', function (done) {
            aliasCommand.handle({}, minimist(['--toto']), undefined).then(status => {
                expect(status).to.eql({activated: false, modified: false, json: {}});
                done();
            });
        });
    });
});
