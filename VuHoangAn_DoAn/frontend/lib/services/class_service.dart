import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/class.dart';
import '../models/student.dart';
import 'api_service.dart';
class ClassService{
  static const String _endpoint = "/classes";

  static Future<List<Class>> getClasses() async{
    final data = await ApiService.get(_endpoint);
    return (data as List).map((item) => Class.fromJson(item)).toList(); // data as List: ép kiểu data thành List<Class>, .map((item) => Class.fromJson(item)): chuyển từng item trong List thành Class, deserialization  .toList(): chuyển kết quả map thành List<Class>
  }

  static Future<List<Student>> getStudentsInClass(String classId) async { // getStudentsInClass: lấy danh sách sinh viên trong lớp
    final data = await ApiService.get("$_endpoint/$classId/students");
    // Backend trả về object có field 'students' chứa array
    final studentsData = data['students'] as List;
    return studentsData.map((item) => Student.fromJson(item)).toList();
  }

  static Future<Class> createClass(Class classes) async{
    final data = await ApiService.post(_endpoint, classes.toJson());
    return Class.fromJson(data);
  }
  
  static Future<Class> updateClass(String id, Map<String, dynamic> updateData) async{
    final data = await ApiService.put("$_endpoint/$id", updateData);
    return Class.fromJson(data);
  }

  static Future<void> deleteClass(String id) async{
    await ApiService.delete("$_endpoint/$id");
  }
}