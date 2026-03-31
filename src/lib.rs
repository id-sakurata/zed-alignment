use zed_extension_api::{self as zed, settings::LspSettings, Result};

struct AlignmentExtension {}

impl zed::Extension for AlignmentExtension {
    fn new() -> Self {
        Self {}
    }

    fn language_server_command(
        &mut self,
        language_server_id: &zed::LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        let mut node_path = None;
        let mut js_path = None;

        if let Ok(settings) = LspSettings::for_worktree(language_server_id.as_ref(), worktree) {
            if let Some(opts) = settings.initialization_options.clone() {
                if let Some(n) = opts.get("node_path").and_then(|v| v.as_str()) {
                    node_path = Some(n.to_string());
                }
                if let Some(j) = opts.get("js_path").and_then(|v| v.as_str()) {
                    js_path = Some(j.to_string());
                }
            }
        }

        let node = node_path.unwrap_or_else(|| {
            worktree.which("node").unwrap_or_default()
        });

        if node.is_empty() {
            return Err("Node.js must be installed in your PATH".to_string());
        }

        let js_path = js_path.unwrap_or_else(|| {
            "/home/user/Documents/aligments/server/index.js".to_string()
        });

        Ok(zed::Command {
            command: node,
            args: vec![js_path, "--stdio".to_string()],
            env: Default::default(),
        })
    }
}

zed::register_extension!(AlignmentExtension);
