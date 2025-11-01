import 'package:flutter/material.dart';
import '../../../theme.dart';
import '../../../models/subject.dart';
import '../../../services/student_service.dart';
import 'score_form_screen.dart';
import 'ScoreList.dart';

class StudentSubjectScreen extends StatefulWidget {
  final String studentId;
  final String studentName;
  final String className;

  const StudentSubjectScreen({
    super.key,
    required this.studentId,
    required this.studentName,
    required this.className,
  });

  @override
  State<StudentSubjectScreen> createState() => _StudentSubjectScreenState();
}

class _StudentSubjectScreenState extends State<StudentSubjectScreen> {
  late Future<List<Subject>> _subjects;

  @override
  void initState() {
    super.initState();
    _loadSubjects();
  }

  void _loadSubjects() {
    _subjects = StudentService.getSubjectsByStudent(widget.studentId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: Text(widget.studentName),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Thông tin sinh viên
          Card(
            margin: const EdgeInsets.all(16).copyWith(bottom: 8),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Thông tin sinh viên',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text('Họ tên: ${widget.studentName}'),
                  Text('MSSV: ${widget.studentId}'),
                  Text('Lớp: ${widget.className}'),
                ],
              ),
            ),
          ),
          
          // Danh sách môn học
          Expanded(
            child: FutureBuilder<List<Subject>>(
              future: _subjects,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text("Lỗi: ${snapshot.error}"));
                }

                final subjects = snapshot.data ?? [];

                if (subjects.isEmpty) {
                  return const Center(child: Text("Chưa có môn học nào"));
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    setState(() {
                      _loadSubjects();
                    });
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: subjects.length,
                    itemBuilder: (context, index) {
                      final subject = subjects[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          title: Text(subject.subjectName),
                          subtitle: Text('Mã: ${subject.subjectId} - ${subject.credits} tín chỉ'),
                          leading: CircleAvatar(
                            backgroundColor: Colors.green.shade100,
                            child: Icon(Icons.book, color: Colors.green.shade800),
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ScoreListScreen(
                                  studentId: widget.studentId,
                                  studentName: widget.studentName,
                                  className: widget.className,
                                  subjectId: subject.subjectId,
                                  subjectName: subject.subjectName,
                                ),
                              ),
                            );
                            // Navigate to score form or subject details
                          },
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}