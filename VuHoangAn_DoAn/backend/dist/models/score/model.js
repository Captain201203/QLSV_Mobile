import mongoose, { Schema } from "mongoose";
const ScoreSchema = new Schema({
    studentId: { type: String, required: true, index: true },
    subjectName: { type: String },
    className: { type: String, index: true },
    ex1Score: { type: Number, required: true, min: 0, max: 10 },
    ex2Score: { type: Number, required: true, min: 0, max: 10 },
    finalScore: { type: Number, required: true, min: 0, max: 10 },
    GPA: { type: Number, required: false, min: 0, max: 4 },
    letterGrade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C', 'C+', 'D', 'D+', 'F'] },
    semester: { type: String, required: true },
    academicYear: { type: String, required: true },
}, {
    timestamps: true
});
ScoreSchema.index({ studentId: 1, subjectId: 1 });
ScoreSchema.index({ className: 1, semester: 1 });
ScoreSchema.index({ subjectId: 1, semester: 1 });
ScoreSchema.index({ academicYear: 1, semester: 1 });
ScoreSchema.index({ studentId: 1, subjectId: 1, semester: 1, academicYear: 1 }, { unique: true });
ScoreSchema.pre('save', function (next) {
    const score = this;
    console.log('🔍 Pre-save hook running...');
    console.log('finalScore:', score.finalScore);
    console.log('GPA before:', score.GPA);
    if (score.finalScore >= 9)
        score.letterGrade = 'A+';
    else if (score.finalScore >= 8.5)
        score.letterGrade = 'A';
    else if (score.finalScore >= 8.0)
        score.letterGrade = 'B+';
    else if (score.finalScore >= 7.0)
        score.letterGrade = 'B';
    else if (score.finalScore >= 6.5)
        score.letterGrade = 'C+';
    else if (score.finalScore >= 6.3)
        score.letterGrade = 'C';
    else if (score.finalScore >= 4.8)
        score.letterGrade = 'D+';
    else if (score.finalScore >= 4.0)
        score.letterGrade = 'D';
    else
        score.letterGrade = 'F';
    if (score.finalScore >= 9)
        score.GPA = 4.0;
    else if (score.finalScore >= 8.5)
        score.GPA = 3.7;
    else if (score.finalScore >= 8.0)
        score.GPA = 3.3;
    else if (score.finalScore >= 7.0)
        score.GPA = 3.0;
    else if (score.finalScore >= 6.5)
        score.GPA = 2.7;
    else if (score.finalScore >= 6.3)
        score.GPA = 2.3;
    else if (score.finalScore >= 4.8)
        score.GPA = 2.0;
    else if (score.finalScore >= 4.0)
        score.GPA = 1.7;
    else
        score.GPA = 0.0;
    next();
});
export default mongoose.model('Score', ScoreSchema);
//# sourceMappingURL=model.js.map