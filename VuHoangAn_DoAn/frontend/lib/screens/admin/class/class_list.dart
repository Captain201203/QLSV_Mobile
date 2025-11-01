import 'package:flutter/material.dart';
import '../../../theme.dart';
import '../../../models/class.dart';
import '../../../services/class_service.dart';
import 'class_form.dart';
import '../student/student_by_class.dart';
import 'package:frontend/screens/admin/class/class_import_screen.dart';

class ClassListPage extends StatefulWidget {
  const ClassListPage({super.key});

  @override
  State<ClassListPage> createState() => _ClassListPageState();
}

class _ClassListPageState extends State<ClassListPage> {
  late Future<List<Class>> _classes;
  List<Class> _displayedClasses = [];
  List<String> _selectedClassIds = [];
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadClasses();
  }

  void _loadClasses() {
    _classes = ClassService.getClasses();
    _classes.then((list) {
      setState(() {
        _displayedClasses = list;
      });
    });
  }

  void _filterClasses(String query) {
    setState(() {
      _searchQuery = query.toLowerCase();
    });
  }

  Future<void> _deleteClass(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Xác nhận xóa'),
        content: const Text('Bạn có chắc muốn xóa lớp học này không?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Hủy')),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Xóa')),
        ],
      ),
    );

    if (confirm == true) {
      await ClassService.deleteClass(id);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Xóa lớp học thành công')),
      );
      _loadClasses();
    }
  }

  Future<void> _deleteSelectedClasses() async {
    if (_selectedClassIds.isEmpty) return;

    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Xác nhận xóa'),
        content: Text('Bạn có chắc muốn xóa ${_selectedClassIds.length} lớp đã chọn không?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Hủy')),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Xóa')),
        ],
      ),
    );

    if (confirm == true) {
      for (final id in _selectedClassIds) {
        await ClassService.deleteClass(id);
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Đã xóa ${_selectedClassIds.length} lớp')),
      );

      setState(() {
        _selectedClassIds.clear();
      });

      _loadClasses();
    }
  }

  Future<void> _deleteAllClasses() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Xác nhận xóa tất cả'),
        content: const Text('Bạn có chắc chắn muốn xóa TẤT CẢ lớp học không?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Hủy')),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Xóa tất cả')),
        ],
      ),
    );

    if (confirm == true) {
      for (final c in _displayedClasses) {
        await ClassService.deleteClass(c.id);
      }

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đã xóa tất cả lớp học')),
      );

      _loadClasses();
    }
  }

  Future<void> _navigateToForm({Class? classes}) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => ClassFormPage(classes: classes)),
    );

    if (result == true) {
      _loadClasses();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: const Text("Danh sách lớp học"),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.upload_file),
            tooltip: 'Nhập Excel',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ClassImportScreen()),
              ).then((_) {
                _loadClasses();
              });
            },
          ),
        ],
      ),
      body: FutureBuilder<List<Class>>(
        future: _classes,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Lỗi: ${snapshot.error}"));
          }

          final classes = snapshot.data ?? [];

          final filtered = classes
              .where((c) =>
                  c.className.toLowerCase().contains(_searchQuery) ||
                  c.classId.toLowerCase().contains(_searchQuery) ||
                  c.department.toLowerCase().contains(_searchQuery))
              .toList();

          return RefreshIndicator(
            onRefresh: () async => _loadClasses(),
            child: Column(
              children: [
                // 🔍 Ô tìm kiếm
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Tìm kiếm theo tên lớp, mã lớp hoặc ngành...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    onChanged: _filterClasses,
                  ),
                ),

                // 🔥 Thanh hành động xóa
                if (filtered.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    child: Row(
                      children: [
                        ElevatedButton.icon(
                          onPressed: _selectedClassIds.isNotEmpty ? _deleteSelectedClasses : null,
                          icon: const Icon(Icons.delete_outline),
                          label: const Text("Xóa lớp đã chọn"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.redAccent,
                            foregroundColor: Colors.white,
                          ),
                        ),
                        const SizedBox(width: 10),
                        ElevatedButton.icon(
                          onPressed: filtered.isNotEmpty ? _deleteAllClasses : null,
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

                // 📋 Danh sách lớp
                Expanded(
                  child: filtered.isEmpty
                      ? const Center(child: Text("Không tìm thấy lớp học nào"))
                      : ListView.builder(
                          padding: const EdgeInsets.all(12),
                          itemCount: filtered.length,
                          itemBuilder: (context, index) {
                            final c = filtered[index];
                            final isSelected = _selectedClassIds.contains(c.id);

                            return Card(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              elevation: 2,
                              child: ListTile(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => StudentByClassPage(classItem: c),
                                    ),
                                  );
                                },
                                leading: Checkbox(
                                  value: isSelected,
                                  onChanged: (val) {
                                    setState(() {
                                      if (val == true) {
                                        _selectedClassIds.add(c.id);
                                      } else {
                                        _selectedClassIds.remove(c.id);
                                      }
                                    });
                                  },
                                ),
                                title: Text("${c.className} (${c.classId})",
                                    style: const TextStyle(fontWeight: FontWeight.bold)),
                                subtitle: Text("Ngành: ${c.department}"),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit, color: Colors.blue),
                                      onPressed: () => _navigateToForm(classes: c),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.delete, color: Colors.red),
                                      onPressed: () => _deleteClass(c.id),
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
