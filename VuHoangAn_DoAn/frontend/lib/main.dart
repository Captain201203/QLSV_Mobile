import 'package:flutter/material.dart';
import 'package:frontend/screens/student/select_account_screen.dart';
import 'theme.dart';
import 'screens/admin/nav_wrapper.dart';
import 'screens/student/select_account_screen.dart';


// -----------Điểm bắt đầu của ứng dụng---------
void main() {
  runApp(const StudentManagementApp());
}

//----------- Widget gốc của ứng dụng--------------
class StudentManagementApp extends StatelessWidget {
  const StudentManagementApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Student Management App', // Tiêu đề ứng dụng
      debugShowCheckedModeBanner: false, // Ẩn banner debug
      theme: appTheme, // Theme mặc định của ứng dụng
      home: const SelectAccountScreen(), // Trang chính khi mở app
    );
  }
}
