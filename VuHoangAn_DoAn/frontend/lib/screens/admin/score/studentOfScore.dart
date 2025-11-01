import 'package:flutter/material.dart';
import '../../../theme.dart';
import '../../../models/class.dart';
import '../../../models/student.dart';
import '../../../services/class_service.dart';
import 'subjectOfScore.dart';

class ClassScoreScreen extends StatefulWidget {
  final Class classItem;
  const ClassScoreScreen({super.key, required this.classItem});

  @override
  State<ClassScoreScreen> createState() => _ClassScoreScreenState();
}

class _ClassScoreScreenState extends State<ClassScoreScreen> {
  late Future<List<Student>> _students;

  @override
  void initState() {
    super.initState();
    _loadStudents();
  }

  void _loadStudents() {
    _students = ClassService.getStudentsInClass(widget.classItem.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: Text("Lớp ${widget.classItem.className}"),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder<List<Student>>(
        future: _students,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Lỗi: ${snapshot.error}"));
          }

          final students = snapshot.data ?? [];

          if (students.isEmpty) {
            return const Center(child: Text("Chưa có sinh viên nào trong lớp này."));
          }

          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                _loadStudents();
              });
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: students.length,
              itemBuilder: (context, index) {
                final s = students[index];
                return Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.blue.shade100,
                      child: Text(
                        s.studentName.isNotEmpty ? s.studentName[0].toUpperCase() : "?",
                        style: TextStyle(
                          color: Colors.blue.shade800,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    title: Text(s.studentName, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text("MSSV: ${s.studentId}"),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () async {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => StudentSubjectScreen(
                            studentId: s.studentId,
                            studentName: s.studentName,
                            className: widget.classItem.className,
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
