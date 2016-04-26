config = module.exports = {

	// Kickstarter project name (lowercase with - instead of space, generally)
	projectName: 'my-project-name'',
	// Kickstarter project ID
	projectId: 000000000,
	slack: {
		channel: '#crowdfunding',
		token: 'xoxp-your-token-here',
		usernmae: 'KSBOT',
		message: 'Kickstarter update: ${BACKERS} backers and $${PLEDGED} pledged!',
		iconEmoji: ':tophat:'
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
