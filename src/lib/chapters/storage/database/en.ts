import type { DatabaseText } from '../types';

export const en: DatabaseText = {
	title: 'SQL or NoSQL?',
	intro: [
		'Data you use often usually lives in a database. There are two big families, and they store data in different ways.',
		'<b>SQL</b> is relational: data sits in neat tables of rows and columns, with a strict schema and relationships between tables. Strong for transactions that must always stay consistent, like a bank transfer.',
		'<b>NoSQL</b> stores documents or key value pairs: the shape is flexible and it scales out across many machines. Strong for huge, simple, and varied data, like a social feed.',
		'See the tidy table on the left and the flexible document on the right. Now as each use case appears, pick the one that fits.'
	],
	reactions: {
		sql: 'Right. A transaction that must stay consistent needs the strict schema and guarantees of SQL.',
		nosql: 'Right. Data that is huge, varied, and must scale out wide is NoSQL territory.',
		wrong: 'Hmm, not quite. Ask yourself: does this need strict consistency, or does it need to scale out with a free shape?'
	},
	sqlTitle: 'SQL (relational)',
	sqlSub: 'Tables, strict schema, relationships, strong for transactions',
	nosqlTitle: 'NoSQL (document)',
	nosqlSub: 'Free shape, scales out across machines, strong at scale',
	pickSql: 'SQL',
	pickNosql: 'NoSQL',
	prompt: 'Pick the one that fits this use case.',
	done: 'Done, you have got the difference.',
	tableName: 'accounts',
	columns: ['id', 'name', 'balance'],
	rows: [
		['1', 'Adi', '120000'],
		['2', 'Bima', '85000']
	],
	docLabel: 'post.json',
	cases: {
		transfer: 'A bank transfer that must always stay consistent: money cannot vanish or double as it moves between accounts.',
		feed: 'A social feed of millions of very different posts, that must stay fast even when a flood of users hits it.'
	},
	why: {
		sql: 'A transfer needs a strict schema and transaction guarantees so the balance is always correct. That is the strength of SQL.',
		nosql: 'A huge, varied feed is happiest as flexible documents that scale out wide. That is the strength of NoSQL.',
		wrong: 'Not the best fit for this case. Try picking again.'
	}
};
