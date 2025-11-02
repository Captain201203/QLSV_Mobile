import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_service.dart';

class AuthService {
  static const String _endpoint = "/auth";

  // Existing methods ...

  static Future<Map<String, dynamic>> requestPasswordReset(String email) async {
    try {
      final response = await ApiService.post("$_endpoint/forgot-password", {"email": email});
      return response;
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> verifyOTP(String sessionId, String otp) async {
    try {
      await ApiService.post("$_endpoint/verify-otp", {
        "sessionId": sessionId,
        "otp": otp,
      });
    } catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> resetPassword(String sessionId, String newPassword) async {
    try {
      await ApiService.post("$_endpoint/reset-password", {
        "sessionId": sessionId,
        "newPassword": newPassword,
      });
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Helper to handle error responses
  static String _handleError(dynamic error) {
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