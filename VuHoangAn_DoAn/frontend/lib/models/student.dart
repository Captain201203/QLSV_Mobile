// lib/models/student.dart
class Student {
  // Các thuộc tính phải khớp với tên trường trong JSON trả về từ API
  // Lưu ý: Mongoose tự động thêm trường '_id' và các thuộc tính khác.
  final String id; // Đây là trường '_id' của Mongoose (thường là String)
  final String studentId;
  final String studentName;
  final DateTime dateOfBirth; // Sử dụng DateTime cho trường Date
  final String phoneNumber;
  final String email;
  final String className; // Tên lớp học

  Student({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.dateOfBirth,
    required this.phoneNumber,
    required this.email,
    required this.className,
  });

  // Factory Constructor: Chuyển đổi (Deserialize) JSON thành đối tượng Student
  factory Student.fromJson(Map<String, dynamic> json) {
    // 1. Lấy dữ liệu từ Map JSON
    // 2. Chuyển đổi kiểu dữ liệu nếu cần
    return Student(
      // Mongoose dùng '_id' nhưng bạn có thể gọi nó là 'id' trong Dart
      id: json['_id'] as String, 
      
      // Các trường còn lại khớp tên với Schema của bạn
      studentId: json['studentId'] as String,
      studentName: json['studentName'] as String,
      phoneNumber: json['phoneNumber'] as String,
      email: json['email'] as String,
      className: json['className'] as String,
      
      // Xử lý trường Date:
      // JSON thường trả về ngày dưới dạng chuỗi ISO 8601. 
      // Cần dùng DateTime.parse() để chuyển nó thành đối tượng DateTime của Dart.
      dateOfBirth: DateTime.parse(json['dateOfBirth'] as String),
    );
  }
  
  // Phương thức tiện ích: Chuyển đổi đối tượng Dart thành Map (Serialize)
  // Dùng khi bạn muốn gửi dữ liệu lên server (POST/PUT request)
  Map<String, dynamic> toJson() {
    return {
      // Bạn thường không gửi 'id' khi tạo mới, chỉ khi cập nhật
      // '_id': id, 
      'studentId': studentId,
      'studentName': studentName,
      'phoneNumber': phoneNumber,
      'email': email,
      'className': className,
      // Chuyển DateTime thành chuỗi ISO 8601 trước khi gửi
      'dateOfBirth': dateOfBirth.toIso8601String(), 
    };
  }
}