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

test('Infer return at end of statement with negative variable', () => {
	const statement = `v.y = 10;`

	expect(molang.execute(statement)).toBe(10)

	const statement2 = `-v.y;`

	expect(molang.execute(statement2)).toBe(-10)
})

test('Infer return at end of assignment statement', () => {
	const statement = `v.z = 10;`

	expect(molang.execute(statement)).toBe(10)
})
