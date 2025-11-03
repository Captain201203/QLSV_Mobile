import 'package:flutter/material.dart';
import '../../../services/auth_service.dart';
import '../../../theme.dart';
import 'otp_verification_screen.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController(); // tạo controller cho email nhập vào
  bool _isLoading = false;

  Future<void> _requestPasswordReset() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final response = await AuthService.requestPasswordReset(_emailController.text.trim()); // gọi hàm requestPasswordReset từ AuthService với email lấy từ controller 
      
      if (!mounted) return; // mounted là một thuộc tính của State trong Flutter, nó cho biết liệu State hiện tại có được gắn vào cây widget hay không. Nếu không mounted, tức là widget đã bị hủy và không nên thực hiện các thao tác liên quan đến giao diện người dùng.
      
      // Navigate to OTP screen with session ID
      Navigator.push( // chuyển sang màn hình xác thực otp
        context,
        MaterialPageRoute(
          builder: (context) => OTPVerificationScreen( // tạo route đến OTPVerificationScreen
            email: _emailController.text.trim(),
            sessionId: response['sessionId'], 
          ),
        ),
      );

    } catch (e) {
      if (!mounted) return; // nếu widget không còn gắn vào cây widget thì dừng lại
      ScaffoldMessenger.of(context).showSnackBar( // hiển thị thông báo lỗi
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: const Text('Quên mật khẩu'),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Nhập email của bạn để nhận mã xác thực',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Email',
                  prefixIcon: const Icon(Icons.email),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Vui lòng nhập email';
                  }
                  if (!value.contains('@') || !value.contains('.')) {
                    return 'Email không hợp lệ';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _requestPasswordReset, // gọi hàm requestPasswordReset khi nhấn nút
                style: ElevatedButton.styleFrom(
                  backgroundColor: kPrimary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
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
                    : const Text('Gửi mã xác thực'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}