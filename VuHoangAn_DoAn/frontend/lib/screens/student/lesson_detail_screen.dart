// Tạo file: frontend/lib/screens/student/lesson_detail_screen.dart
import 'package:flutter/material.dart';
import '../../models/lesson.dart';
import '../../models/material.dart' as course_material;
import '../../services/lesson_service.dart';
import '../../services/material_service.dart';
import 'package:url_launcher/url_launcher.dart';

class LessonDetailScreen extends StatefulWidget {
  final String lessonId;

  const LessonDetailScreen({Key? key, required this.lessonId}) : super(key: key);

  @override
  _LessonDetailScreenState createState() => _LessonDetailScreenState();
}

class _LessonDetailScreenState extends State<LessonDetailScreen> {
  final LessonService _lessonService = LessonService();
  final MaterialService _materialService = MaterialService();
  late Future<Lesson> _lessonFuture;
  late Future<List<course_material.MaterialItem>> _materialsFuture;

  @override
  void initState() {
    super.initState();
    _lessonFuture = _lessonService.getLessonById(widget.lessonId);
    _materialsFuture = _materialService.getMaterialsByLesson(widget.lessonId);
  }

  Future<void> _openMaterial(String materialId, String fileName) async {
    try {
      final downloadUrl = await _materialService.downloadMaterial(materialId);
      final uri = Uri.parse(downloadUrl);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Không thể mở tài liệu: $fileName')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi tải tài liệu: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chi tiết bài học'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FutureBuilder<Lesson>(
              future: _lessonFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Lỗi: ${snapshot.error}'));
                } else if (!snapshot.hasData) {
                  return const Center(child: Text('Không tìm thấy bài học'));
                } else {
                  final lesson = snapshot.data!;
                  return Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Bài ${lesson.order}: ${lesson.title}',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        if (lesson.description != null)
                          Text(
                            lesson.description!,
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        const SizedBox(height: 16),
                        const Divider(),
                        const SizedBox(height: 16),
                        Text(
                          'Tài liệu học tập',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                      ],
                    ),
                  );
                }
              },
            ),
            FutureBuilder<List<course_material.MaterialItem>>(
              future: _materialsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Lỗi: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Center(child: Text('Không có tài liệu nào')),
                  );
                } else {
                  return ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: snapshot.data!.length,
                    itemBuilder: (context, index) {
                      final material = snapshot.data![index];
                      return Card(
                        margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
                        child: ListTile(
                          leading: const Icon(Icons.description),
                          title: Text(material.title),
                          subtitle: material.description != null ? Text(material.description!) : null,
                          trailing: const Icon(Icons.download),
                          onTap: () => _openMaterial(material.materialId, material.title),
                        ),
                      );
                    },
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}