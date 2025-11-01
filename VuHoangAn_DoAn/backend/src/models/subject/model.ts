import mongoose, { Document, Schema} from 'mongoose';

export interface ISubject extends Document{
    subjectId: string;
    subjectName: string;
    credits: number;
    department: string;
    description: string;
}

const SubjectSchema: Schema = new Schema({
    subjectId: {type: String, required: true, unique: true},
    subjectName: {type: String, required: true},
    credits: {type: Number, required: true},
    department: { type: String, required: true},
    description: {type: String, required: false},
})

export default mongoose.model<ISubject>('Subject', SubjectSchema);