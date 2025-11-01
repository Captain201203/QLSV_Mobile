import 'package:flutter/material.dart';
import '../../../models/student.dart';
import '../../../models/class.dart';
import '../../../theme.dart';

class StudentListByClassPage extends StatelessWidget {
  final Class classItem;
  final List<Student> students;

  const StudentListByClassPage({
    super.key,
    required this.classItem,
    required this.students,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: Text('Lớp: ${classItem.className}'),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
      ),
      body: students.isEmpty
          ? const Center(child: Text('Chưa có sinh viên trong lớp này.'))
          : ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: students.length,
              itemBuilder: (context, index) {
                final s = students[index];
                return Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 2,
                  margin: const EdgeInsets.symmetric(vertical: 6),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: kPrimary.withValues(alpha: 0.1),
                      child: Text(
                        s.studentId,
                        style: TextStyle(
                          color: kPrimaryDark,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    title: Text(
                      s.studentName,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Email: ${s.email}'),
                        Text('SĐT: ${s.phoneNumber}'),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
