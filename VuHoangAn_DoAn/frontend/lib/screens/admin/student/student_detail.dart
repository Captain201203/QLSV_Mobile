import 'package:flutter/material.dart';
import '../../../models/student.dart';

//----------- Widget hiển thị chi tiết thông tin sinh viên--------------
class StudentDetailPage extends StatelessWidget {
  final Student student; // Dữ liệu sinh viên cần hiển thị

  const StudentDetailPage({super.key, required this.student});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chi tiết sinh viên')),
      body: Center(
        // ✅ Đưa toàn bộ nội dung ra giữa màn hình
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Card(
            elevation: 5, // Đổ bóng
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20), // Bo góc
            ),
            child: Container(
              width: 350,
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Avatar hiển thị icon mặc định
                  CircleAvatar(
                    radius: 60,
                    backgroundColor: Colors.blue.shade100,
                    child: const Icon(Icons.person, size: 60, color: Colors.blue),
                  ),
                  const SizedBox(height: 20),

                  // Hiển thị tên sinh viên
                  Text(
                    student.studentName,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Hiển thị mã sinh viên
                  Text(
                    'Mã sinh viên: ${student.studentId}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 8),

                  // Hiển thị ngày sinh
                  Text(
                    'Ngày sinh: ${student.dateOfBirth.day}/${student.dateOfBirth.month}/${student.dateOfBirth.year}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 8),

                  // Hiển thị email
                  Text(
                    'Email: ${student.email}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 8),

                  // Hiển thị số điện thoại
                  Text(
                    'Số điện thoại: ${student.phoneNumber}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 20),

                  // Nút quay lại màn hình trước
                  ElevatedButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back),
                    label: const Text('Quay lại'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
