# Periodical

一定期間に一度振り返りや定期的にやると決めた行動をやった時を記録、またやったページも記録

An Obsidian plugin for tracking periodic tasks and reflections with a calendar interface.

## Features

- 📅 **Calendar View**: Visual calendar interface in Obsidian
- ✅ **Daily Checkboxes**: Mark days when you completed your periodic tasks
- 💾 **Persistent Tracking**: All checked dates are saved automatically
- 🎯 **Easy Navigation**: Navigate between months with intuitive controls
- 📱 **Mobile Friendly**: Works on both desktop and mobile devices

## Installation

### Manual Installation

1. Download the latest release files:
   - `main.js`
   - `manifest.json`
   - `styles.css`

2. Create a folder named `periodical` in your Obsidian vault's `.obsidian/plugins/` directory

3. Copy the downloaded files into the `periodical` folder

4. Reload Obsidian

5. Enable the plugin in Settings → Community plugins

## Usage

### Opening the Calendar

You can open the Periodical calendar in three ways:

1. Click the calendar icon in the left ribbon
2. Use the command palette (Ctrl/Cmd + P) and search for "Open Periodical Calendar"
3. The calendar will open in the right sidebar

### Using the Calendar

- **Check a Day**: Click on any day cell or its checkbox to mark it as complete
- **Navigate Months**: Use the ← and → buttons to move between months
- **Return to Today**: Click the "Today" button to jump to the current month
- **View Status**: Checked days will show a checked checkbox

### Settings

Access plugin settings through Settings → Periodical:

- **Clear All Checked Dates**: Remove all tracked data (use with caution)
- **Statistics**: View the total number of checked dates

## Use Cases

This plugin is perfect for:

- 📝 Tracking daily journal entries
- 🏃 Recording workout days
- 📚 Monitoring reading habits
- 🧘 Following meditation practice
- ✍️ Any periodic activity you want to track

## Development

To build the plugin from source:

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Development mode (with auto-rebuild)
npm run dev
```

## License

MIT

## Support

If you encounter any issues or have suggestions, please file an issue on the GitHub repository.
