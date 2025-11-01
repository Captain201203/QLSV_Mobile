import 'package:flutter/material.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Thông báo',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.blueAccent,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          ListTile(
            leading: Icon(Icons.notifications_active, color: Colors.blue),
            title: Text('Lịch thi học kỳ 1 đã được cập nhật'),
            subtitle: Text('Xem chi tiết trong mục Lịch thi'),
          ),
          Divider(),
          ListTile(
            leading: Icon(Icons.notifications, color: Colors.orange),
            title: Text('Đăng ký học phần sẽ mở vào tuần tới'),
            subtitle: Text('Chuẩn bị danh sách môn học sớm nhé!'),
          ),
          Divider(),
          ListTile(
            leading: Icon(Icons.campaign, color: Colors.redAccent),
            title: Text('Thông báo từ phòng Đào tạo'),
            subtitle: Text('Vui lòng kiểm tra email sinh viên.'),
          ),
        ],
      ),
    );
  }
}
