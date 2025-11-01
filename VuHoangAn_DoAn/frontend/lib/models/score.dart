class Score{
  final String id;
  final String studentId;
  final String subjectId;
  final String subjectName;
  final String className;
  final double ex1Score;
  final double ex2Score;
  final double finalScore;
  final double GPA;
  final String letterGrade;
  final String semester;
  final String academicYear;
  final DateTime createdAt;
  final DateTime updatedAt;

  Score ({
    required this.id,
    required this.studentId,
    required this.subjectId,
    required this.subjectName,
    required this.className,
    required this.ex1Score,
    required this.ex2Score,
    required this.finalScore,
    required this.GPA,
    required this.letterGrade,
    required this.semester,
    required this.academicYear,
    required this.createdAt,
    required this.updatedAt
  });

  factory Score.fromJson(Map<String, dynamic> json){
    return Score(
      id: json['_id'] ?? '',
      studentId: json['studentId'] ?? '',
      subjectId: json['subjectId'] ?? '',
      subjectName: json['subjectName'] ?? '',
      className: json['className'] ?? '',
      ex1Score: (json['ex1Score'] ?? 0).toDouble(),
      ex2Score: (json['ex2Score'] ?? 0).toDouble(),
      finalScore: (json['finalScore'] ?? 0).toDouble(),
      GPA: (json['GPA'] ?? 0).toDouble(),
      letterGrade: json['letterGrade'] ?? '',
      semester: json['semester'] ?? '',
      academicYear: json['academicYear'] ?? '',
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String())
    );
  }

  Map<String,dynamic> toJson(){
    return{
      'studentId': studentId,
      'subjectId': subjectId,
      'ex1Score': ex1Score,
      'ex2Score': ex2Score,
      'finalScore': finalScore,
      'semester': semester,
      'academicYear': academicYear,
    };
  }

  String get formattedFinalScore => finalScore.toStringAsFixed(1);
  String get formattedGPA => GPA.toStringAsFixed(2);
}