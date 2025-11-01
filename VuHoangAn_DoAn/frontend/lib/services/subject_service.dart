import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/subject.dart';
import 'api_service.dart';

class SubjectService{
  static const String _endpoint = "/subjects";

  static Future<List<Subject>> getSubjects() async{
    final data = await ApiService.get(_endpoint);
    return (data as List).map((item) => Subject.fromJson(item)).toList();
    // data as List: ép kiểu data thành List
    // .map((item) => Subject.fromJson(item)): chuyển từng item trong List thành Subject, deserlization 
    // .toList(): chuyển kết quả map thành List<Subject>
  }

  static Future<Subject> createSubject(Subject subject) async{
    print('Gửi dữ liệu tạo môn học: ${jsonEncode(subject.toJson())}'); // jsonEncode chuyển đối tượng thành chuỗi JSON, serialization

    final data = await ApiService.post(_endpoint, subject.toJson());// Gọi API POST với endpoint subject, dữ liệu subject chuyển thành JSON ( serialization)
    return Subject.fromJson(data); // Trả về đối tượng Subject từ dữ liệu JSON nhận được ( deserialization)
  }

  static Future <Subject> updateSubject(String id, Map<String,dynamic> updateData) async{
    final data = await ApiService.put("$_endpoint/$id", updateData);
    return Subject.fromJson(data);
  }

  static Future<void> deleteSubject(String id) async{
    await ApiService.delete("$_endpoint/$id");
  }
}