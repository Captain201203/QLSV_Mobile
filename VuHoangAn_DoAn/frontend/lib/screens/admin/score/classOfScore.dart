import 'package:flutter/material.dart';
import '../../../theme.dart';
import '../../../models/class.dart';
import '../../../services/class_service.dart';
import 'studentOfScore.dart';

class ScoreManagementScreen extends StatefulWidget {
  const ScoreManagementScreen({super.key});

  @override
  State<ScoreManagementScreen> createState() => _ScoreManagementScreenState();
}

class _ScoreManagementScreenState extends State<ScoreManagementScreen> {
  late Future<List<Class>> _classes;

  @override
  void initState() {
    super.initState();
    _loadClasses();
  }

  void _loadClasses() {
    _classes = ClassService.getClasses();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: const Text("Quản lý điểm"),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
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

          if (classes.isEmpty) {
            return const Center(child: Text("Chưa có lớp học nào."));
          }

          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                _loadClasses();
              });
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: classes.length,
              itemBuilder: (context, index) {
                final c = classes[index];
                return Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                  child: ListTile(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ClassScoreScreen(classItem: c),
                        ),
                      );
                    },
                    title: Text("${c.className} (${c.classId})",
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text("Ngành: ${c.department}"),
                    trailing: const Icon(Icons.arrow_forward_ios),
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
