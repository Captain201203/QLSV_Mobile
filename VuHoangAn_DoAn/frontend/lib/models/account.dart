class Account {
  final String id;
  final String studentName;
  final String email;
  final String password;
  final String role;
  final String? status; // Trạng thái tạo tài khoản

  Account({
    required this.id,
    required this.studentName,
    required this.email,
    required this.password,
    required this.role,
    this.status,
  });

  factory Account.fromJson(Map<String, dynamic> json) => Account(
        id: json['_id'] ?? '',
        studentName: json['name'] ?? json['studentName'] ?? '',
        email: json['username'] ?? json['email'] ?? '',
        password: json['password'] ?? '',
        role: json['role'] ?? '',
        status: json['status'],
      );

  Map<String, dynamic> toJson() => {
        '_id': id,
        'studentName': studentName,
        'email': email,
        'password': password,
        'role': role,
        'status': status,
      };
}
