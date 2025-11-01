import mongoose, { Document, Schema } from 'mongoose'

export interface ICourse extends Document{
    courseId: string;
    courseName: string;
    description: string;
    classes: mongoose.Types.ObjectId[]; 
}

const CourseSchema: Schema = new Schema({
    courseId: {type: String, required: true, unique: true},
    courseName: {type: String, required: true},
    description: {type: String, required: true},
    classes: {type: [mongoose.Schema.Types.ObjectId], ref: 'Class'}
});

export default mongoose.model<ICourse>('Course', CourseSchema)