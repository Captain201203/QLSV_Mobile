import mongoose, { Document, Schema } from 'mongoose'

export interface ILesson extends Document{
    lessonId:string;
    courseId: String;
    title: string;
    description: string;
    order: number;
}

const LessonSchema: Schema = new Schema({
    lessonId: {type: String, required: true, unique: true},
    courseId: {type: String, required: true, ref: 'Course'},
    title: {type: String, required: true},
    description: {type: String, required: true},
    order: {type: Number, required: true},
})

export default mongoose.model<ILesson>('Lesson', LessonSchema)