import 'package:flutter/material.dart';
import '../../../services/auth_service.dart';
import '../../../theme.dart';
import 'reset_password_screen.dart';

class OTPVerificationScreen extends StatefulWidget {
  final String email;
  final String sessionId;

  const OTPVerificationScreen({
    super.key,
    required this.email, // email để hiển thị thông báo đã gửi mã đến đâu
    required this.sessionId, // sessionId để xác thực OTP, sessionId để truyền vào hàm verifyOTP
  });

  @override
  State<OTPVerificationScreen> createState() => _OTPVerificationScreenState();
}

class _OTPVerificationScreenState extends State<OTPVerificationScreen> {
  final _formKey = GlobalKey<FormState>();
  final List<TextEditingController> _otpControllers = List.generate( // tạo 6 controller cho 6 ô nhập mã OTP
    6,
    (index) => TextEditingController(),
  );
  final List<FocusNode> _focusNodes = List.generate( // tạo 6 focus node để quản lý việc chuyển focus giữa các ô nhập mã OTP
    6,
    (index) => FocusNode(),
  );
  bool _isLoading = false;

  @override
  void dispose() { // giải phóng bộ nhớ cho các controller và focus node khi widget bị hủy
    for (var controller in _otpControllers) {
      controller.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  void _onOtpChanged(String value, int index) { // xử lý khi người dùng nhập mã OTP
    if (value.isNotEmpty) { // nếu có giá trị nhập vào thì chuyển focus đến ô tiếp theo
      
      if (index < 5) { // nếu chưa phải ô cuối cùng thì chuyển focus
        _focusNodes[index + 1].requestFocus();
      }
    }
  }

  String _getFullOtp() { // lấy toàn bộ mã OTP từ các controller
    return _otpControllers.map((c) => c.text).join();// nối các chuỗi văn bản từ từng controller lại với nhau
  }

  Future<void> _verifyOTP() async { // hàm xác thực OTP
    if (!_formKey.currentState!.validate()) return; // nếu form không hợp lệ thì dừng lại

    setState(() => _isLoading = true);

    try {
      await AuthService.verifyOTP(widget.sessionId, _getFullOtp()); // gọi hàm verifyOTP từ AuthService với sessionId và mã OTP lấy từ các controller
      
      if (!mounted) return; // nếu mounted là false, tức là widget không còn gắn vào cây widget nữa, thì dừng lại
      
      // Navigate to password reset screen
      Navigator.pushReplacement( // chuyển sang trang đổi mật khẩu
        context,
        MaterialPageRoute(
          builder: (context) => ResetPasswordScreen(
            sessionId: widget.sessionId,
          ),
        ),
      );

    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _resendOTP() async {
    try {
      await AuthService.requestPasswordReset(widget.email);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Đã gửi lại mã OTP'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: const Text('Xác thực OTP'),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const SizedBox(height: 20),
              Text(
                'Nhập mã xác thực đã được gửi đến\n${widget.email}',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 40),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(
                  6,
                  (index) => SizedBox(
                    width: 50,
                    child: TextFormField(
                      controller: _otpControllers[index],
                      focusNode: _focusNodes[index],
                      keyboardType: TextInputType.number,
                      maxLength: 1,
                      textAlign: TextAlign.center,
                      decoration: InputDecoration(
                        counterText: '',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        contentPadding: EdgeInsets.zero,
                      ),
                      onChanged: (value) => _onOtpChanged(value, index),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return '';
                        }
                        return null;
                      },
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: _isLoading ? null : _verifyOTP,
                style: ElevatedButton.styleFrom(
                  backgroundColor: kPrimary,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text('Xác thực'),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: _resendOTP,
                child: const Text('Gửi lại mã'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}