import type { IamText } from '../types';

export const en: IamText = {
	title: 'Identity and Access',
	intro: [
		'Picture a big office. At the entrance, a guard checks your ID to confirm you really are you. That is <b>authentication</b>: proving who you are, usually with a password or a code.',
		'But the same card does not open every door. Yours might open your workspace, not the server room. Which doors you may open is <b>authorization</b>: what you are allowed to do.',
		'The golden rule is <b>least privilege</b>: give each identity only the access it actually needs. If everyone gets full admin, one leaked password can break the whole system.',
		'Try it. Set this user up with some permissions, then test a few actions. The allowed ones succeed, the rest are denied.'
	],
	reactions: {
		denied: 'Right, that action was denied because you never granted the permission. The user can only do what you picked. That is authorization at work.',
		allowed: 'It worked, because you did grant this permission. Now try an action you did not allow and watch the difference.',
		leastpriv:
			'Nice. You gave only what is needed, read files but no deleting the database. That is least privilege. If this user password leaks, the damage stays limited.'
	},
	userLabel: 'Nadia',
	userSub: 'Team member',
	badgeLabel: 'Access badge',
	adminLabel: 'Full admin',
	adminHint: 'Can do anything (risky)',
	scopedLabel: 'Scoped access',
	scopedHint: 'Pick each permission',
	permsTitle: 'Grant permissions',
	tryTitle: 'Try an action',
	allowedTag: 'Allowed',
	deniedTag: 'Denied',
	resetLabel: 'Reset',
	perms: {
		readFile: 'Read files',
		writeFile: 'Edit files',
		deleteDb: 'Delete database',
		manageUsers: 'Manage users'
	},
	actions: {
		readFile: 'Open the report file',
		writeFile: 'Save a file change',
		deleteDb: 'Delete the database',
		manageUsers: 'Add a new user'
	}
};
