import 'package:flutter/material.dart';
import 'exam_detail_screen.dart';
import '../../widgets/bottom_nav.dart';

class ExamScheduleScreen extends StatelessWidget {
  const ExamScheduleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // 🔹 Dữ liệu mẫu (bạn có thể thay bằng dữ liệu từ API hoặc Database sau)
    final List<Map<String, String>> exams = [
      {
        'subject': 'Lập trình Flutter',
        'code': 'FLUT101',
        'date': '20/12/2025',
        'time': '08:00 - 10:00',
        'room': 'P.A105',
        'duration': '120 phút',
        'group': '01',
        'team': 'A',
      },
      {
        'subject': 'Cơ sở dữ liệu',
        'code': 'DB102',
        'date': '23/12/2025',
        'time': '13:00 - 15:00',
        'room': 'P.B203',
        'duration': '120 phút',
        'group': '02',
        'team': 'B',
      },
      {
        'subject': 'Trí tuệ nhân tạo',
        'code': 'AI203',
        'date': '26/12/2025',
        'time': '09:00 - 11:00',
        'room': 'P.C301',
        'duration': '120 phút',
        'group': '01',
        'team': 'A',
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Lịch thi'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 2),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: exams.length,
        itemBuilder: (context, index) {
          final exam = exams[index];
          return _buildExamItem(context, exam);
        },
      ),
    );
  }

  // 🔹 Tạo 1 ô hiển thị từng môn thi
  Widget _buildExamItem(BuildContext context, Map<String, String> exam) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        leading: const Icon(Icons.book, color: Colors.blueAccent, size: 32),
        title: Text(
          exam['subject']!,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Text('Ngày: ${exam['date']}\nGiờ: ${exam['time']}'),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () {
          // 🔹 Khi bấm vào -> mở màn hình chi tiết
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ExamDetailScreen(exam: exam),
            ),
          );
        },
      ),
    );
  }
}
