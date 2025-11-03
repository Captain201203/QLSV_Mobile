import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:path_provider/path_provider.dart';
import '../../models/student.dart';

class EditProfileScreen extends StatefulWidget {
  final Student? student;
  const EditProfileScreen({super.key, this.student});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> { // tạo trạng thái ban đầu cho EditProfileScreen
  String _studentName = 'Người dùng';
  String _studentId = '';
  String _email = '';
 
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  File? _avatarImage;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  // 🔹 Load dữ liệu đã lưu
  Future<void> _loadUserData() async { // hàm tải dữ liệu người dùng đã lưu, với email, studentName, studentId từ studenlModel
    final prefs = await SharedPreferences.getInstance(); // SharedPreferences dùng để lưu trữ dữ liệu cục bộ
    final avatarPath = prefs.getString('avatar_path');
    final savedEmail = prefs.getString('email');
    final savedName = prefs.getString('studentName');
    final savedId = prefs.getString('studentId');
    final savedPassword = prefs.getString('password');

    if (!mounted) return;

    setState(() {
      if (avatarPath != null && File(avatarPath).existsSync()) {
        _avatarImage = File(avatarPath);
      }
      _email = savedEmail?.isNotEmpty == true ? savedEmail! : widget.student?.email ?? _email;
      _studentName = savedName?.isNotEmpty == true ? savedName! : widget.student?.studentName ?? _studentName;
      _studentId = savedId?.isNotEmpty == true ? savedId! : widget.student?.studentId ?? _studentId;
      
      emailController.text = _email;
      if (savedPassword != null) passwordController.text = savedPassword;
    });
  }

  // 🔹 Chọn ảnh và lưu đường dẫn
  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      final directory = await getApplicationDocumentsDirectory();
      final newPath =
          '${directory.path}/${DateTime.now().millisecondsSinceEpoch}.png';
      final newImage = await File(pickedFile.path).copy(newPath);

      setState(() {
        _avatarImage = newImage;
      });

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('avatar_path', newImage.path);
    }
  }

  // 🔹 Lưu thông tin vào SharedPreferences
  Future<void> _saveChanges() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Lưu thông tin cơ bản
      await prefs.setString('email', emailController.text);
      await prefs.setString('password', passwordController.text);
      await prefs.setString('studentName', _studentName);
      await prefs.setString('studentId', _studentId);
      
      // Lưu avatar nếu có
      if (_avatarImage != null) {
        await prefs.setString('avatar_path', _avatarImage!.path);
      }

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Cập nhật thông tin thành công!")),
      );
    } catch (e) {
      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Có lỗi xảy ra khi lưu thông tin!"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "Chỉnh sửa tài khoản",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF0056A6),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 10),

            // 🟡 Avatar
            Stack(
              alignment: Alignment.bottomRight,
              children: [
                CircleAvatar(
                  radius: 60,
                  backgroundColor: Colors.amber,
                  backgroundImage:
                      _avatarImage != null ? FileImage(_avatarImage!) : null,
                  child: _avatarImage == null
                      ? const Text(
                          "NP",
                          style: TextStyle(
                            fontSize: 32,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        )
                      : null,
                ),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.edit, color: Colors.black87, size: 20),
                    onPressed: _pickImage,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // 🟢 Họ tên (không chỉnh sửa)
            Text(
              widget.student?.studentName ?? _studentName,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),

            // 🟢 MSSV (không chỉnh sửa)
            Text(
              "MSSV: ${widget.student?.studentId ?? _studentId}",
              style: const TextStyle(fontSize: 15, color: Colors.grey),
            ),
            const SizedBox(height: 30),

            // 🔹 Email
            TextField(
              controller: emailController,
              decoration: InputDecoration(
                labelText: "Email",
                prefixIcon: const Icon(Icons.email_outlined),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // 🔹 Mật khẩu mới
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: "Mật khẩu mới",
                prefixIcon: const Icon(Icons.lock_outline),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 40),

            // 🟢 Nút lưu thay đổi
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0056A6),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: _saveChanges,
                child: const Text(
                  "Lưu thay đổi",
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
