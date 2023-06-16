import {Schema, model} from "mongoose";
const embedSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	author: String,
	customID: Number,
	content: String,
	embeds: Array,
	files: Array,
	components: Array,
});

export default model("Embed", embedSchema, "Embeds");
