import 'package:flutter/material.dart';
import '../../../theme.dart';
import '../../../models/subject.dart';
import '../../../services/subject_service.dart';
import 'subject_form.dart';
import 'subject_import_screen.dart'; // Cần tạo file này

class SubjectListPage extends StatefulWidget {
  const SubjectListPage({super.key});

  @override
  State<SubjectListPage> createState() => _SubjectListPageState();
}

class _SubjectListPageState extends State<SubjectListPage> {
  late Future<List<Subject>> _subjects;
  List<Subject> _displayedSubjects = [];
  List<String> _selectedSubjectIds = [];
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadSubjects();
  }

  void _loadSubjects() {
    _subjects = SubjectService.getSubjects();
    _subjects.then((list) {
      setState(() {
        _displayedSubjects = list;
      });
    });
  }

  void _filterSubjects(String query) {
    setState(() {
      _searchQuery = query.toLowerCase();
    });
  }

  Future<void> _deleteSubject(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Xác nhận xóa'),
        content: const Text('Bạn có chắc muốn xóa môn học này không?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Hủy')),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Xóa')),
        ],
      ),
    );

    if (confirm == true) {
      await SubjectService.deleteSubject(id);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Xóa môn học thành công')),
      );
      _loadSubjects();
    }
  }

  Future<void> _deleteSelectedSubjects() async {
    if (_selectedSubjectIds.isEmpty) return;

    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Xác nhận xóa'),
        content: Text('Bạn có chắc muốn xóa ${_selectedSubjectIds.length} môn học đã chọn không?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Hủy')),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Xóa')),
        ],
      ),
    );

    if (confirm == true) {
      for (final id in _selectedSubjectIds) {
        await SubjectService.deleteSubject(id);
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Đã xóa ${_selectedSubjectIds.length} môn học')),
      );

      setState(() {
        _selectedSubjectIds.clear();
      });

      _loadSubjects();
    }
  }

  Future<void> _deleteAllSubjects() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Xác nhận xóa tất cả'),
        content: const Text('Bạn có chắc chắn muốn xóa TẤT CẢ môn học không?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Hủy')),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Xóa tất cả')),
        ],
      ),
    );

    if (confirm == true) {
      for (final subject in _displayedSubjects) {
        await SubjectService.deleteSubject(subject.id);
      }

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đã xóa tất cả môn học')),
      );

      _loadSubjects();
    }
  }

  Future<void> _addNewSubject(Subject subject) async {
    try {
      final newSubject = await SubjectService.createSubject(subject);
      setState(() => _displayedSubjects.add(newSubject));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Thêm môn học thành công!'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Lỗi khi thêm môn học: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _updateSubject(String id, Subject subject) async {
    try {
      final updated = await SubjectService.updateSubject(id, subject.toJson());
      final index = _displayedSubjects.indexWhere((s) => s.id == id);
      if (index != -1) {
        setState(() => _displayedSubjects[index] = updated);
      }
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Cập nhật môn học thành công!'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Lỗi khi cập nhật môn học: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _navigateToForm({Subject? subject}) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => SubjectForm(subject: subject)),
    );

    if (result == true || result is Subject) {
      _loadSubjects();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: const Text("Danh sách môn học"),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.upload_file),
            tooltip: 'Nhập Excel',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SubjectImportScreen()),
              ).then((_) {
                _loadSubjects();
              });
            },
          ),
        ],
      ),
      body: FutureBuilder<List<Subject>>(
        future: _subjects,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Lỗi: ${snapshot.error}"));
          }

          final subjects = snapshot.data ?? [];

          final filtered = subjects
              .where((s) =>
                  s.subjectName.toLowerCase().contains(_searchQuery) ||
                  s.subjectId.toLowerCase().contains(_searchQuery) ||
                  s.department.toLowerCase().contains(_searchQuery))
              .toList();

          return RefreshIndicator(
            onRefresh: () async => _loadSubjects(),
            child: Column(
              children: [
                // 🔍 Ô tìm kiếm
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Tìm kiếm theo tên môn học, mã môn hoặc khoa...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    onChanged: _filterSubjects,
                  ),
                ),

                // 🔥 Thanh hành động xóa
                if (filtered.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    child: Row(
                      children: [
                        ElevatedButton.icon(
                          onPressed: _selectedSubjectIds.isNotEmpty ? _deleteSelectedSubjects : null,
                          icon: const Icon(Icons.delete_outline),
                          label: const Text("Xóa môn đã chọn"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.redAccent,
                            foregroundColor: Colors.white,
                          ),
                        ),
                        const SizedBox(width: 10),
                        ElevatedButton.icon(
                          onPressed: filtered.isNotEmpty ? _deleteAllSubjects : null,
                          icon: const Icon(Icons.delete_forever),
                          label: const Text("Xóa tất cả"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),

                // 📋 Danh sách môn học
                Expanded(
                  child: filtered.isEmpty
                      ? const Center(child: Text("Không tìm thấy môn học nào"))
                      : ListView.builder(
                          padding: const EdgeInsets.all(12),
                          itemCount: filtered.length,
                          itemBuilder: (context, index) {
                            final subject = filtered[index];
                            final isSelected = _selectedSubjectIds.contains(subject.id);

                            return Card(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              elevation: 2,
                              child: ListTile(
                                leading: Checkbox(
                                  value: isSelected,
                                  onChanged: (val) {
                                    setState(() {
                                      if (val == true) {
                                        _selectedSubjectIds.add(subject.id);
                                      } else {
                                        _selectedSubjectIds.remove(subject.id);
                                      }
                                    });
                                  },
                                ),
                                title: Text("${subject.subjectName} (${subject.subjectId})",
                                    style: const TextStyle(fontWeight: FontWeight.bold)),
                                subtitle: Text("Khoa: ${subject.department} - ${subject.credits} tín chỉ"),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit, color: Colors.blue),
                                      onPressed: () => _navigateToForm(subject: subject),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.delete, color: Colors.red),
                                      onPressed: () => _deleteSubject(subject.id),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _navigateToForm(),
        backgroundColor: kPrimary,
        child: const Icon(Icons.add),
      ),
    );
  }
}