import type { DatabaseText } from '../types';

export const en: DatabaseText = {
	title: 'SQL or NoSQL?',
	intro: [
		'Data you use often usually lives in a database. There are two big families, and they store data in very different ways.',
		'<b>SQL</b> arranges data into tables of rows and columns. The rules are strict, every row must follow the same columns, and tables can link to each other. That strictness is exactly what lets it guarantee transactions stay consistent.',
		'<b>NoSQL</b> stores free-form documents. One document may carry different fields than its neighbor, and the collection stretches easily across many machines when the data explodes.',
		'Add to both of them. Feel the difference between the strict table and the flexible documents, then see when each one is used.'
	],
	reactions: {
		sql: 'See, the new row must follow the existing columns, id, name, balance, nothing missing and nothing extra. That strictness is why money never goes missing halfway.',
		nosql:
			'See, the new document has a different shape and still gets accepted. That freedom is what makes NoSQL great for wildly varied data that needs to stretch across many machines.'
	},
	sqlTitle: 'SQL',
	sqlSub: 'strict tables that link together',
	nosqlTitle: 'NoSQL',
	nosqlSub: 'free documents that stretch easily',
	tableName: 'accounts',
	columns: ['id', 'name', 'balance'],
	rows: [
		['1', 'Adi', '120000'],
		['2', 'Bima', '85000']
	],
	extraRows: [
		['3', 'Sari', '40000'],
		['4', 'Tono', '67000']
	],
	addRow: 'Add a row',
	schemaNote: 'new rows must follow the same columns',
	docs: [
		{ name: 'post_1', fields: ['author', 'text', 'likes'] },
		{ name: 'post_2', fields: ['author', 'video', 'length'] },
		{ name: 'post_3', fields: ['author', 'poll', 'options', 'ends'] }
	],
	addDoc: 'Add a document',
	freeNote: 'every document may have its own shape',
	whenTitle: 'When to use it',
	sqlWhen: ['Money & transactions', 'Online stores', 'Data that links together'],
	nosqlWhen: ['Social media feeds', 'Catalogs of varied shapes', 'Huge data'],
	done: 'You have felt both of them'
};
