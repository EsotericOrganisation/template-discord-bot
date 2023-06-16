import {Schema, model} from "mongoose";

const temp = new Schema({
	_id: Schema.Types.ObjectId,
	type: String,
	match: Object,
	data: Object,
	lifeSpan: Number,
	date: Number,
});

export default model("temp", temp, "Temp");
