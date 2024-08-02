import { Expression, IExpression } from '../expression'

export class IfExpression extends Expression {
	type = 'IfExpression'

	constructor(
		protected test: IExpression,
		protected consequent: IExpression,
		protected elifClauses: IfExpression[] = [],
		protected alternate?: IExpression
	) {
		super()
	}

	get isReturn(): boolean {
		return (
			this.consequent.isReturn ||
			this.elifClauses.some((clause) => clause.isReturn)
		)
	}

	get allExpressions(): IExpression[] {
		return [
			this.test,
			this.consequent,
			...this.elifClauses.flatMap((clause) => clause.allExpressions),
			this.alternate,
		].filter((expr) => expr !== undefined) as IExpression[]
	}
	setExpressionAt(index: number, expr: IExpression) {
		if (index === 0) this.test = expr
		else if (index === 1) this.consequent = expr
		else if (index > 1 && index < 2 + this.elifClauses.length) {
			const clauseIndex = index - 2
			this.elifClauses[clauseIndex].setExpressionAt(0, expr)
		} else if (index === 2 + this.elifClauses.length) this.alternate = expr
	}

	isStatic(): boolean {
		return (
			this.test.isStatic() &&
			this.consequent.isStatic() &&
			this.elifClauses.every((clause) => clause.isStatic()) &&
			(!this.alternate || this.alternate.isStatic())
		)
	}

	eval() {
		if (this.test.eval()) {
			const val = this.consequent.eval()

			return val
		}

		for (let i = 0; i < this.elifClauses.length; i++) {
			if (this.elifClauses[i].test.eval()) {
				return this.elifClauses[i].consequent.eval()
			}
		}

		if (this.alternate) {
			return this.alternate.eval()
		}

		return null
	}

	toString() {
		const elifString = this.elifClauses
			.map(
				(clause) =>
					`elif (${clause.test.toString()}) {${clause.consequent.toString()}}`
			)
			.join(' ')
		const elseString = this.alternate
			? `else {${this.alternate.toString()}}`
			: ''
		return `if (${this.test.toString()}) {${this.consequent.toString()}} ${elifString} ${elseString}`
	}
}
