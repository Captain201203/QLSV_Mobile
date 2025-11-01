import mongoose, {Schema, Document} from "mongoose";

export interface IClass extends Document{
    classId: string;
    className: string;
    department: string;
    students: mongoose.Types.ObjectId[];
}

const ClassSchema: Schema = new Schema({
    classId: {type: String, required: true, unique: true},
    className: {type: String, required: true},
    department: { type: String, required: true},
    students: { type: [Schema.Types.ObjectId], ref: 'Student', default: []},
})

export default mongoose.model<IClass>('Class', ClassSchema);
