export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat',
				'fix',
				'docs',
				'style',
				'refactor',
				'perf',
				'test',
				'chore',
				'build',
				'ci',
				'revert',
				'db',
				'lint',
			],
		],
		'scope-empty': [2, 'never'],
		'subject-empty': [2, 'never'],
		'subject-case': [
			2,
			'never',
			['start-case', 'pascal-case'],
		],
	},
};
