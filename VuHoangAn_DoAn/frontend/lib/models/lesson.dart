class Lesson{
  final String lessonId;
  final String courseId;
  final String title;
  final String description;
  final int order;

  Lesson({
    required this.lessonId,
    required this.courseId,
    required this.title,
    required this.description,
    required this.order,
  });

  factory Lesson.fromJson(Map<String,dynamic>json) => Lesson(
    lessonId: json['lessonId'] ?? '',
    courseId: json['courseId'] ?? '',
    title: json['title'] ?? '',
    description: json [ 'description'] ?? '',
    order: json['order'] ?? 0,

  );

  Map<String,dynamic>toJson()=>{
    'lessonId': lessonId,
    'courseId': courseId,
    'title': title,
    'description': description,
    'order': order,
  };

}