class Course{
  final String courseId;
  final String subjectId;
  final String courseName;
  final String description;
  final List<String> students;

  Course({
    required this.courseId,
    required this.subjectId,
    required this.courseName,
    required this.description,
    required this.students,
  });

  factory Course.fromJson(Map<String, dynamic>json) => Course(
    courseId: json['_id'] ?? '',
    subjectId: json['subjectId'],
    courseName: json['courseName'] ?? '',
    description: json['description'] ?? '',
    students: json['students'] ?? [],
  );

  Map<String, dynamic> toJson() => {
    'courseId': courseId,
    'subjectId': subjectId,
    'courseName': courseName,
    'description': description,
    'students': students,
  };
}