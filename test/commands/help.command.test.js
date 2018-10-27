const expect = require('chai').expect;
const minimist = require('minimist');
const HelpCommand = require('../../commands/help.command');


describe('Help Command', function () {

    const now = new Date();
    var command;

    beforeEach(function () {
        command = new HelpCommand();
    });

    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            command.cli(minimistOptions, usage);
            expect(minimistOptions).to.eql({alias: {"h": "help"}});
            expect(usage).to.eql({
                command: ' --help|usage|sos|h',
                comments: []
            });
        });
    });


    describe('.handle()', function () {

        it('should return the provided help tips', function (done) {
            command.setHelp(['some', 'useful', 'tips']);
            command.handle({}, minimist(['--help']), now)
                .then(status => {
                    expect(status).to.eql({
                            activated: true,
                            modified: false,
                            json: {},
                            help: ['some', 'useful', 'tips']
                        }
                    );
                    done();
                })
        });

        it('should return the provided help tips if no command provided', function (done) {
            command.setHelp(['some', 'useful', 'tips']);
            command.handle({}, minimist([]), now)
                .then(status => {
                    expect(status).to.eql({
                            activated: true,
                            modified: false,
                            json: {},
                            help: ['some', 'useful', 'tips']
                        }
                    );
                    done();
                })
        });

        it('should do nothing if no --help argument provided', function (done) {
            command.handle({}, minimist(['--toto']), undefined)
                .then(status => {
                    expect(status).to.eql({
                        activated: false,
                        modified: false,
                        json: {}
                    });
                    done();
                });
        });

    });

});
