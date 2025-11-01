import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../models/account.dart';
import 'api_service.dart';

class AccountService {
  // 📍 URL chính của API (sửa lại nếu backend bạn chạy ở cổng khác)
  static const String baseUrl = '${ApiService.baseUrl}/accounts';

  // ----------------- Lấy tất cả tài khoản -----------------
  static Future<List<Account>> getAllAccounts() async {
    try {
      final response = await http.get(Uri.parse(baseUrl));
      if (response.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(response.body);
        return jsonData.map((e) => Account.fromJson(e)).toList();
      } else {
        throw Exception('Không thể tải danh sách tài khoản');
      }
    } catch (e) {
      throw Exception('Lỗi khi tải tài khoản: $e');
    }
  }

  // ----------------- Thêm tài khoản -----------------
  static Future<Account> addAccount(Account account) async {
    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(account.toJson()),
      );
      if (response.statusCode == 201) {
        return Account.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Không thể thêm tài khoản');
      }
    } catch (e) {
      throw Exception('Lỗi khi thêm tài khoản: $e');
    }
  }

  // ----------------- Cập nhật tài khoản -----------------
  static Future<Account> updateAccount(Account account) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/${account.id}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(account.toJson()),
      );
      if (response.statusCode == 200) {
        return Account.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Không thể cập nhật tài khoản');
      }
    } catch (e) {
      throw Exception('Lỗi khi cập nhật tài khoản: $e');
    }
  }

  // ----------------- Xóa tài khoản -----------------
  static Future<void> deleteAccount(String id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/$id'));
      if (response.statusCode != 200) {
        throw Exception('Không thể xóa tài khoản');
      }
    } catch (e) {
      throw Exception('Lỗi khi xóa tài khoản: $e');
    }
  }

  // ----------------- Tạo tài khoản từ danh sách sinh viên -----------------
  static Future<List<Account>> generateFromStudents() async {
    try {
      final response = await http.post(Uri.parse('$baseUrl/generate-from-students'));
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = jsonDecode(response.body);
        final List<dynamic> accountsData = responseData['details'];
        return accountsData.map((e) => Account.fromJson(e)).toList();
      } else {
        throw Exception('Không thể tạo tài khoản từ danh sách sinh viên');
      }
    } catch (e) {
      throw Exception('Lỗi khi tạo tài khoản sinh viên: $e');
    }
  }

  // ----------------- Tạo tài khoản sinh viên hàng loạt (alias method) -----------------
  static Future<List<Account>> generateStudentAccount() async {
    return await generateFromStudents();
  }
}
