import 'package:flutter/material.dart';
import 'package:frontend/models/student.dart';
import 'score_screen.dart'; // 👉 Màn hình xem điểm

class SettingsScreen extends StatelessWidget {
  final Student student;

  const SettingsScreen({super.key, required this.student});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Cài đặt',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.blueAccent,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16), // Padding cho toàn bộ ListView
        children: [
          // 🟢 Thông tin sinh viên
          ListTile(
            leading: const Icon(Icons.person, color: Colors.blue),
            title: Text(student.studentName),
            subtitle: Text('MSSV: ${student.studentId}'),
          ),

          const Divider(),

          // 🟢 Xem điểm
          ListTile(
            leading: const Icon(Icons.school, color: Colors.green),
            title: const Text('Xem điểm'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ScoreScreen(student: student),
                ),
              );
            },
          ),

          const Divider(),

          // 🟢 Bật/tắt thông báo
          SwitchListTile(
            value: true,
            onChanged: (val) {
              // TODO: xử lý logic bật/tắt thông báo ở đây
            },
            title: const Text('Nhận thông báo'),
            secondary: const Icon(Icons.notifications),
          ),

          const Divider(),

          // 🟢 Đổi mật khẩu
          ListTile(
            leading: const Icon(Icons.lock, color: Colors.orange),
            title: const Text('Đổi mật khẩu'),
            onTap: () {
              // TODO: điều hướng sang màn hình đổi mật khẩu
            },
          ),

          const Divider(),

          // 🟢 Đăng xuất
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.redAccent),
            title: const Text('Đăng xuất'),
            onTap: () {
              // Ví dụ: quay lại màn hình đăng nhập
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}
