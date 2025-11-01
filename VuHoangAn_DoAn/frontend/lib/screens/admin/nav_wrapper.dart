import 'package:flutter/material.dart';
import 'dashboard_page.dart';
import 'student/student_list.dart';
import 'schedule/schedule_list.dart';
import 'account/account_list.dart';
import 'subject/subject_list.dart';
import 'settings_page.dart';
import 'class/class_list.dart';

//---------------- Widget bao bọc toàn bộ ứng dụng với thanh điều hướng dưới cùng-------------------
class NavWrapper extends StatefulWidget {
  const NavWrapper({super.key});

  @override
  State<NavWrapper> createState() => _NavWrapperState();
}

// ------------State quản lý trang hiện tại và danh sách trang-------------------
class _NavWrapperState extends State<NavWrapper> {
  int _currentIndex = 0; // Chỉ số trang đang hiển thị

  // 🧭 Danh sách các trang hiển thị khi chọn ở BottomNavigationBar
  final List<Widget> _pages = const [
    DashboardPage(),
    StudentListPage(),
    ScheduleListPage(),
    AccountListPage(),
    SubjectListPage(),
    SettingsPage(),
    ClassListPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Hiển thị trang hiện tại
      body: SafeArea(child: _pages[_currentIndex]),

      // Thanh điều hướng dưới cùng
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed, // hiển thị đầy đủ item
        backgroundColor: Colors.white,
        selectedItemColor: const Color(0xFF2196F3), // màu item đang chọn
        unselectedItemColor: Colors.grey.shade600, // màu item chưa chọn
        showUnselectedLabels: true,
        onTap: (i) => setState(() => _currentIndex = i), // chuyển trang
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home, color: Color(0xFF2196F3)),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school_outlined),
            activeIcon: Icon(Icons.school, color: Color(0xFF2196F3)),
            label: 'Students',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today_outlined),
            activeIcon: Icon(Icons.calendar_today, color: Color(0xFF2196F3)),
            label: 'Schedule',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person, color: Color(0xFF2196F3)),
            label: 'Accounts',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.book_outlined),
            activeIcon: Icon(Icons.book, color: Color(0xFF2196F3)),
            label: 'Subjects', // ✅ thêm label Môn học
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            activeIcon: Icon(Icons.settings, color: Color(0xFF2196F3)),
            label: 'Settings',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.class_outlined),
            activeIcon: Icon(Icons.school, color: Color(0xFF2196F3)),
            label: 'Classes',
          ),
        ],
      ),
    );
  }
}
