import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/course.dart';
import 'api_service.dart';

class CourseService {
  final String baseUrl = ApiService.baseUrl;

  Future<List<Course>> getAllCourses() async{
    final response = await http.get(Uri.parse('$baseUrl/course'));

    if(response.statusCode == 200){
      final List<dynamic> data = json.decode(response.body);
      return data.map((json)=>Course.fromJson(json)).toList();

    }else{
      throw Exception('Failed to load course');
    }
  }

  Future <Course> getCourseById (String id) async {
    final response = await http.get(Uri.parse ('$baseUrl/course/$id'));
    if(response.statusCode == 200){
      return Course.fromJson(json.decode(response.body));
    }else{
      throw Exception('Failed to load course');
    }
  }

  Future<List<dynamic>> getStudentsInCourse(String courseId) async{
    final response = await http.get(Uri.parse('$baseUrl/course/$courseId/students'));
    if(response.statusCode == 200){
      return json.decode(response.body);
    }else{
      throw Exception('Failed to load students in course');
    }
  }
}

