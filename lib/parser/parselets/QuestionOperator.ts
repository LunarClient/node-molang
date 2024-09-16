import { Parser } from '../parse'
import { Token } from '../../tokenizer/token'
import { IExpression } from '../expression'
import { GenericOperatorExpression } from '../expressions/genericOperator'
import { IInfixParselet } from './infix'
import { TernaryParselet } from './ternary'
import { EPrecedence } from '../precedence'

const ternaryParselet = new TernaryParselet(EPrecedence.CONDITIONAL)
export class QuestionOperator implements IInfixParselet {
	constructor(public precedence = 0) {}

	parse(parser: Parser, leftExpression: IExpression, token: Token) {
		if (parser.match('QUESTION')) {
			const rightExpression = parser.parseExpression(this.precedence)
			const result = new GenericOperatorExpression(
				leftExpression,
				rightExpression,
				'??',
				(leftExpression: IExpression, rightExpression: IExpression) => {
					const leftVal = leftExpression.eval()
					const rightVal = rightExpression.eval()

					return leftVal ?? rightVal
				}
			)

			// Check if left side is assignable
			if (leftExpression.setPointer && !leftExpression.eval()) {
				// Set the result back to the left expression
				return new GenericOperatorExpression(
					leftExpression,
					rightExpression,
					'=',
					(
						leftExpression: IExpression,
						rightExpression: IExpression
					) => {
						if (leftExpression.setPointer) {
							leftExpression.setPointer(
								leftExpression.eval() ?? rightExpression.eval()
							)
							return leftExpression.eval()
						} else {
							throw Error(
								`Cannot assign to ${leftExpression.type}`
							)
						}
					}
				)
			}

			return result
		} else {
			return ternaryParselet.parse(parser, leftExpression, token)
		}
	}
}
