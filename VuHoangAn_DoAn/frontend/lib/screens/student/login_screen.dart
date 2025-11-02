import 'package:flutter/material.dart';
import 'package:frontend/screens/admin/admin_home_screen.dart';
import 'home_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/student_service.dart';
import '../auth/forgot_password_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key}); // Khởi tạo LoginScreen

  @override
  State<LoginScreen> createState() => _LoginScreenState(); // khởi tạo state cho widget
  

  
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(); // controller cho trường email
  final _passwordController = TextEditingController(); //controller cho trường mật khẩu
  bool _obscurePassword = true;
  String? errorMessage; //biến lưu trữ thông báo lỗi ( có thể null )
  bool _loading = false; //biến trạng thái đang tải, dấu _ để biến này là private

  Future<void> loginStudent()async{ // hàm đăng nhập sinh viên
    setState((){ // cập nhật trạng thái 
      _loading = true; // 
      errorMessage = null;
    });

    try{
      final email = _emailController.text.trim(); // lấy giá trị email từ controller và loại bỏ khoảng trắng
      final password = _passwordController.text.trim(); // lấy giá trị mật khẩu từ controller và loại bỏ khoảng trắng

      if(email.isEmpty || password.isEmpty){ // nếu tài khoản hoặc mật khẩu bỏ trống
        setState(() { // cập nhật trạng thái 
          errorMessage = 'Vui lòng nhập đầy đủ thông tin'; // xuất thông báo
        });
        return;
      }

      if(email == 'admin' && password == 'admin@123'){
        Navigator.pushReplacement( // chuyển trang và không thể quay lại 
          context, // ngữ cảnh hiện tại, context là tham số bắt buộc để điều hướng trong Flutter
          MaterialPageRoute(builder: (_) => const AdminHomeScreen() ), // tạo route đến trang AdminHomeScreen
        );
      }

      final student = await StudentService.loginStudent(email,password);

      if(student != null){
        // Save className to SharedPreferences so other screens can access it when
        // navigation doesn't include the value (e.g., via BottomNavBar).
        try {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('className', student.className);
          await prefs.setString('email', student.email);
          await prefs.setString('studentName', student.studentName);
          await prefs.setString('studentId', student.studentId);
        } catch (_) {}

        Navigator.pushReplacement( // chuyển trang và không thể quay lại
          context,
          MaterialPageRoute(
            builder: (_) => HomeScreen(className: student.className, student: student), // truyền className và student vào HomeScreen
          ),
        );

      } else {
        setState(() {
          errorMessage = 'Email hoặc mật khẩu không đúng';
        });
      }
    }catch(e){
      setState(() {
        errorMessage = 'Lỗi đăng nhập : $e';
      });
    }finally{
      setState(() {
        _loading = false;
      });
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF3EAEF4), // xanh nhạt
              Colors.white,
            ],
            stops: [0.3, 1.0],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 30),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.network(
                  'https://www.hutech.edu.vn/imgnews/homepage/stories/hinh34/logo%20CMYK-01.png',
                  height: 110,
                ),
                const SizedBox(height: 16),
                const Text(
                  "ĐĂNG NHẬP",
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 22,
                    fontWeight: FontWeight.w700, // đậm
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 30),

                // Email
                TextField(
                  controller: _emailController,
                  decoration: InputDecoration(
                    labelText: 'Email',
                    labelStyle: const TextStyle(
                        fontFamily: 'Poppins',
                        fontWeight: FontWeight.w600,
                        color: Colors.black87),
                    prefixIcon:
                        const Icon(Icons.person_outline, color: Colors.black54),
                    focusedBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2),
                    ),
                    enabledBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white54),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Password
                TextField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    labelText: 'Mật khẩu',
                    labelStyle: const TextStyle(
                        fontFamily: 'Poppins',
                        fontWeight: FontWeight.w600,
                        color: Colors.black87),
                    prefixIcon:
                        const Icon(Icons.lock_outline_rounded, color: Colors.black54),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword
                            ? Icons.visibility_off
                            : Icons.visibility,
                        color: Colors.black54,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                    focusedBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2),
                    ),
                    enabledBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white54),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Lỗi màu đỏ
                if (errorMessage != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Text(
                      errorMessage!,
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        color: Colors.red,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),

                const SizedBox(height: 20),

                ElevatedButton(
                  onPressed: loginStudent,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF3EAEF4),
                    minimumSize: const Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Đăng nhập',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                // Quên mật khẩu
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const ForgotPasswordScreen()),
                    );
                  },
                  child: const Text(
                    'Quên mật khẩu',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
