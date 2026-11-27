# GitHub Asset Upload

When you insert images, audio, video, or attachments into a note, they are automatically uploaded to your GitHub repository, leaving a direct link in the note. Images continue to display properly when you publish to a blog or share with others.

## Getting Started

1. Install **GitHub Asset Upload** from the Plugin Center, then enable it under **Installed** on the Plugins page.
2. Open **Settings** on the plugin details page.
3. Fill in **Access token** (with repository read and write permissions), then select **Repository** and **Branch** (create the repository and branch beforehand). A dedicated **public** repository is recommended for images so others can open the links. Leave **Repository owner** empty to use the token's account; **Directory** and **Commit email** are optional.
4. Save your settings, select this service under **Settings → Resource storage**, and test by inserting an image into a note: if it appears in the note and opens in a browser, you are all set.

To use your own domain or CDN, enter it in **Public URL prefix** so generated links use that prefix. Image compression follows Tau's **Compress uploads** toggle.

## FAQ

**Upload failed?** Check your account, repository, branch, and network connection. Failed uploads never silently fall back to another location.

**Upload succeeded, but the link will not open?** The repository is usually set to private, or the custom domain is misconfigured. The plugin does not change repository visibility; update it on GitHub.

**Nothing happens when inserting images in a separate window?** Keep the main Tau window open and confirm the plugin is enabled.

**Can this sync my notes?** No. This plugin only uploads attachments; use a sync plugin to sync your library.

## Notes

- Works on desktop and mobile. If you also use the sync plugin, sync and upload credentials are configured separately and do not affect each other.
- Treat your access token like your GitHub password. Never share it with others or include it in screenshots or issue reports.
