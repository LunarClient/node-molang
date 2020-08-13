export enum EPrecedence {
	STATEMENT = 1,
	PROPERTY_ACCESS,
	FUNCTION,
	ASSIGNMENT,
	CONDITIONAL,

	NULLISH_COALESCING,

	AND,
	OR,

	COMPARE,

	SUM,
	PRODUCT,
	EXPONENT,

	PREFIX,
	POSTFIX,
	CALL,
}
