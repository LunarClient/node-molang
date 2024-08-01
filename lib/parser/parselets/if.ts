import { Token } from '../../tokenizer/token'
import { IfExpression } from '../expressions'
import { Parser } from '../parse'
import { IPrefixParselet } from './prefix'

export class IfParselet implements IPrefixParselet {
	constructor(public precedence = 0) {}

	parse(parser: Parser, token: Token) {
		parser.consume('LEFT_PARENT')
		const condition = parser.parseExpression(this.precedence)
		parser.consume('RIGHT_PARENT')

		parser.consume('CURLY_LEFT')
		const consequent = parser.parseExpression(this.precedence)
		parser.consume('CURLY_RIGHT')

		const elifClauses: IfExpression[] = []

		while (parser.match('ELIF')) {
			parser.consume('LEFT_PARENT')
			const elifCondition = parser.parseExpression(this.precedence)
			parser.consume('RIGHT_PARENT')

			parser.consume('CURLY_LEFT')
			const elifConsequent = parser.parseExpression(this.precedence)
			parser.consume('CURLY_RIGHT')

			elifClauses.push(new IfExpression(elifCondition, elifConsequent))
		}

		let alternate
		if (parser.match('ELSE')) {
			parser.consume('CURLY_LEFT')
			alternate = parser.parseExpression(this.precedence)
			parser.consume('CURLY_RIGHT')
		}

		return new IfExpression(condition, consequent, elifClauses, alternate)
	}
}
