import { MoLang } from '../main'

test('Parse & stringify statements', () => {
	const molang = new MoLang(
		{ 'variable.is_true': 1 },
		{
			partialResolveOnParse: true,
			useCache: false,
			useOptimizer: true,
			useAgressiveStaticOptimizer: true,
			keepGroups: true,
		}
	)

	const tests = {
		'v.is_true ? v.x : v.y': 'v.x',
		'return v.test ? v.x : v.y;': 'return v.test?v.x:v.y;',
		'loop(10, {v.x = 1 + 2 * 4;}); return v.x;':
			'loop(10,{v.x=1+2*4;});return v.x;',
		'(1 + 4) * 4': '(1+4)*4',
	}

	for (const [test, result] of Object.entries(tests))
		expect(molang.parse(test).toString()).toMatch(result)
})