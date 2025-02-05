# Pandora Terminal Interface

A modern, cross-platform terminal interface built with React, TypeScript, and Vite.

## Features

- Cross-platform support (Windows, macOS, Linux)
- Modern UI with macOS-inspired design
- Command history and favorites
- AI-powered command suggestions
- Collaborative features
- Theme customization

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Building for Desktop

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Electron Builder (`npm install -g electron-builder`)

### Build Instructions

#### For Windows

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Create Windows executable
electron-builder --windows
```

The Windows executable (.exe) will be available in the `dist` folder.

#### For macOS

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Create macOS app
electron-builder --mac
```

The macOS app (.app) will be available in the `dist` folder.

### Additional Build Options

- For portable executables: `electron-builder --windows portable`
- For DMG installers (macOS): `electron-builder --mac dmg`
- For both platforms: `electron-builder -mw`

## Configuration

You can customize the build settings in `electron-builder.yml`:

```yaml
appId: com.pandora.terminal
productName: Pandora Terminal
win:
  target: nsis
mac:
  target: dmg
```

## License

MIT

