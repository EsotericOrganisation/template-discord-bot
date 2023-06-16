"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : {default: mod};
	};
Object.defineProperty(exports, "__esModule", {value: true});
const decimal_js_1 = __importDefault(require("decimal.js"));
(async () => {
	await (() => {
		console.log("Hi");
	})();
})();
console.log(
	new decimal_js_1.default(1)
		.atan()
		.times(new decimal_js_1.default(180).dividedBy(Math.PI)),
);
//# sourceMappingURL=test.js.map
