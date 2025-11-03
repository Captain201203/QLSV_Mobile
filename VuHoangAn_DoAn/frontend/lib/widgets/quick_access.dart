import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/student.dart';
import '../screens/student/score_screen.dart';
import '../screens/student/study_info_screen.dart';
import '../screens/student/attendance_screen.dart';
import '../screens/student/exam_schedule_screen.dart';

class QuickAccessSection extends StatelessWidget {
  const QuickAccessSection({super.key});

  @override
  Widget build(BuildContext context) { // Biểu tượng và nhãn cho từng mục
    final items = [
      {
        'label': 'Lịch học',
        'imageUrl': 'https://cdn-icons-png.flaticon.com/512/3079/3079302.png',
        'type': 'study',
      },
      {
        'label': 'Xem điểm',
        'imageUrl': 'https://cdn-icons-png.flaticon.com/512/2994/2994170.png',
        'type': 'score',
      },
      {
        'label': 'Điểm danh',
        'imageUrl': 'https://cdn-icons-png.flaticon.com/128/10219/10219997.png',
        'type': 'attendance',
      },
      {
        'label': 'Lịch thi',
        'imageUrl': 'https://cdn-icons-png.freepik.com/256/7992/7992312.png',
        'type': 'exam',
      },
    ];

    return Padding( // tạo padding cho toàn bộ widget
      padding: const EdgeInsets.symmetric(horizontal: 9.0, vertical: 9),
      child: Container( // hộp chứa toàn bộ mục truy cập nhanh
        width: double.infinity,
        
        padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
              color:
                  const Color.fromARGB(255, 158, 158, 158).withOpacity(0.4),
              width: 0.8),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.15),
              blurRadius: 6,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        // Allow horizontal scrolling when items don't fit the width
        child: SingleChildScrollView( // cho phép cuộn ngang khi các mục không vừa với chiều rộng
          scrollDirection: Axis.horizontal,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: items.map((item) {
            final String label = item['label'] as String;
            final String? imageUrl = item['imageUrl'] as String?;
            final String type = item['type'] as String;

            return GestureDetector( // xử lý sự kiện nhấn vào mục
              onTap: () async {
                if (type == 'score') {
                  // 🔹 Lấy dữ liệu sinh viên từ SharedPreferences
                  final prefs = await SharedPreferences.getInstance();
                  final student = Student(
                    id: '',
                    studentId: prefs.getString('studentId') ?? '',
                    studentName: prefs.getString('studentName') ?? '',
                    email: prefs.getString('email') ?? '',
                    className: prefs.getString('className') ?? '',
                    dateOfBirth: DateTime.now(),
                    phoneNumber: '',
                  );

                  if (context.mounted) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ScoreScreen(student: student),
                      ),
                    );
                  }
                } else if (type == 'study') {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const StudyInfoScreen()),
                  );
                } else if (type == 'attendance') {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const AttendanceScreen()),
                  );
                } else if (type == 'exam') {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ExamScheduleScreen()),
                  );
                }
              },
              child: Column(
                children: [
                  Container(
                    height: 70,
                    width: 70,
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 220, 220, 220),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(9.0),
                      child: imageUrl != null
                          ? Image.network(
                              imageUrl,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) =>
                                  const Icon(Icons.error, color: Colors.red),
                            )
                          : const Icon(Icons.image, size: 30),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: 80,
                    child: Text(
                      label,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Color.fromARGB(221, 78, 77, 77),
                      ),
                    ),
                  ),
                ],
              ),
            );
            }).toList(),
          ),
        ),
      ),
    );
  }
}
