import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../screens/student/home_screen.dart';
import '../screens/student/study_info_screen.dart';
import '../screens/student/exam_schedule_screen.dart';
import '../screens/student/news_screen.dart';
import '../screens/student/other_screen.dart';

class BottomNavBar extends StatelessWidget {
  final int currentIndex;
  const BottomNavBar({super.key, required this.currentIndex});

  @override
Widget build(BuildContext context) { // Biểu tượng và nhãn cho từng mục
  final items = [
    {'icon': Icons.home, 'label': 'Trang chủ'},
    {'icon': Icons.calendar_month, 'label': 'TKB'},
    {'icon': Icons.assignment, 'label': 'Lịch thi'},
    {'icon': Icons.notifications_none, 'label': 'Thông báo'},
    {'icon': Icons.grid_view, 'label': 'Khác'},
  ];

  return ClipRect(
  child: SafeArea( // tránh bị che khuất bởi các phần cứng như notch, bo tròn
    top: false,
    child: Container(
      padding: const EdgeInsets.symmetric(vertical: 13, horizontal: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Colors.grey.shade300, width: 1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: items.asMap().entries.map((entry) {
          final index = entry.key;
          final item = entry.value;
          final bool isSelected = index == currentIndex;

          return GestureDetector(
            behavior: HitTestBehavior.opaque, // 👈 đảm bảo vùng bấm đầy đủ
            onTap: () async {
              if (index == currentIndex) return;

              Widget destination; // điều hướng, tạo switch case để chọn màn hình
              switch (index) { 
                case 0:
                  destination = const HomeScreen();
                  break;
                case 1:
                  
                  final prefs = await SharedPreferences.getInstance(); // shared preferences là công cụ lưu trữ dữ liệu trên thiết bị
                  final cls = prefs.getString('className') ?? ''; // lấy className từ shared preferences
                  destination = StudyInfoScreen(className: cls); // truyền className vào StudyInfoScreen
                  break;
                case 2:
                  destination = const ExamScheduleScreen();
                  break;
                case 3:
                  destination = const NewsScreen();
                  break;
                case 4:
                  destination = const OtherScreen();
                  break;
                default:
                  destination = const HomeScreen();
              }

              if (context.mounted) {
               
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => destination),
                  (route) => false, 
                );
              }
            },
            child: AnimatedContainer( // hiệu ứng chuyển đổi khi chọn mục
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: isSelected
                    ? const Color(0xFF1DA1F2).withOpacity(0.1)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  Icon(
                    item['icon'] as IconData,
                    color: isSelected ? const Color(0xFF1DA1F2) : Colors.grey,
                    size: isSelected ? 28 : 26,
                  ),
                  if (isSelected) ...[
                    const SizedBox(width: 6),
                    Text(
                      item['label'] as String,
                      style: const TextStyle(
                        fontFamily: 'Roboto',
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF1DA1F2),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          );
        }).toList(),
      ),
    ),
  ),
);
}
  
}
