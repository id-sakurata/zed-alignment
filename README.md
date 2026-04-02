# Zed Alignment Extension

A text alignment extension for the [Zed Editor](https://zed.dev/), heavily inspired by the legendary [Sublime Text Alignment](https://github.com/wbond/sublime_alignment) plugin and the [VSCode Alignment](https://github.com/annsk/vscode-alignment) extension.

## Features

This extension provides a background LSP (Language Server Protocol) that adds an **"Align Chars"** Code Action to your editor. It analyzes your selected text block and vertically aligns assignments or object/dictionary properties based on common symbol separators such as `=`, `:`, and `=>`.

It intelligently calculates the furthest position of the separator character and inserts the necessary space padding across all selected lines.

## Supported Languages

The alignment server is configured to automatically activate on these languages/filetypes:
- Rust
- TypeScript / JavaScript
- Python
- Go
- C / C++ / C#
- HTML / CSS
- JSON / YAML / TOML / XML
- Markdown
- Plain Text
- PHP, Ruby, Swift, Dart, Zig

## Configuration

You can customize the extension behavior in your Zed `settings.json` file. The extension uses the `alignment-server` key under `lsp`.

### Custom Paths

By default, the extension tries to find `node` in your system's PATH and uses the bundled language server script. You can override these paths:

```json
{
  "lsp": {
    "alignment-server": {
      "initialization_options": {
        "node_path": "/usr/local/bin/node",
        "js_path": "/path/to/custom-server/index.js"
      }
    }
  }
}
```

- `node_path`: Path to the Node.js executable.
- `js_path`: Path to the LSP server JavaScript entry point.

### Custom Separators

The extension automatically aligns based on `=`, `:`, and `=>`. To add your own custom separators (e.g., `->`, `::`), use the `additional_separators` option:

```json
{
  "lsp": {
    "alignment-server": {
      "initialization_options": {
        "additional_separators": ["->", "::", "+="]
      }
    }
  }
}
```

- `additional_separators`: An array of strings that the extension should recognize as separators for alignment.

## Usage

1. Open a file in the Zed Editor.
2. **Select/highlight** multiple lines of code that you wish to cleanly align.
3. Open the **Code Actions** menu (`Cmd + .` on Mac or `Ctrl + .` on Windows/Linux).
4. Click on **"Align Chars"**!

## Development

This extension is built with two main components:
- `server/` - A Node.js LSP server written in JavaScript.
- `src/lib.rs` - The Rust WASM extension that connects the Zed editor to the LSP.

### Building

#### 1. LSP Server

The LSP server is a Node.js project. It needs dependencies installed before it can be run:

```bash
cd server
npm install
```

#### 2. Rust Extension (WASM)

To build the extension for the Zed editor, you need to compile the Rust component to WebAssembly with WASI support. Run the following command:

```bash
cargo build --release --target wasm32-wasip1
```

After building, the resulting `.wasm` file will be at `target/wasm32-wasip1/release/alignment-extension.wasm`. To use it as an extension, copy it to the root of the project:

```bash
cp target/wasm32-wasip1/release/alignment-extension.wasm extension.wasm
```
