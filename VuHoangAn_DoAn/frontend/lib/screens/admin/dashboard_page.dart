import 'package:flutter/material.dart';
import 'student/student_list.dart';
import 'account/account_list.dart';
import 'schedule/schedule_list.dart';
import 'subject/subject_list.dart';
import 'class/class_list.dart';
import 'score/classOfScore.dart';

//------------- Widget hiển thị Dashboard chính của hệ thống----------------
class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],

      // AppBar với tiêu đề và bo góc dưới
      appBar: AppBar(
        title: const Text(
          'Trang Quản Trị',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF2196F3),
        centerTitle: true,
        elevation: 4,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(16)),
        ),
      ),

      // Nội dung chính: lưới 2 cột các mục quản lý
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 20,
          mainAxisSpacing: 20,
          children: [
            // Card quản lý Sinh viên
            _buildDashboardCard(
              context,
              title: 'Quản lý Sinh viên',
              icon: Icons.school_rounded,
              color: Colors.blue.shade400,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const StudentListPage()),
              ),
            ),

            // Card quản lý Tài khoản
            _buildDashboardCard(
              context,
              title: 'Quản lý Tài khoản',
              icon: Icons.person_outline_rounded,
              color: Colors.green.shade400,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AccountListPage()),
              ),
            ),

            // Card Thời khóa biểu
            _buildDashboardCard(
              context,
              title: 'Thời khóa biểu',
              icon: Icons.calendar_month_rounded,
              color: Colors.orange.shade400,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ScheduleListPage()),
              ),
            ),

            // Card quản lý Môn học
            _buildDashboardCard(
              context,
              title: 'Quản lý Môn học',
              icon: Icons.book_rounded,
              color: Colors.purple.shade400,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SubjectListPage()),
              ),
            ),

            // Card quản lý Lớp
            _buildDashboardCard(
              context,
              title: 'Quản lý Lớp',
              icon: Icons.class_rounded,
              color: Colors.teal.shade400,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ClassListPage()),
              ),
            ),

            // Card quản lý Điểm
            _buildDashboardCard(
              context,
              title: 'Quản lý Điểm',
              icon: Icons.grade_rounded, // ✅ Sửa icon
              color: Colors.red.shade400,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ScoreManagementScreen()),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------Hàm tạo từng card trong Dashboard-----------------
  Widget _buildDashboardCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withValues(alpha: 0.2),
              blurRadius: 10,
              spreadRadius: 2,
              offset: const Offset(3, 3),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Icon hình tròn
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 48, color: color),
            ),
            const SizedBox(height: 16),

            // Tiêu đề card
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.grey[800],
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }
}