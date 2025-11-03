import '../models/score.dart';
import 'api_service.dart';

class ScoreService{
  static const String _endpoint = "/scores";


// Tạo điểm mới
  static Future<Score> createScore(Map<String, dynamic> scoreData) async{
    final data = await ApiService.post(_endpoint, scoreData);
    return Score.fromJson(data);
  }


// Lấy tất cả điểm với các tham số tùy chọn để lọc
  static Future<List<Score>> getAllScores( {
    String? studentId,
    String? subjectId,
    String? semester,
    String? academicYear,
  }) async{
    String query = '';
    List<String> params = [];

    if(studentId != null) params.add('studentId=$studentId');
    if(subjectId != null) params.add('subjectId=$subjectId');
    if(semester != null) params.add('semester=$semester');
    if(academicYear != null) params.add('academicYear=$academicYear');

    if(params.isNotEmpty) query = '?${params.join('&')}';

    final data = await ApiService.get('$_endpoint$query');
    return (data as List).map((item) => Score.fromJson(item)).toList();
  }

  static Future<Score> getScoreById(String id) async {
    final data = await ApiService.get('$_endpoint/$id');
    return Score.fromJson(data);
  }

  // Lấy điểm theo sinh viên và môn học
  static Future<Score?> getByStudentAndSubject(String studentId, String subjectId) async {
    try {
      final scores = await getAllScores(studentId: studentId, subjectId: subjectId);
      return scores.isNotEmpty ? scores.first : null;
    } catch (e) {
      return null;
    }
  }

  // Lấy điểm theo sinh viên
  static Future<List<Score>> getScoresByStudent(String studentId) async {
    return getAllScores(studentId: studentId);
  }

  // Lấy điểm theo môn học
  static Future<List<Score>> getScoresBySubject(String subjectId) async {
    return getAllScores(subjectId: subjectId);
  }

  // Cập nhật điểm
  static Future<Score> updateScore(String id, Map<String, dynamic> updateData) async {
    final data = await ApiService.put('$_endpoint/$id', updateData);
    return Score.fromJson(data);
  }

  // Xóa điểm
  static Future<void> deleteScore(String id) async {
    await ApiService.delete('$_endpoint/$id');
  }
}