import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:3000';

  static Map<String, String> get headers => {
        'Content-Type': 'application/json', // định dạng dữ liệu gửi đi là json
        'Accept': 'application/json', // định dạng dữ liệu nhận về là json
  };

  // hàm get
  static Future<dynamic> get(String endpoint) async{
    final url = Uri.parse('$baseUrl$endpoint'); // tạo Url, Uri.parse là phương thức phân tích chuỗi thành đối tượng Uri, nối endpoint vào baseUrl, endpoint được khai báo trong service cụ thể
    final response = await http.get(url); // khai báo response, chờ kết quả từ http.get với url đã tạo
    return _handleResponse(response); // trả về kết quả xử lý response bằng hàm _handleResponse
  } 

  static Future<dynamic> post(String endpoint, Map<String,dynamic> data) async{// future để chờ kết quả bất đồng bộ, dynamic vì không biết trước kiểu dữ liệu trả về, kết hợp với map vì dữ liệu gửi đi là một Map
    final url = Uri.parse('$baseUrl$endpoint'); // tạo Url, nối endpoint vào baseUrl, endpoint được khai báo trong service cụ thể
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'}, // định dạng dữ liệu gửi đi là json
      body: jsonEncode(data), //chuyển Map thành JSON string trước khi gửi, serialization

    );
    return _handleResponse( response);

  }

  static Future<dynamic> put(String endpoint, Map<String, dynamic> data) async{ // future dynamic vì không biết trước kiểu dữ liệu trả về
    final url = Uri.parse('$baseUrl$endpoint');
    final response = await http.put(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    return _handleResponse(response);
  }

  static Future<dynamic> delete(String endpoint)async{ // generics dynamic vì không biết trước kiểu dữ liệu trả về
    final url = Uri.parse('$baseUrl$endpoint');
    final response = await http.delete(url);
    return _handleResponse(response);
  }


  //--------------------------------------------------------------
  


  static dynamic _handleResponse(http.Response response){ // hàm xử lý response từ server
    if (response.statusCode >= 200 && response.statusCode < 300) { // nếu mã trạng thái từ 200 đến 299 (thành công)
      return json.decode(response.body);// giải mã chuỗi JSON trong body thành đối tượng Dart và trả về
    } else {
      throw Exception('Failed to load data: ${response.statusCode}'); // ném ngoại lệ với mã trạng thái lỗi
    }

  
  }
}