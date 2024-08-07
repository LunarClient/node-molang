import { expect, test } from 'vitest'
import { Molang } from '../lib/Molang'

const molang = new Molang()

test('Basic if statement', () => {
	const statement = `
    if (true) {
        return 1;
    }`

	expect(molang.execute(statement)).toBe(1)
})

test('Elif chain with variables', () => {
	const statement = `
    v.test = 10;

    if (v.test == 0) {
        return 1;
    } elif (v.test == 5) {
        return 2;
    } elif (v.test == 10) {
        return 3;
    }`

	expect(molang.execute(statement)).toBe(3)
})

test('Else statement', () => {
	const statement = `
    v.test = 50;

    if (v.test == 0) {
        return 1;
    } elif (v.test == 5) {
        return 2;
    } elif (v.test == 10) {
        return 3;
    } else {
        return 4;
    }`

	expect(molang.execute(statement)).toBe(4)
})

test('Nested conditionals', () => {
	const statement = `
    v.test = 10;
    v.test2 = 5;

    if (v.test == 0) {
        return 1;
    } elif (v.test == 5) {
        return 2;
    } elif (v.test == 10) {
        if (v.test2 == 2) {
            return 3;
        } else {
            return 4;
        }
    }`

	expect(molang.execute(statement)).toBe(4)
})

test('No return', () => {
	const statement = `
    v.test = 10;

    if (v.test == 10) {
        v.test = 1;
    }

    if (v.test == 1) {
        v.test = 50;
    }

    return 50;
    `

	expect(molang.execute(statement)).toBe(50)
})
