import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/student.dart';
import '../screens/student/score_screen.dart';
import '../screens/student/study_info_screen.dart';

class QuickAccessSection extends StatelessWidget {
  const QuickAccessSection({super.key});

  @override
  Widget build(BuildContext context) {
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
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 9.0, vertical: 9),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 30),
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
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: items.map((item) {
            final String label = item['label'] as String;
            final String? imageUrl = item['imageUrl'] as String?;
            final String type = item['type'] as String;

            return GestureDetector(
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
    );
  }
}
