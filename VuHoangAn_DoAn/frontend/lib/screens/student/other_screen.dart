import 'dart:io';
import 'package:flutter/material.dart';
import 'package:frontend/screens/student/score_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../widgets/bottom_nav.dart';
import '../student/study_info_screen.dart';
import '../student/exam_schedule_screen.dart';
import '../student/edit_profile_screen.dart';
import '../student/login_screen.dart';
import '../../models/student.dart';

class OtherScreen extends StatefulWidget {
  final Student? student;
  const OtherScreen({super.key, this.student});

  @override
  State<OtherScreen> createState() => _OtherScreenState();
}

class _OtherScreenState extends State<OtherScreen> {
  File? _avatarImage;
  String _email = "nguyenphuonglinh141204@gmail.com";
  String _studentName = 'Người dùng';
  String _studentId = '';

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  /// 🔹 Load dữ liệu từ SharedPreferences
  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final avatarPath = prefs.getString('avatar_path');
    final savedEmail = prefs.getString('email');
    final savedName = prefs.getString('studentName');
    final savedId = prefs.getString('studentId');

    if (!mounted) return;

    setState(() {
      if (avatarPath != null && File(avatarPath).existsSync()) {
        _avatarImage = File(avatarPath);
      }
      _email = savedEmail?.isNotEmpty == true ? savedEmail! : _email;
      _studentName = savedName?.isNotEmpty == true ? savedName! : _studentName;
      _studentId = savedId?.isNotEmpty == true ? savedId! : _studentId;
    });
  }

  /// 🔹 Chuyển sang màn chỉnh sửa và reload khi quay lại
  Future<void> _navigateToEditProfile(BuildContext context) async {
    await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const EditProfileScreen()),
    );
    await _loadUserData(); // Reload lại dữ liệu khi quay lại
  }

  /// 🔹 Đăng xuất — chỉ xóa trạng thái đăng nhập
  Future<void> _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('is_logged_in');

    if (!mounted) return;

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      bottomNavigationBar: const BottomNavBar(currentIndex: 4),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0056A6),
        centerTitle: true,
        automaticallyImplyLeading: false,
        title: const Text('Cài đặt', style: TextStyle(color: Colors.white)),
      ),
      body: ListView(
        children: [
          // --- Thông tin người dùng ---
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                CircleAvatar(
                  radius: 32,
                  backgroundColor: Colors.amber,
                  backgroundImage:
                      _avatarImage != null ? FileImage(_avatarImage!) : null,
                  child: _avatarImage == null
                      ? const Text(
                          'NP',
                          style: TextStyle(
                            fontSize: 24,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        )
                      : null,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(
                      widget.student?.studentName ?? _studentName,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    subtitle: Text(
                      'MSSV: ${widget.student?.studentId ?? _studentId}',
                      style: const TextStyle(color: Colors.black54),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Divider(),

          // --- Mục TÀI KHOẢN ---
          const _SectionHeader(title: 'TÀI KHOẢN'),
          _ListItem(
            icon: Icons.person_outline,
            title: 'Chỉnh sửa thông tin',
            onTap: () => _navigateToEditProfile(context),
          ),
          _ListItem(
            icon: Icons.lock_outline,
            title: 'Thay đổi mật khẩu',
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Tính năng đang được phát triển')),
              );
            },
          ),

          const Divider(),

          // --- Mục HỌC TẬP ---
          const _SectionHeader(title: 'HỌC TẬP'),
          _ListItem(
            icon: Icons.grade_outlined,
            title: 'Xem điểm',
            onTap: () async {
              // Build a Student object from SharedPreferences and navigate
              final prefs = await SharedPreferences.getInstance();
              final student = Student(
                id: prefs.getString('id') ?? '',
                studentId: prefs.getString('studentId') ?? '',
                studentName: prefs.getString('studentName') ?? _studentName,
                dateOfBirth: DateTime.now(),
                phoneNumber: prefs.getString('phoneNumber') ?? '',
                email: prefs.getString('email') ?? _email,
                className: prefs.getString('className') ?? '',
              );

              if (!mounted) return;

              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => ScoreScreen(student: student)),
              );
            },
          ),
          _ListItem(
            icon: Icons.calendar_today_outlined,
            title: 'Thời khóa biểu',
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const StudyInfoScreen()),
              );
            },
          ),
          _ListItem(
            icon: Icons.assignment_outlined,
            title: 'Lịch thi',
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ExamScheduleScreen()),
              );
            },
          ),

          const Divider(),

          // --- Mục KHÁC ---
          const _SectionHeader(title: 'KHÁC'),
          _ListItem(
            icon: Icons.logout,
            title: 'Đăng xuất',
            textColor: Colors.red,
            onTap: () => _logout(context),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

/// 🔹 Tiêu đề từng nhóm
class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
        ),
      ),
    );
  }
}

/// 🔹 Item trong danh sách cài đặt
class _ListItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final Color? textColor;

  const _ListItem({
    required this.icon,
    required this.title,
    required this.onTap,
    this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: Colors.black87),
      title: Text(
        title,
        style: TextStyle(
          fontSize: 15,
          color: textColor ?? Colors.black,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing: const Icon(Icons.chevron_right, color: Colors.grey),
      onTap: onTap,
    );
  }
}
