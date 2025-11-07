import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_service.dart';

class AuthService {
  static const String _endpoint = "/auth";


  static Future<Map<String, dynamic>> requestPasswordReset(String email) async { // tạo hàm requestPasswordReset nhận email
    try {
      final response = await ApiService.post("$_endpoint/forgot-password", {"email": email}); // gọi API POST với email
      return response;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> verifyOTP(String sessionId, String otp) async { // tạo hàm verifyOTP nhận sessionId và otp
    try {
      await ApiService.post("$_endpoint/verify-otp", { // gọi API POST với sessionId và otp
        "sessionId": sessionId,
        "otp": otp,
      });
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> resetPassword(String sessionId, String newPassword) async {
    try {
      await ApiService.post("$_endpoint/reset-password", { // gọi API POST với sessionId và mật khẩu mới
        "sessionId": sessionId,
        "newPassword": newPassword,
      });
    } catch (e) {
      throw _handleError(e);
    }
  }


  static String _handleError(dynamic error) { // hàm xử lý lỗi
    if (error is http.Response) {
      try {
        final Map<String, dynamic> body = json.decode(error.body);
        return body['message'] ?? 'Unknown error occurred';
      } catch (_) {
        return error.body ?? 'Unknown error occurred';
      }
    }
    return error.toString();
  }
}