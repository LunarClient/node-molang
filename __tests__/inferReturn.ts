import { expect, test } from 'vitest'
import { Molang } from '../lib/Molang'

const env = {
	math: {
		add(a: number, b: number) {
			return a + b
		},
	},
}

const molang = new Molang(env)

test('Infer return at end of statement', () => {
	const statement = `v.infer = 50; v.infer;`

	expect(molang.execute(statement)).toBe(50)
})

test('Infer return at end of statement with function', () => {
	const statement = `v.x = 10; math.add(v.x, 90);`

	expect(molang.execute(statement)).toBe(100)
})
