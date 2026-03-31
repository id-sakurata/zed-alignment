use zed_extension_api::{self as zed, Result};

struct AlignmentExtension {}

impl zed::Extension for AlignmentExtension {
    fn new() -> Self {
        Self {}
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &zed::LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        let node = worktree.which("node")
            .ok_or_else(|| "Node.js must be installed in your PATH".to_string())?;

        // Note: For published extensions we'd download the npm package using zed::npm_install_package
        // For development, we assume running locally from the user's workspace path:
        let js_path = "/home/user/Documents/aligments/server/index.js".to_string();

        Ok(zed::Command {
            command: node,
            args: vec![js_path, "--stdio".to_string()],
            env: Default::default(),
        })
    }
}

zed::register_extension!(AlignmentExtension);
