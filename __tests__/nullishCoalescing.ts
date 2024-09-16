import { expect, test } from 'vitest'
import { Molang } from '../lib/Molang'

test('Assigning var to result', () => {
	const molang = new Molang()

	const statement = `
    v.test = 10;

    v.result = v.test2 ?? 5;

    return v.result;`

	expect(molang.execute(statement)).toBe(5)
})

test('Assigning left hand to result', () => {
	const molang = new Molang()

	const statement = `
    v.test = 10;

    v.result ?? v.test;

    return v.result;`

	expect(molang.execute(statement)).toBe(10)
})
