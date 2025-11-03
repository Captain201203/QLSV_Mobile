// Tạo file: frontend/lib/services/material_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/material.dart';
import 'api_service.dart';

class MaterialService {
  final String baseUrl = ApiService.baseUrl;

  // Lấy tài liệu theo bài học
  Future<List<MaterialItem>> getMaterialsByLesson(String lessonId) async {
    final response = await http.get(Uri.parse('$baseUrl/material/lesson/$lessonId'));
    
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => MaterialItem.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load materials');
    }
  }

  // Lấy tài liệu theo ID
  Future<MaterialItem> getMaterialById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/material/$id'));
    
    if (response.statusCode == 200) {
      return MaterialItem.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load material');
    }
  }

  // Tải tài liệu
  Future<String> downloadMaterial(String materialId) async {
    final response = await http.get(Uri.parse('$baseUrl/material/$materialId/download'));
    
    if (response.statusCode == 200) {
      return json.decode(response.body)['downloadUrl'];
    } else {
      throw Exception('Failed to download material');
    }
  }
}