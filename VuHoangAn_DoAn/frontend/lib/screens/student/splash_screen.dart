import 'package:flutter/material.dart';
import 'select_account_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    // Sau 2 giây tự động chuyển sang màn hình chọn tài khoản
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const SelectAccountScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    // Màn hình hiển thị logo HUTECH ở giữa
    return const Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Image(
          image: AssetImage('assets/logo_hutech.png'),
          width: 150, // Kích thước logo
        ),
      ),
    );
  }
}
