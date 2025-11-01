import moongose, { Schema } from 'mongoose';
const ExamScheduleSchema = new Schema({
    className: { type: String, required: true, index: true },
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    examType: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    room: { type: String, required: true },
    lecture: { type: String },
    note: { type: String },
    semester: { type: String, required: true, index: true },
}, {
    timestamps: true
});
ExamScheduleSchema.index({ className: 1, subjectId: 1, examType: 1, semester: 1 }, { unique: true });
ExamScheduleSchema.index({ className: 1, examDate: 1 });
export default moongose.model('ExamSchedule', ExamScheduleSchema);
//# sourceMappingURL=model.js.map