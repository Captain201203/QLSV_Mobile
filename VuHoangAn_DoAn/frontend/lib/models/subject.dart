class Subject {
  final String id;           // _id của MongoDB (nếu có)
  final String subjectId;    // Mã môn học (VD: "CS101")
  final String subjectName;  // Tên môn học (VD: "Lập trình Flutter")
  final int credits;         // Số tín chỉ
  final String department;   // Khoa phụ trách
  final String? description; // Mô tả (có thể null)

  Subject({
    required this.id,
    required this.subjectId,
    required this.subjectName,
    required this.credits,
    required this.department,
    this.description,
  });

  // Chuyển từ JSON (nhận từ backend) → Dart object
  factory Subject.fromJson(Map<String, dynamic> json) {
    return Subject(
      id: json['_id'] ?? '', // Nếu backend không gửi, để rỗng
      subjectId: json['subjectId'] ?? '',
      subjectName: json['subjectName'] ?? '',
      credits: json['credits'] ?? 0,
      department: json['department'] ?? '',
      description: json['description'],
    );
  }

  // Chuyển từ Dart object → JSON (gửi lên backend)
  Map<String, dynamic> toJson() {
    return {
      'subjectId': subjectId,
      'subjectName': subjectName,
      'credits': credits,
      'department': department,
      'description': description,
    };
  }
}
