import 'package:flutter/material.dart';
import 'package:frontend/screens/admin/student/student_form.dart';
import 'package:frontend/screens/admin/student/student_import_screen.dart';
import '../../../models/student.dart';
import '../../../services/student_service.dart';
import 'student_detail.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class StudentListPage extends StatefulWidget {
  const StudentListPage({super.key});

  @override
  State<StudentListPage> createState() => _StudentListPageState();
}

class _StudentListPageState extends State<StudentListPage> {
  List<Student> students = [];
  List<Student> filteredStudents = [];
  Set<String> selectedStudentIds = {};
  String searchQuery = '';
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    fetchStudents();
  }

  // ✅ Lấy danh sách sinh viên từ API
  Future<void> fetchStudents() async {
    setState(() => _isLoading = true);
    const String apiUrl = 'http://localhost:3000/students';

    try {
      final response = await http.get(Uri.parse(apiUrl));
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        if (mounted) {
          setState(() {
            students = data.map((e) => Student.fromJson(e)).toList();
            filteredStudents = students;
            selectedStudentIds.clear();
          });
        }
      } else {
        _showMessage('Lỗi server: ${response.statusCode}');
      }
    } catch (e) {
      _showMessage('Lỗi kết nối API: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showMessage(String text) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
  }

  // ✅ Xóa sinh viên riêng lẻ
  Future<void> _deleteStudent(Student s) async {
    try {
      await StudentService.deleteStudent(s.id);
      await fetchStudents();
      _showMessage('Đã xóa sinh viên thành công');
    } catch (e) {
      _showMessage('Xóa sinh viên thất bại: $e');
    }
  }

  // ✅ Xóa toàn bộ sinh viên
  Future<void> _deleteAllStudents() async {
    final confirm = await _confirmDialog(
      'Xóa tất cả sinh viên',
      'Bạn có chắc muốn xóa toàn bộ danh sách sinh viên không?',
    );
    if (confirm == true) {
      for (var s in students) {
        await StudentService.deleteStudent(s.id);
      }
      await fetchStudents();
      _showMessage('Đã xóa tất cả sinh viên');
    }
  }

  // ✅ Xóa các sinh viên đã chọn
  Future<void> _deleteSelectedStudents() async {
    if (selectedStudentIds.isEmpty) return;
    final confirm = await _confirmDialog(
      'Xóa sinh viên đã chọn',
      'Bạn có chắc muốn xóa ${selectedStudentIds.length} sinh viên đã chọn không?',
    );
    if (confirm == true) {
      for (var id in selectedStudentIds) {
        await StudentService.deleteStudent(id);
      }
      await fetchStudents();
      _showMessage('Đã xóa các sinh viên đã chọn');
    }
  }

  Future<bool?> _confirmDialog(String title, String content) {
    return showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(content),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Hủy')),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Xóa', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  // ---------------- UI ----------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Danh sách sinh viên'),
        actions: [
          IconButton(
            icon: const Icon(Icons.upload_file),
            tooltip: 'Import từ Excel',
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const StudentImportScreen()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Làm mới danh sách',
            onPressed: fetchStudents,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : students.isEmpty
              ? _buildEmptyState()
              : Column(
                  children: [
                    _buildSearchHeader(),
                    _buildDeleteActions(), // ✅ Thêm phần này ngay dưới tìm kiếm
                    Expanded(
                      child: RefreshIndicator(
                        onRefresh: fetchStudents,
                        child: ListView.separated(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          itemCount: filteredStudents.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 8),
                          itemBuilder: (context, index) {
                            final s = filteredStudents[index];
                            final isSelected = selectedStudentIds.contains(s.id);
                            return Card(
                              elevation: 2,
                              child: ListTile(
                                leading: Checkbox(
                                  value: isSelected,
                                  onChanged: (checked) {
                                    setState(() {
                                      checked == true
                                          ? selectedStudentIds.add(s.id)
                                          : selectedStudentIds.remove(s.id);
                                    });
                                  },
                                ),
                                title: Text(s.studentName, style: const TextStyle(fontWeight: FontWeight.w600)),
                                subtitle: Text(
                                  'Mã SV: ${s.studentId}\nLớp: ${s.className}\n${s.email}',
                                  maxLines: 3,
                                ),
                                isThreeLine: true,
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit, color: Colors.blue),
                                      onPressed: () async {
                                        final result = await Navigator.push<bool?>(
                                          context,
                                          MaterialPageRoute(builder: (_) => StudentFormPage(student: s)),
                                        );
                                        if (result == true) await fetchStudents();
                                      },
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.delete, color: Colors.red),
                                      onPressed: () async {
                                        final confirm = await _confirmDialog(
                                          'Xác nhận xóa',
                                          'Bạn có chắc muốn xóa sinh viên "${s.studentName}" không?',
                                        );
                                        if (confirm == true) await _deleteStudent(s);
                                      },
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (_) => StudentDetailPage(student: s)),
                                  );
                                },
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                  ],
                ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add),
        onPressed: () async {
          final result = await Navigator.push<bool?>(
            context,
            MaterialPageRoute(builder: (_) => const StudentFormPage()),
          );
          if (result == true) await fetchStudents();
        },
      ),
    );
  }

  // ✅ Header tìm kiếm
  Widget _buildSearchHeader() {
    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Tổng số sinh viên: ${filteredStudents.length}',
            style: TextStyle(fontWeight: FontWeight.w600, color: Colors.grey[700]),
          ),
          const SizedBox(height: 12),
          TextField(
            decoration: InputDecoration(
              prefixIcon: const Icon(Icons.search, color: Colors.blue),
              hintText: 'Tìm sinh viên theo tên hoặc mã sinh viên...',
              filled: true,
              fillColor: Colors.grey[100],
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
            onChanged: (value) {
              setState(() {
                searchQuery = value.trim().toLowerCase();
                filteredStudents = students.where((s) {
                  final name = s.studentName.toLowerCase();
                  final id = s.studentId.toLowerCase();
                  return name.contains(searchQuery) || id.contains(searchQuery);
                }).toList();
              });
            },
          ),
        ],
      ),
    );
  }

  // ✅ Thanh hành động nhóm nằm ngay dưới ô tìm kiếm
  Widget _buildDeleteActions() {
    if (filteredStudents.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: Row(
        children: [
          Expanded(
            child: Text(
              '${selectedStudentIds.length} sinh viên đã chọn',
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          ElevatedButton.icon(
            icon: const Icon(Icons.delete),
            label: const Text('Xóa đã chọn'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            onPressed: selectedStudentIds.isEmpty ? null : _deleteSelectedStudents,
          ),
          const SizedBox(width: 8),
          ElevatedButton.icon(
            icon: const Icon(Icons.delete_forever),
            label: const Text('Xóa tất cả'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.black87, foregroundColor: Colors.white),
            onPressed: students.isEmpty ? null : _deleteAllStudents,
          ),
        ],
      ),
    );
  }

  // ✅ Giao diện rỗng
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Icon(Icons.school_outlined, size: 80, color: Colors.grey),
          SizedBox(height: 16),
          Text('Chưa có dữ liệu sinh viên', style: TextStyle(fontSize: 18, color: Colors.grey)),
          SizedBox(height: 8),
          Text('Hãy thêm sinh viên mới hoặc import từ Excel', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}
