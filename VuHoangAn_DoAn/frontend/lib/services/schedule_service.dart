import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_service.dart';
import '../models/schedule.dart';

class ScheduleService{
  static const String _endpoint = "/schedules";

  static Future<List<Schedule>> getByClass({
    required String className,
    required DateTime from,
    required DateTime to,
  }) async{
    final trimmed = className.trim();
    if (trimmed.isEmpty) {
      throw Exception('Missing className when requesting schedules');
    }

    final encodedClass = Uri.encodeComponent(trimmed);
    final fromStr = from.toIso8601String().substring(0,10);
    final toStr = to.toIso8601String().substring(0,10);
    final url = Uri.parse(
      '${ApiService.baseUrl}$_endpoint/class/$encodedClass?from=$fromStr&to=$toStr'
    );

    final res = await http.get(url, headers: ApiService.headers);
    if(res.statusCode >= 200 && res.statusCode < 300){
      // Debug: log received data size to help diagnose empty results
      final List data = json.decode(res.body);
      try {
        // ignore: avoid_print
        print('[ScheduleService] fetched ${data.length} items for class=$trimmed from=$fromStr to=$toStr');
      } catch (_) {}
      return data.map((e)=>Schedule.fromJson(e)).toList();

    }
    throw Exception('Không thể tải thời khóa biểu: ${res.statusCode}');
  }

  static Future<Schedule> create (Map<String, dynamic> payload)async{
    final url = Uri.parse('${ApiService.baseUrl}$_endpoint');
    final res = await http.post(
      url, 
      headers: ApiService.headers,
      body: json.encode(payload));
      if(res.statusCode ==201){
        return Schedule.fromJson(json.decode(res.body));
      }
      throw Exception('Không thể tạo thời khóa biểu: ${res.body}');
  }

  static Future <Schedule> update (String id, Map<String, dynamic>payload)async{
    final url = Uri.parse('${ApiService.baseUrl}$_endpoint/$id');
    final res = await http.put(
      url,
      headers: ApiService.headers,
      body: json.encode(payload));
    if(res.statusCode ==200){
      return Schedule.fromJson(json.decode(res.body));
    }
    throw Exception('Không thể cập nhật thời khóa biểu: ${res.body}');
  }

  static Future<void> delete (String id)async{
    final url = Uri.parse('${ApiService.baseUrl}$_endpoint/$id');
    final res = await http.delete(url, headers: ApiService.headers);
    if(res.statusCode !=200){
      throw Exception('Không thể xóa thời khóa biểu: ${res.body}');
    }
  }
}