'use strict';

const Async = require('async');
const Chalk = require('chalk');
const Vorpal = require('vorpal')();
const Emoji = require('node-emoji');
const Exec = require('child_process').exec;

let machinesKnown = ['mac', 'ubuntu'];

let systemCommands;
let setUpRequirements;
let preRequisites;
let softwaresAvailable = {};

Vorpal
    .command('setup', 'Initaes system setup for development environment')
    .action(function(args, callback) {
        const self = this; // eslint-disable-line

        self.prompt({
            type: 'input',
            name: 'machine',
            message: '\nWhat machine you wants to setup ' + machinesKnown.toString() + '? '
        }, function(result) {
            let machine = result.machine || '';
            machine = machine.toLowerCase().trim();

            self.log('\n');
            self.log('################### ', Chalk.underline.green(machine.toUpperCase()), ' ###################');

            self.log('Operating according to guideleines of', machine, ' ...');

            if (machinesKnown.indexOf(machine) < 0) {
                self.log('Do not know about this machine till now');
                return callback();
            }

            if (machine === 'ubuntu') {
                self.log('Still learning this machine, so its better if i do not operate');
                return callback();
            }

            systemCommands = require('./machines')(machine);

            // Check preRequisites
            preRequisites = systemCommands.preRequisites;
            let preRequisiteCounter = 1;
            self.log('Checking necessary parts of machine ...');
            Async.eachSeries(preRequisites, function(preRequisite, callback) {
                self.log('\n', preRequisiteCounter.toString(), '. ', Chalk.underline.green(preRequisite.name));
                self.log('\nChecking if', preRequisite.name, 'already exists in your machine ...');
                Exec(preRequisite.testCommand, function(error, stdout, stderr) {
                    if (error) {
                        self.log(
                            'Does not exist,',
                            'Please add this first using command',
                            Chalk.underline.bold.red(preRequisite.installCommand)
                        );
                        return callback(error);
                    }
                    self.log(preRequisite.name, 'is already present in this machine');
                    preRequisiteCounter += 1;
                    return callback();
                });
            }, function(error, result) {
                if (error) {
                    // Stop execution here
                    return callback();
                }

                self.log('\nAll necessary parts exists');

                self.log('\nFetching required tools', Emoji.find('wrench').emoji, ' for ', machine, ' ...');
                setUpRequirements = systemCommands.setUpRequirements;

                // Install setup Requirements
                self.log('Checking compatiblity of other machine parts with new parts');
                let setUpRequirementsCounter = 1;
                Async.eachSeries(setUpRequirements, function(setUpRequirement, callback) {
                    self.log('\n',
                        setUpRequirementsCounter.toString(),
                        '. ',
                        Chalk.underline.green(setUpRequirement.name)
                    );
                    self.log('Checking if', setUpRequirement.name, 'already exists in your machine ...');
                    Exec(setUpRequirement.testCommand, function(error, stdout, stderr) {
                        if (!error) {
                            self.log(setUpRequirement.name, 'is already present in this machine');
                            return callback();
                        }

                        self.log(
                            'Machine part',
                            Chalk.underline.green(setUpRequirement.name),
                            'does not exist, adding ...'
                        );

                        self.log('This might take some time ...');

                        Exec(setUpRequirement.installCommand, function(error, stdout, stderr) {
                            if (error) {
                                self.log(
                                    '\nMachine part',
                                    Chalk.underline.green(setUpRequirement.name),
                                    'is not compatible with this machine,',
                                    'Tried using command',
                                    Chalk.underline.bold.red(setUpRequirement.installCommand),
                                    'Please report it\n'
                                );
                                self.log(Chalk.underline.bold.red('Also attach given error'), error);
                                return callback(error);
                            }
                            self.log(
                                'New part',
                                Chalk.underline.green(setUpRequirement.name),
                                'added to machine, continuing ...'
                            );
                            setUpRequirementsCounter += 1;
                            return callback();
                        });
                    });
                }, function(error, result) {
                    if (error) {
                        // Stop execution here
                        return callback();
                    }

                    systemCommands.softwaresAvailable.forEach(function(software) {
                        softwaresAvailable[software.name] = software;
                    });
                    self.log('\nAll necessary compatiblity checked, now you can proceed to install\n');
                    return callback();
                });
            });
        });
    });

Vorpal
    .command('install', 'Installs given software')
    .action(function(args, callback) {
        const self = this; // eslint-disable-line

        if (!systemCommands) {
            self.log('I can not install any part till you provide machine using setup command');
            return callback();
        }

        let softwareCounter = 1;
        Async.eachSeries(softwaresAvailable, function(software, callback) {
            self.log('\n', softwareCounter.toString(), '. ', Chalk.underline.green(software.name));

            if (software.testCommand) {
                self.log('Checking if', software.name, 'already exists in your machine ...');
                Exec(software.testCommand, function(error, stdout, stderr) {
                    if (stdout.toString().indexOf('Good') > -1) {
                        self.log(software.name, 'is already present in this machine');
                        softwareCounter += 1;
                        return callback();
                    }

                    if (software.testCommand.indexOf('brew ls') > -1) {
                        if (stdout.indexOf(software.realName) > -1) {
                            self.log(software.name, 'is already present in this machine --', stdout);
                            softwareCounter += 1;
                            return callback();
                        }
                    }

                    if (!error) {
                        self.log(software.name, 'is already present in this machine');
                        softwareCounter += 1;
                        return callback();
                    }

                    self.log(software.name, 'does not exist in this machine, installing ...');
                    Exec(software.installCommand, function(error, stdout, stderr) {
                        if (!error) {
                            self.log(software.name, 'added successfully in this machine');
                            softwareCounter += 1;
                            return callback();
                        }

                        softwareCounter += 1;
                        self.log('Failed to add', software.name, 'try again after some time');
                        return callback();
                    });
                });
            } else {
                Exec(software.installCommand, function(error, stdout, stderr) {
                    if (!error) {
                        self.log(software.name, 'added successfully in this machine');
                        softwareCounter += 1;
                        return callback();
                    }

                    softwareCounter += 1;
                    self.log('Failed to add', software.name, 'try again after some time');
                    return callback();
                });
            }
        }, function(error, result) {
            self.log('\nYour machine looks perfect now');
            return callback();
        });
    });

Vorpal
    .delimiter('mechanic $')
    .show();
