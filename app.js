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
            message: 'What machine you wants to setup ' + machinesKnown.toString() + '? '
        }, function(result) {
            let machine = result.machine || '';
            machine = machine.toLowerCase().trim();

            self.log(Chalk.underline.green(machine));
            self.log('Operating according to guideleines of', machine);

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
            self.log('Checking necessary parts of machine');
            Async.eachSeries(preRequisites, function(preRequisite, callback) {
                Exec(preRequisite.testCommand, function(error, stdout, stderr) {
                    if (error) {
                        self.log(
                            'Necessary part',
                            Chalk.underline.green(preRequisite.name),
                            'does not exist,',
                            'Please add this first using command',
                            Chalk.underline.bold.red(preRequisite.installCommand)
                        );
                        return callback(error);
                    }
                    self.log('Necessary part', Chalk.underline.green(preRequisite.name), 'exists, checking others ...');
                    return callback();
                });
            }, function(error, result) {
                if (error) {
                    // Stop execution here
                    return callback();
                }

                self.log('All necessary parts exists');

                self.log('Fetching required tools', Emoji.find('wrench').emoji, ' for ', machine);
                setUpRequirements = systemCommands.setUpRequirements;

                // Install setup Requirements
                self.log('Checking compatiblity of other machine parts with new parts');
                Async.eachSeries(setUpRequirements, function(setUpRequirement, callback) {
                    Exec(setUpRequirement.testCommand, function(error, stdout, stderr) {
                        if (!error) {
                            self.log(
                                'setup requisite',
                                Chalk.underline.green(setUpRequirement.name),
                                'exists, checking others...'
                            );
                            return callback();
                        }

                        self.log(
                            'Machine part',
                            Chalk.underline.green(setUpRequirement.name),
                            'does not exist, adding ...'
                        );

                        Exec(setUpRequirement.installCommand, function(error, stdout, stderr) {
                            if (error) {
                                self.log(
                                    'New part',
                                    Chalk.underline.green(setUpRequirement.name),
                                    'is not compatible with this machine,',
                                    'Tried using command',
                                    Chalk.underline.bold.red(setUpRequirement.installCommand),
                                    'Please report it'
                                );
                                return callback(error);
                            }
                            self.log(
                                'New part',
                                Chalk.underline.green(setUpRequirement.name),
                                'added to machine, checking others ...'
                            );
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
                    self.log('All necessary compatiblity checked, now you can proceed to install');
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

        Async.eachSeries(softwaresAvailable, function(software, callback) {
            self.log(Chalk.underline.green(software.name));

            self.log('Adding', software.name, 'to your machine');
            if (software.testCommand) {
                self.log('Checking if', software.name, 'already exists in your machine');
                Exec(software.testCommand, function(error, stdout, stderr) {
                    self.log(error);
                    self.log(stdout);
                    self.log(stderr);
                    if (!error) {
                        self.log(software.name, 'is already present in this machine');
                        return callback();
                    }

                    self.log(software.name, 'does not exist in this machine, installing...');
                    Exec(software.installCommand, function(error, stdout, stderr) {
                        if (!error) {
                            self.log(software.name, 'added successfully in this machine');
                            return callback();
                        }

                        self.log('Failed to add', software.name, 'try again after some time');
                        return callback();
                    });
                });
            } else {
                Exec(software.installCommand, function(error, stdout, stderr) {
                    if (!error) {
                        self.log(software.name, 'added successfully in this machine');
                        return callback();
                    }

                    self.log('Failed to add', software.name, 'try again after some time');
                    return callback();
                });
            }
        }, function(error, result) {
            self.log('Your machine looks perfect now');
            return callback();
        });
    });

Vorpal
    .delimiter('mechanic $')
    .show();
