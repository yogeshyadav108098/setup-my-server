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
            name: 'homebrew and homebrew Cask',
            installCommand: 'ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"',
            testCommand: 'brew -v'
        }
    ],
    softwaresAvailable: [
        {
            name: 'vlc',
            installCommand: 'brew cask install vlc',
            testCommand: 'Dir.exists?("/Applications/VLC.app")'
        },
        {
            name: 'atom',
            installCommand: 'brew cask install atom',
            testCommand: 'Dir.exists?("/Applications/atom.app")'
        },
        {
            name: 'rescuetime',
            installCommand: 'brew cask install rescuetime',
            testCommand: 'Dir.exists?("/Applications/RescueTime.app")'
        }
    ]
};
