import mongoose, { Document, Schema } from 'mongoose'

export interface IDocument extends Document {
  documentId: string;
  lessonId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    documentId: { type: String, required: true, unique: true },
    lessonId: { type: String, required: true, ref: 'Lesson' },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model<IDocument>('Document', DocumentSchema)


