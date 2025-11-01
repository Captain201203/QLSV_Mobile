import mongoose, { Schema } from 'mongoose';
const ScheduleSchema = new Schema({
    className: { type: String, required: true },
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    lecturer: { type: String, required: false },
    room: { type: String, required: false },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    note: { type: String, required: false },
});
ScheduleSchema.index({ className: 1, startAt: 1 });
export default mongoose.model('Schedule', ScheduleSchema);
//# sourceMappingURL=model.js.map