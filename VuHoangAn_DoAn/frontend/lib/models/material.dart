// lib/models/material.dart
class MaterialItem {
  final String materialId;
  final String lessonId;
  final String title;
  final String description;
  final String type;      // backend có field type
  final String fileUrl;
  final String uploadBy;  // backend dùng uploadBy (string id)
  final DateTime uploadDate;

  MaterialItem({
    required this.materialId,
    required this.lessonId,
    required this.title,
    required this.description,
    required this.type,
    required this.fileUrl,
    required this.uploadBy,
    required this.uploadDate,
  });

  factory MaterialItem.fromJson(Map<String, dynamic> json) => MaterialItem(
    materialId: json['materialId'] ?? '',
    lessonId: json['lessonId'] ?? '',
    title: json['title'] ?? '',
    description: json['description'] ?? '',
    type: json['type'] ?? '',
    fileUrl: json['fileUrl'] ?? '',
    uploadBy: json['uploadBy']?.toString() ?? '',
    uploadDate: DateTime.tryParse(json['uploadDate'] ?? '') ?? DateTime.now(),
  );
}