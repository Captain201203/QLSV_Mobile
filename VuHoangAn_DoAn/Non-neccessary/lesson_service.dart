import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/lesson.dart';
import 'api_service.dart';

class LessonService{
  final String baseUrl = ApiService.baseUrl;

  Future<List<Lesson>> getAllLesson() async {
    final response = await http.get(Uri.parse('$baseUrl/lesson'));
    if(response.statusCode == 200){
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => Lesson.fromJson(json)).toList();
     }else{
      throw Exception('Failed to load lessons');
     }
  }

  Future<Lesson> getLessonById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/lesson/$id'));
    if(response.statusCode == 200){
      return Lesson.fromJson(json.decode(response.body));

    }else {
      throw Exception('Failed to load lesson');
    }
  }

  Future<List<dynamic>> getLessonsByCourse(String courseId) async {
    final response = await http.get(Uri.parse('$baseUrl/lesson/course/$courseId'));
    if(response.statusCode == 200){
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => Lesson.fromJson(json)).toList();;
    }else{
      throw Exception('Failed to load lessons in course');
    }
  }


}