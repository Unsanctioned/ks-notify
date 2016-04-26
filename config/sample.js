config = module.exports = {

	// Kickstarter project name (lowercase with - instead of space, generally)
	projectName: 'my-project-name'',
	// Kickstarter project ID
	projectId: 000000000,
	slack: {
		// The channel that should receive notifications / topic updates
		channel: 'crowdfunding',
		// Slack web API token
		token: 'xoxp-your-token-here',
		// Name of the bot that posts messages
		username: 'KSBOT',
		// Message text to post when a trigger level is hit - blank for no message
		message: 'Kickstarter update: ${BACKERS} backers and ${PLEDGED} pledged!',
		// emoji to use as the bot's icon
		iconEmoji: ':tophat:',
		// Topic text - if blank, topic is not set
		topic: 'Campaign: ${BACKERS} backers, ${PLEDGED} pledged!',
		// Is the topic updated on every run (false = updated when a target is hit)
		alwaysUpdateTopic: false
	},
	// pledge targets for notifications
	pledgeTargets: [
		10000.00,
		25000.00,
		50000.00,
		100000.00,
		150000.00,
		200000.00,
		500000.00,
		1000000,00
	],
	// backer targets for notifications
	backerTargets: [
		100,
		1000,
		10000,
		100000
	]
}
