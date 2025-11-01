import mongoose, { Document, Schema} from 'mongoose';

export interface ISchedule extends Document{
    className: string;
    subjectId: string;
    subjectName: string;
    lecturer?:string;
    room?: string;
    startAt: Date;
    endAt: Date;
    note?: string
}

const ScheduleSchema = new Schema<ISchedule>({
    className: {type: String, required: true},
    subjectId: {type: String, required: true},
    subjectName: {type: String, required: true},
    lecturer: {type: String, required: false},
    room: {type: String, required: false},
    startAt: {type: Date, required: true},
    endAt: {type: Date, required: true},
    note: {type: String, required: false},
})

ScheduleSchema.index({className: 1, startAt: 1});

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema);
    