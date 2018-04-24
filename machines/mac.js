'use strict';

module.exports = {
    preRequisites: [
        {
            name: 'xcode select',
            installCommand: 'xcode-select --install',
            testCommand: 'xcode-select -p'
        }
    ],
    setUpRequirements: [
        {
            name: 'Homebrew and Cask',
            installCommand: 'ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"',
            testCommand: 'brew -v'
        }
    ],
    softwaresAvailable: [
        {
            name: 'Vlc Media Player',
            installCommand: 'brew cask install vlc',
            testCommand: 'if [ -e /Applications/VLC.app ]; then echo "Good"; else echo "Bad"; fi'
        },
        {
            name: 'Slack App',
            installCommand: 'brew cask install slack',
            testCommand: 'if [ -e /Applications/Slack.app ]; then echo "Good"; else echo "Bad"; fi'
        },
        {
            name: 'Redis Cache',
            realName: 'redis',
            installCommand: 'brew install redis',
            testCommand: 'brew ls --versions redis'
        },
        {
            name: 'MySql DB',
            realName: 'mysql',
            installCommand: 'brew install mysql',
            testCommand: 'brew ls --versions mysql'
        },
        {
            name: 'Zookeeper',
            realName: 'zookeeper',
            installCommand: 'brew install zookeeper',
            testCommand: 'brew ls --versions zookeeper'
        },
        {
            name: 'Kafka',
            realName: 'kafka',
            installCommand: 'brew install kafka',
            testCommand: 'brew ls --versions kafka'
        },
        {
            name: 'Nginx',
            realName: 'nginx',
            installCommand: 'brew install nginx',
            testCommand: 'brew ls --versions nginx'
        },
        {
            name: 'Elastic Search',
            realName: 'elasticsearch',
            installCommand: 'brew install elasticsearch',
            testCommand: 'brew ls --versions elasticsearch'
        },
        {
            name: 'MongoDB',
            realName: 'mongodb',
            installCommand: 'brew install mongodb',
            testCommand: 'brew ls --versions mongodb'
        },
        {
            name: 'PostgreSql',
            realName: 'postgresql',
            installCommand: 'brew install postgresql',
            testCommand: 'brew ls --versions postgresql'
        },
        {
            name: 'Python v3',
            realName: 'python',
            installCommand: 'brew install python3',
            testCommand: 'brew ls --versions python3'
        },
        {
            name: 'Node Js',
            realName: 'node',
            installCommand: 'brew install node',
            testCommand: 'brew ls --versions node'
        },
        {
            name: 'Yarn',
            realName: 'yarn',
            installCommand: 'brew install yarn',
            testCommand: 'brew ls --versions yarn'
        },
        {
            name: 'Watchman',
            realName: 'watchman',
            installCommand: 'brew install watchman',
            testCommand: 'brew ls --versions watchman'
        },
        {
            name: 'Flow',
            realName: 'flow',
            installCommand: 'brew install flow',
            testCommand: 'brew ls --versions flow'
        },
        {
            name: 'Node Version Manager (NVM)',
            realName: 'nvm',
            installCommand: 'brew install nvm',
            testCommand: 'brew ls --versions nvm'
        },
        {
            name: 'Git',
            realName: 'git',
            installCommand: 'brew install git',
            testCommand: 'brew ls --versions git'
        },
        {
            name: 'Java',
            realName: 'java',
            installCommand: 'brew cask install java',
            testCommand: 'java --version'
        },
        {
            name: 'Maven',
            realName: 'maven',
            installCommand: 'brew install maven',
            testCommand: 'brew ls --versions maven'
        }
    ]
};
