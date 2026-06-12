import type { LessonText } from '../types';

export interface StorageTypesText extends LessonText {
	objectTitle: string;
	objectSub: string;
	blockTitle: string;
	blockSub: string;
	fileTitle: string;
	fileSub: string;
	prompt: string;
	done: string;
	/** Use cases the learner drags into a storage type. key -> label. */
	cases: Record<string, string>;
}

export interface DatabaseText extends LessonText {
	sqlTitle: string;
	sqlSub: string;
	nosqlTitle: string;
	nosqlSub: string;
	pickSql: string;
	pickNosql: string;
	prompt: string;
	done: string;
	tableName: string;
	columns: string[];
	rows: string[][];
	docLabel: string;
	/** Use cases shown one at a time. key -> question. */
	cases: Record<string, string>;
	/** Why a given answer fits the current case. */
	why: Record<string, string>;
}

export interface ReplicationText extends LessonText {
	primaryLabel: string;
	replicaLabel: string;
	serving: string;
	standbyState: string;
	lostLabel: string;
	emptyLabel: string;
	addReplica: string;
	takeBackup: string;
	failButton: string;
	deleteButton: string;
	restoreButton: string;
	backupLabel: string;
	zones: Record<string, string>;
	prompt: string;
	done: string;
}
