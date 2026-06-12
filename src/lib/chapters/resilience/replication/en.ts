import type { ReplicationText } from '../types';

export const en: ReplicationText = {
	title: 'Replication and backups',
	intro: [
		'Precious data needs protection. If there is only one copy and its home is destroyed, that data is gone for good.',
		'<b>Replication</b> means keeping live copies in other places. If one copy dies, a replica can take over instantly. This protects against hardware loss.',
		'<b>Backup</b> is different: it is a point in time snapshot you can restore. This protects against a deletion or corruption, which a live replica would simply copy.',
		'Picture photocopies stored in different buildings. Now try it: add a replica in another zone, take a backup, then drop a failure and watch your data survive.'
	],
	reactions: {
		lost: 'Ouch, with only one copy your data is gone the moment that zone falls. Add a replica in another zone, or take a backup before you try again.',
		replicated: 'See, the failure only hits one copy, and the replica in another zone keeps serving instantly. Your data survives through replication.',
		restored: 'Nice. A deletion gets copied by a live replica, but the backup holds an older snapshot, so your data comes back whole.'
	},
	primaryLabel: 'Primary',
	replicaLabel: 'Replica',
	serving: 'Serving',
	standbyState: 'Ready',
	lostLabel: 'Lost',
	emptyLabel: 'empty',
	addReplica: '+ Replica',
	takeBackup: 'Take a backup',
	failButton: 'Drop a failure',
	deleteButton: 'Delete by mistake',
	restoreButton: 'Restore from backup',
	backupLabel: 'Backup',
	zones: { a: 'Zone A', b: 'Zone B', c: 'Zone C' },
	prompt: 'Add a replica in another zone, take a backup, then test it with a failure or a delete.',
	done: 'Your data survived the failure.'
};
