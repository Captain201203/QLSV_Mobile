import '../models/student.dart';
import '../models/subject.dart';
import 'api_service.dart';

class StudentService {
  static const String _endpoint = "/students";


// Lấy danh sách sinh viên
  static Future <List<Student>> getStudents() async{
    final data = await ApiService.get(_endpoint);// final data nhận về từ API, final dùng để khai báo biến không thay đổi được
    return (data as List).map((item) => Student.fromJson(item)).toList(); 
    // data as List: ép kiểu data thành List
    // .map((item) => Student.fromJson(item)): chuyển từng item trong List thành Student
    // .toList(): chuyển kết quả map thành List<Student>
  }


// tạo sinh viên mới
  static Future<Student> createStudent(Student student) async{
    
    final data = await ApiService.post(_endpoint, student.toJson()); // Gọi API POST với dữ liệu JSON
    return Student.fromJson(data); // Trả về đối tượng Student từ dữ liệu JSON nhận được, chuyển đổi dữ liệu JSON thành đối tượng Student ( deserialization)
  }


// sửa thông tin sinh viên
  static Future<Student> updateStudent(String id, Map<String,dynamic> updateData) async{ //updateData là Map chứa các trường cần cập nhật
    final data = await ApiService.put("$_endpoint/$id", updateData);  
    return Student.fromJson(data); // 
    // $_endpoint/$id: endpoint với id sinh viên để cập nhật đúng đối tượng

  }


// Xóa sinh viên
  static Future<void> deleteStudent(String id) async{
    await ApiService.delete("$_endpoint/$id");// gọi API delete, endpoint trỏ về students với id tương ứng
  }

  //Sinh viên đăng nhập
  static Future<Student?> loginStudent(String email, String password) async {
    try {
      final data = await ApiService.post('/students/login', {
        'email': email,
        'password': password
      }); // Gọi API POST đăng nhập với email và password
      return Student.fromJson(data); // Trả về đối tượng Student nếu đăng nhập thành công
    } catch (e) {
      if (e.toString().contains('404')) {
        throw Exception('Tài khoản không tồn tại');
      } else if (e.toString().contains('401')) {
        throw Exception('Mật khẩu không đúng');
      } else if (e.toString().contains('403')) {
        throw Exception('Tài khoản không phải là sinh viên');
      }
      throw Exception('Lỗi đăng nhập: $e');
    }
  }

  static Future<List<Subject>> getSubjectsByStudent(String studentId) async {
  final data = await ApiService.get("$_endpoint/$studentId/subjects");

  // Kiểm tra kiểu dữ liệu thật sự của response
  if (data is List) {
    // Trả về danh sách Subject
    return data.map((item) => Subject.fromJson(item)).toList();
  } else if (data is Map<String, dynamic>) {
    // Nếu backend trả về 1 object duy nhất thay vì List
    return [Subject.fromJson(data)];
  } else {
    throw Exception("Dữ liệu trả về không đúng định dạng");
  }
}
}