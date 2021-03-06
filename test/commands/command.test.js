const expect = require('chai').expect;
const minimist = require('minimist');
const Command = require('../../commands/command');

describe('Command', function () {

    var command;

    beforeEach(function () {
        command = new Command(
            /*options*/ ['some', 'synonym'],
            /*aliases*/['s', 'y'],
            /*value*/'AliasOrProject',
            /*type*/ 'string',
            /*comments*/['--some: to create some interesting content!!']
        );
    });

    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            command.cli(minimistOptions, usage);
            expect(minimistOptions).to.eql({alias: {s: 'some', y: 'some'}, string: ['some', 'synonym']});
            expect(usage).to.eql({
                command: ' --some|synonym|s|y AliasOrProject',
                comments: ["--some: to create some interesting content!!"]
            });
        });
    });

    describe('.isActivated()', function () {
        it('should return true if one of the options is provided, false elsewhere', function () {
            expect(command.isActivated(minimist(['--some']))).to.eql(true);
            expect(command.isActivated(minimist(['--synonym']))).to.eql(true);
            expect(command.isActivated(minimist(['-s']))).to.eql(true);
            expect(command.isActivated(minimist(['-y']))).to.eql(true);

            expect(command.isActivated(minimist(['--start']))).to.eql(false);
            expect(command.isActivated(minimist(['--start', '--some']))).to.eql(true);
        });
    });

    describe('.isEmpty()', function () {
        it('should return true if no option are provided, false elsewhere', function () {
            expect(command.isEmpty(minimist([]))).to.eql(true);
            expect(command.isEmpty(minimist(['']))).to.eql(true);

            expect(command.isEmpty(minimist(['--some']))).to.eql(false);
            expect(command.isEmpty(minimist(['--synonym']))).to.eql(false);
            expect(command.isEmpty(minimist(['-s']))).to.eql(false);
            expect(command.isEmpty(minimist(['-y']))).to.eql(false);
            expect(command.isEmpty(minimist(['--start']))).to.eql(false);
            expect(command.isEmpty(minimist(['--start', '--some']))).to.eql(false);
        });
    });

    describe('.getProjectForAlias()', function () {
        it('should return the project corresponding to a defined alias not case sensitive, or the given alias elsewhere', function () {
            expect(command.getProjectForAlias({aliases:{'alias':'project'}}, 'alias')).to.eql('project');
            expect(command.getProjectForAlias({aliases:{'SomeAlias':'project'}}, 'SomeAlias')).to.eql('project');
            expect(command.getProjectForAlias({aliases:{'SomeAlias':'project'}}, 'somealias')).to.eql('project');
            expect(command.getProjectForAlias({aliases:{'SomeAlias':'project'}}, 'Another')).to.eql('Another');
        });
    });

});
