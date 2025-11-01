import 'package:flutter/material.dart';
import '../../../theme.dart';
import '../../../models/student.dart';
import '../../../models/class.dart';
import '../../../services/student_service.dart';
import 'student_detail.dart';
import 'student_form.dart';

class StudentByClassPage extends StatefulWidget {
  final Class classItem;

  const StudentByClassPage({
    super.key,
    required this.classItem,
  });

  @override
  State<StudentByClassPage> createState() => _StudentByClassPageState();
}

class _StudentByClassPageState extends State<StudentByClassPage> {
  List<Student> students = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStudentsInClass();
  }

  Future<void> _loadStudentsInClass() async {
    try {
      setState(() => isLoading = true);
      
      // Lấy tất cả sinh viên và filter theo className
      final allStudents = await StudentService.getStudents();
      final filteredStudents = allStudents.where((student) {
        return student.className == widget.classItem.className;
      }).toList();
      
      setState(() {
        students = filteredStudents;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi khi tải sinh viên: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: Text('Sinh viên lớp ${widget.classItem.className}'),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : students.isEmpty
              ? const Center(
                  child: Text(
                    'Chưa có sinh viên nào trong lớp này',
                    style: TextStyle(fontSize: 16),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: students.length,
                  itemBuilder: (context, index) {
                    final student = students[index];
                    return Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 2,
                      child: ListTile(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => StudentDetailPage(
                                student: student,
                              ),
                            ),
                          );
                        },
                        title: Text(
                          student.studentName,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('MSSV: ${student.studentId}'),
                            Text('Lớp: ${student.className}'),
                            Text('Email: ${student.email}'),
                          ],
                        ),
                        leading: CircleAvatar(
                          backgroundColor: kPrimary,
                          child: Text(
                            student.studentName[0].toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        trailing: const Icon(Icons.arrow_forward_ios),
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          // Chuyển đến form thêm sinh viên với className đã được điền sẵn
          final result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => StudentFormPage(
                prefilledClassName: widget.classItem.className,
              ),
            ),
          );
          
          if (result == true) {
            _loadStudentsInClass(); // Refresh danh sách
          }
        },
        backgroundColor: kPrimary,
        icon: const Icon(Icons.person_add),
        label: const Text('Thêm sinh viên'),
      ),
    );
  }
}