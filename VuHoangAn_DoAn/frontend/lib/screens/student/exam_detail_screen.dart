import 'package:flutter/material.dart';

class ExamDetailScreen extends StatelessWidget {
  final Map<String, String> exam;

  const ExamDetailScreen({super.key, required this.exam});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chi tiết lịch thi'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            buildDetail('Thời gian thi', '${exam['time']}, ${exam['date']}'),
            buildDetail('Phòng thi', exam['room']!),
            buildDetail('Thời gian làm bài', exam['duration']!),
            buildDetail('Môn thi', exam['subject']!),
            buildDetail('Mã môn thi', exam['code']!),
            buildDetail('Nhóm', exam['group']!),
            buildDetail('Tổ', exam['team']!),
          ],
        ),
      ),
    );
  }

  Widget buildDetail(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(
              '$title:',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
