import 'package:flutter/material.dart';

// ---------------Widget hiển thị trang Cài đặt---------------
class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

// ----------------State của trang Settings------------------
class _SettingsPageState extends State<SettingsPage> {
  bool isDarkMode = false; // Trạng thái chế độ tối
  Color primaryColor = const Color(0xFF2196F3); // Màu chủ đề mặc định

  // Danh sách các màu chủ đề có thể chọn
  final List<Color> themeColors = [
    const Color(0xFF2196F3), // Xanh dương
    const Color(0xFF1976D2),
    const Color(0xFF4CAF50),
    const Color(0xFFFF9800),
    const Color(0xFFE91E63),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cài đặt giao diện')),

      // Nội dung chính: danh sách các tùy chọn cài đặt
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // 🔆 Card bật/tắt chế độ tối (Dark Mode)
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 3,
            child: SwitchListTile(
              title: const Text('Chế độ tối (Dark Mode)'),
              subtitle: const Text('Bật/tắt chế độ hiển thị tối'),
              value: isDarkMode,
              onChanged: (val) {
                setState(() => isDarkMode = val);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      isDarkMode ? 'Đã bật chế độ tối' : 'Đã tắt chế độ tối',
                    ),
                    duration: const Duration(seconds: 1),
                  ),
                );
              },
              secondary: const Icon(Icons.dark_mode),
            ),
          ),

          const SizedBox(height: 20),

          // 🎨 Card chọn màu chủ đề
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 3,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Màu chủ đề',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 12,
                    children: themeColors.map((color) {
                      return GestureDetector(
                        onTap: () {
                          setState(() => primaryColor = color);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Đã thay đổi màu chủ đề'),
                            ),
                          );
                        },
                        child: CircleAvatar(
                          backgroundColor: color,
                          radius: 22,
                          child: color == primaryColor
                              ? const Icon(Icons.check, color: Colors.white)
                              : null,
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),

          // 🧾 Card thông tin ứng dụng
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 3,
            child: ListTile(
              leading: const Icon(Icons.info, color: Colors.blue),
              title: const Text('Phiên bản ứng dụng'),
              subtitle: const Text('1.0.0 - Build 5'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                showAboutDialog(
                  context: context,
                  applicationName: 'Student Management Admin',
                  applicationVersion: '1.0.0 (Build 5)',
                  applicationIcon: const Icon(
                    Icons.school,
                    size: 40,
                    color: Colors.blue,
                  ),
                  children: [
                    const Text(
                      'Ứng dụng quản lý sinh viên dành cho Admin.\n\n'
                      'Cung cấp tính năng quản lý sinh viên, tài khoản, thời khóa biểu và cài đặt giao diện.',
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
