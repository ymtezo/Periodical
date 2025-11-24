import { App, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, Notice } from 'obsidian';

interface PeriodicalSettings {
	checkedDates: { [date: string]: boolean };
}

const DEFAULT_SETTINGS: PeriodicalSettings = {
	checkedDates: {}
}

const VIEW_TYPE_CALENDAR = "periodical-calendar-view";

export default class PeriodicalPlugin extends Plugin {
	settings: PeriodicalSettings;

	async onload() {
		await this.loadSettings();

		// Register the calendar view
		this.registerView(
			VIEW_TYPE_CALENDAR,
			(leaf) => new CalendarView(leaf, this)
		);

		// Add ribbon icon to open calendar
		this.addRibbonIcon('calendar-days', 'Periodical Calendar', () => {
			this.activateView();
		});

		// Add command to open calendar
		this.addCommand({
			id: 'open-periodical-calendar',
			name: 'Open Periodical Calendar',
			callback: () => {
				this.activateView();
			}
		});

		// Add settings tab
		this.addSettingTab(new PeriodicalSettingTab(this.app, this));
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);

		if (leaves.length > 0) {
			// View already exists, reveal it
			leaf = leaves[0];
		} else {
			// Create new leaf in right sidebar
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: VIEW_TYPE_CALENDAR, active: true });
		}

		// Reveal the leaf
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	onunload() {
		// Clean up views
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_CALENDAR);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	isDateChecked(date: string): boolean {
		return this.settings.checkedDates[date] || false;
	}

	async toggleDate(date: string) {
		this.settings.checkedDates[date] = !this.isDateChecked(date);
		await this.saveSettings();
	}
}

class CalendarView extends ItemView {
	plugin: PeriodicalPlugin;
	currentMonth: Date;

	constructor(leaf: WorkspaceLeaf, plugin: PeriodicalPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.currentMonth = new Date();
	}

	getViewType(): string {
		return VIEW_TYPE_CALENDAR;
	}

	getDisplayText(): string {
		return "Periodical Calendar";
	}

	getIcon(): string {
		return "calendar-days";
	}

	async onOpen() {
		this.renderCalendar();
	}

	async onClose() {
		// Cleanup if needed
	}

	renderCalendar() {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass('periodical-calendar-container');

		// Header with navigation
		const header = container.createDiv({ cls: 'periodical-calendar-header' });
		
		const prevButton = header.createEl('button', { text: '←', cls: 'periodical-nav-button' });
		prevButton.onclick = () => {
			this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
			this.renderCalendar();
		};

		const monthYearDisplay = header.createDiv({ 
			cls: 'periodical-month-year',
			text: this.getMonthYearText()
		});

		const nextButton = header.createEl('button', { text: '→', cls: 'periodical-nav-button' });
		nextButton.onclick = () => {
			this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
			this.renderCalendar();
		};

		const todayButton = header.createEl('button', { text: 'Today', cls: 'periodical-today-button' });
		todayButton.onclick = () => {
			this.currentMonth = new Date();
			this.renderCalendar();
		};

		// Calendar grid
		const calendar = container.createDiv({ cls: 'periodical-calendar-grid' });

		// Day headers
		const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		dayNames.forEach(day => {
			calendar.createDiv({ cls: 'periodical-day-header', text: day });
		});

		// Get first day of month and number of days
		const year = this.currentMonth.getFullYear();
		const month = this.currentMonth.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		// Add empty cells for days before month starts
		for (let i = 0; i < firstDay; i++) {
			calendar.createDiv({ cls: 'periodical-day-cell empty' });
		}

		// Add cells for each day of the month
		const today = new Date();
		const todayStr = this.formatDate(today);

		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month, day);
			const dateStr = this.formatDate(date);
			const isToday = dateStr === todayStr;

			const dayCell = calendar.createDiv({ 
				cls: `periodical-day-cell${isToday ? ' today' : ''}`
			});

			const dayNumber = dayCell.createDiv({ cls: 'periodical-day-number', text: day.toString() });

			const checkbox = dayCell.createEl('input', { 
				type: 'checkbox',
				cls: 'periodical-checkbox'
			});
			checkbox.checked = this.plugin.isDateChecked(dateStr);
			
			checkbox.onchange = async () => {
				await this.plugin.toggleDate(dateStr);
				new Notice(`${dateStr}: ${this.plugin.isDateChecked(dateStr) ? 'Checked' : 'Unchecked'}`);
			};

			// Click on cell to toggle checkbox by triggering a click on the checkbox
			dayCell.onclick = (e) => {
				// Don't trigger if clicking the checkbox itself
				if ((e.target as HTMLElement) === checkbox) {
					return;
				}
				checkbox.click();
			};
		}
	}

	formatDate(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	getMonthYearText(): string {
		const months = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];
		return `${months[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
	}
}

class PeriodicalSettingTab extends PluginSettingTab {
	plugin: PeriodicalPlugin;

	constructor(app: App, plugin: PeriodicalPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Periodical Settings' });

		new Setting(containerEl)
			.setName('Clear all checked dates')
			.setDesc('Remove all checked dates from the calendar')
			.addButton(button => button
				.setButtonText('Clear')
				.setWarning()
				.onClick(async () => {
					this.plugin.settings.checkedDates = {};
					await this.plugin.saveSettings();
					new Notice('All checked dates cleared');
					
					// Refresh the calendar view if it's open
					const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
					leaves.forEach(leaf => {
						if (leaf.view instanceof CalendarView) {
							leaf.view.renderCalendar();
						}
					});
				}));

		// Display statistics
		const checkedCount = Object.keys(this.plugin.settings.checkedDates).filter(
			date => this.plugin.settings.checkedDates[date]
		).length;

		containerEl.createEl('p', { 
			text: `Total checked dates: ${checkedCount}`,
			cls: 'setting-item-description'
		});
	}
}
