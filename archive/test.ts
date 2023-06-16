import Decimal from "decimal.js";
// import {Parser} from "expr-eval";
// import {parseMath} from "../functions";

// const array = [
// 	"some value here",
// 	"some other value here",
// 	"yep very interesting test values",
// ];

// const variable = Math.random() > 0.5;

// const unfactorisedArray = variable
// 	? array.map((element) => element[0]).join()
// 	: array.join();

// const factorisedArray = (
// 	variable ? array.map((element) => element[0]) : array
// ).join();

// console.log(unfactorisedArray, factorisedArray);

// const fx = "sin(x)";

// const findRoot = (
// 	fxString,
// 	integer,
// 	range,
// 	precision,
// 	returnSearchRange,
// 	depth = 1
// ) => {
// 	if (depth === 0) return;

// 	fxString = parseMath(fxString);

// 	integer = new Decimal(integer);
// 	range = new Decimal(range);
// 	precision = new Decimal(precision);

// 	const interval = range.dividedBy(1000);

// 	let lowestValue = {x: Infinity, y: Infinity};

// 	for (
// 		let i = integer;
// 		i.lessThanOrEqualTo(integer.plus(range));
// 		i = i.plus(interval)
// 	) {
// 		const value = new Decimal(Parser.evaluate(fxString.replace(/x/g, `(${i})`)));

// 		console.log(i, value);

// 		if (value.abs().lessThan(Math.abs(lowestValue.y))) {
// 			lowestValue = {x: i, y: value, range: integer.minus(i).abs()};
// 		}
// 	}

// 	if (!new Decimal(lowestValue.y).lessThanOrEqualTo(precision)) {
// 		return findRoot(
// 			fxString,
// 			lowestValue.x,
// 			range.dividedBy(1000),
// 			precision,
// 			returnSearchRange,
// 			depth - 1
// 		);
// 	}

// 	console.log(lowestValue);

// 	return returnSearchRange
// 		? {x: lowestValue.x, range: lowestValue.range}
// 		: lowestValue.x;
// };

// console.log(findRoot(fx, -0.05, 0.1, 0.0001, true));

// console.log(Object.keys(Math));

// Object.areEqual = (a, b) => {
// 	for (const key in a) {
// 		if (a[key] !== b[key]) return false;
// 	}

// 	for (const key in b) {
// 		if (a[key] !== b[key]) return false;
// 	}

// 	return true;
// };

// Array.areEqual = (a, b) => {
// 	for (let i = 0; i < a.length; i++) {
// 		if (a[i] !== b[i]) return false;
// 	}

// 	for (let i = 0; i < b.length; i++) {
// 		if (a[i] !== b[i]) return false;
// 	}

// 	return true;
// };

// /**
//  * A function that compares two elements more precisely than a simple equality operator.
//  * @param {any} a The first element to compare.
//  * @param {any} b The second element to compare.
//  * @return {boolean} Whether the two elements are equal.
//  * @example
//  * console.log(areEqual({foo: "bar"}, {foo: "bar"}));
//  * // => true
//  */
// const areEqual = (a, b) => {
// 	if (typeof a !== typeof b) return false;

// 	if (Array.isArray(a)) {
// 		return Array.areEqual(a, b);
// 	}

// 	if (typeof a === "object") {
// 		return Object.areEqual(a, b);
// 	}

// 	return a === b;
// };

// const includes = (array, element, startIndex = 0) => {
// 	array = Array.from(array);

// 	for (let i = startIndex; i < array.length; i++) {
// 		if (areEqual(array[i], element)) return true;
// 	}

// 	return false;
// };

// console.log(includes([{name: ""}], {name: ""}));

(async () => {
	await (() => {
		console.log("Hi");
	})();
})();

console.log(new Decimal(1).atan().times(new Decimal(180).dividedBy(Math.PI)));
