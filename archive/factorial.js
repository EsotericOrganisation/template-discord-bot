/**
 * Finds the factorial of a number.
 * @param {Number} input The number to find the factorial of.
 * @returns {Number} The factorial of the number.
 * @example console.log(factorial(5))
 * // Expected output: 120
 */
// eslint-disable-next-line no-unused-vars
const factorial = (input) => {
	let sum = input >= 0 ? 1 : -1;
	for (let i = input; i > 0; i--) {
		sum *= i;
	}
	return sum;
};
