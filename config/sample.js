config = module.exports = {

	// Kickstarter project name (lowercase with - instead of space, generally)
	// This includes the project owner, so if the base project URL is www.kickstarter.com/projects/owner/project
	// this would be 'owner/project'
	projectName: 'myusername/my-project-name',
	// Kickstarter project ID
	projectId: 000000000,
	slack: {
		// The webhoook URL for the slack custom integration
		webhook_url: 'https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXXX/xxxxxxxxxxxxxxxxxxxx',
		// The channel that should receive notifications / topic updates
		channel: 'crowdfunding',
		// Name of the bot that posts messages
		username: 'KSBOT',
		// Message text to post when a trigger level is hit - blank for no message
		message: 'Kickstarter update: ${BACKERS} backers and ${PLEDGED} pledged!',
		// emoji to use as the bot's icon
		iconEmoji: ':tophat:',
	},
	// pledge targets for notifications
	pledgeTargets: [
		{amount: 10000.00, message: 'DEFAULT'},
		{amount: 25000.00, message: 'DEFAULT'},
		{amount: 50000.00},
		{amount: 100000.00, message: 'Kickstarter update: ${PLEDGED} pledged!'},
		{amount: 150000.00, message: 'DEFAULT'},
		{amount: 200000.00, message: 'DEFAULT'},
		{amount: 500000.00, message: 'DEFAULT'},
		{amount: 1000000.00, message: 'FUNDED! ${PLEDGED} pledged, ${BACKERS} backers!'}
	],
	// backer targets for notifications
	backerTargets: [
		{count: 100, message: 'Backer update: ${BACKERS}'},
		{count: 1000, message: 'Backer update: ${BACKERS}'},
		{count: 10000, message: 'Backer update: ${BACKERS}'},
		{count: 100000 message: 'Backer update: ${BACKERS}'}
	]
}
