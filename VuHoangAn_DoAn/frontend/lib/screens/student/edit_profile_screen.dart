import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:path_provider/path_provider.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final TextEditingController emailController =
      TextEditingController(text: "nguyenphuonglinh141204@gmail.com");
  final TextEditingController passwordController = TextEditingController();

  File? _avatarImage;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  // 🔹 Load dữ liệu đã lưu
  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final avatarPath = prefs.getString('avatar_path');
    final savedEmail = prefs.getString('email');
    final savedPassword = prefs.getString('password');

    setState(() {
      if (avatarPath != null && File(avatarPath).existsSync()) {
        _avatarImage = File(avatarPath);
      }
      if (savedEmail != null) emailController.text = savedEmail;
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
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('email', emailController.text);
    await prefs.setString('password', passwordController.text);
    if (_avatarImage != null) {
      await prefs.setString('avatar_path', _avatarImage!.path);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Cập nhật thông tin thành công!")),
    );
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
            const Text(
              "Nguyễn Phương Linh",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),

            // 🟢 MSSV (không chỉnh sửa)
            const Text(
              "MSSV: 2280601727",
              style: TextStyle(fontSize: 15, color: Colors.grey),
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
