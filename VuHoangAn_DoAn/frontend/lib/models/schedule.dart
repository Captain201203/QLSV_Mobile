class Schedule {
  final String id;
  final String className;
  final String subjectId;
  final String subjectName;
  final String? lecturer;
  final String? room;
  final DateTime startAt;
  final DateTime endAt;
  final String? note;

  Schedule({
    required this.id,
    required this.className,
    required this.subjectId,
    required this.subjectName,
    this.lecturer,
    this.room,
    required this.startAt,
    required this.endAt,
    this.note,
  });
  
  factory Schedule.fromJson(Map<String, dynamic> json) => Schedule(
    id: json['_id'] ?? '',
    className: json['className'] ?? '',
    subjectId: json['subjectId'] ?? '',
    subjectName: json['subjectName'] ?? '',
    lecturer: json['lecturer'],
    room: json['room'],
    startAt: DateTime.parse(json['startAt']),
    endAt: DateTime.parse(json['endAt']),
    note: json['note'],
  );

  Map<String, dynamic> toJson() => {
    'className': className,
    'subjectId': subjectId,
    'lecturer': lecturer,
    'room': room,
    'startAt': startAt.toIso8601String(),
    'endAt': endAt.toIso8601String(),
    'note': note,
  };
}

