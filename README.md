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

## Usage

1. Open a file in the Zed Editor.
2. **Select/highlight** multiple lines of code that you wish to cleanly align.
3. Open the **Code Actions** menu (`Cmd + .` on Mac or `Ctrl + .` on Windows/Linux).
4. Click on **"Align Chars"**!

## Development

This extension is built with two main components:
- `server/` - A Node.js LSP server written in JavaScript.
- `src/lib.rs` - The Rust WASM extension that connects the Zed editor to the LSP.
