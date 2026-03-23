# Demo GIF Recording Checklist

## Capture settings

- Resolution: `1280x720`
- Aspect ratio: `16:9`
- Theme: dark terminal
- Font size: large enough to remain readable in an embedded README GIF
- Audio: off

## Before recording

- Clear terminal history
- Close notifications and unrelated windows
- Remove `sandbox/petstore-preview` if it already exists
- Make sure the terminal starts in `F:\Star`
- Keep the desktop and taskbar out of frame if possible

## During recording

- Do not rush command output
- Pause after `validate`
- Pause after `generate`
- Keep the tree output readable
- Stop on real generated code, not just directory output
- Avoid extra scrolling and cursor movement

## Export rules

- Target size: roughly `8-12 MB`
- Keep duration under `22 seconds`
- No fancy transitions
- No zoom effects unless readability demands it
- Prefer clarity over compression aggressiveness

## Must-show proof points

- validation succeeds
- generation succeeds
- repo structure appears
- generated `server.ts` is readable
- ending frame reinforces the repo is editable and shippable
