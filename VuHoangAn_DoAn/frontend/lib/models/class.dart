class Class {
  final String id;
  final String classId;
  final String className;
  final String department;

  Class ({
    required this.id,
    required this.classId,
    required this.className,
    required this.department,
  });

  factory Class.fromJson(Map<String, dynamic> json) {
    return Class(
      id: json['_id'] as String,
      classId: json['classId'] as String,
      className: json['className'] as String,
      department: json['department'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'classId': classId,
      'className': className,
      'department': department,
    };
  }

}

