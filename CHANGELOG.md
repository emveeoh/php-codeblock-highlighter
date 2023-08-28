# CHANGELOG

## [1.2.3] - 2023-08-27

### Fixed

- Background color was incorrectly extending past the closing "?>" PHP tag.

## [1.2.2] - 2023-08-27

### Fixed

- Status bar on/off toggle now works as expected.

## [1.2.1] - 2023-08-27

### Added

- VS Code extension icon.

## [1.2.0] - 2023-08-27

### Added

- A check for PHP opening tags written in both lowercase and uppercase.

### Updated

- Modified the bottom status bar toggle button design.

## [1.1.0] - 2023-08-26

### Added

- VS Code bottom status bar button to toggle the background highlighting on/off.

## [1.0.4] - 2023-08-26

### Added

- Build `php-codeblock-highlighter-1.0.3.vsix` binary. Found in `/vsix-installers` directory.

## [1.0.3] - 2023-08-26

### Added

- MIT license

## [1.0.2] - 2023-08-26

### Updated

- Updated the package name.
- Updated the package description.

## [1.0.1] - 2023-08-26

### Updated

- Updated the default color value.

## [1.0.0] - 2023-08-26

### Added

- Initial major release.
- Adds a background color to PHP code blocks in the editor.
- Customizable background color through VS Code settings (`phpCodeblockHighlighter.backgroundColor`).
- Automatically updates background color on editor change and document change.
- Activation events set to PHP language for optimized performance.

### Changed

- Improved regular expression handling for PHP start and end tags.

## [Unreleased]

- I'm not sure what the future will hold for this extension, but I'm optimistic... ;)
