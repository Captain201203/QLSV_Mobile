import 'package:flutter/material.dart';
import 'package:frontend/screens/student/score_screen.dart';
import 'study_info_screen.dart';
import 'exam_schedule_screen.dart';
import 'notification_screen.dart';
import 'settings_screen.dart';
import '../../models/student.dart';


class HomeScreen extends StatefulWidget {
  final String className;
  final Student student;

  const HomeScreen({super.key, required this.className, required this.student});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  late List<Widget> _screens;

  // Danh sách các màn hình tương ứng từng mục
  @override
  void initState() {
    super.initState();
    _screens = [
      HomeContent(className: widget.className, student: widget.student), // truyền cả className và student
      StudyInfoScreen(className: widget.className), // truyền className
      const ExamScheduleScreen(), //
      const NotificationScreen(),
      SettingsScreen(student: widget.student),
    ];
  }

  // Khi nhấn vào mục dưới thanh điều hướng
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index; // cập nhật chỉ mục được chọn
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex], // hiển thị màn hình của mục được chọn
      bottomNavigationBar: BottomNavigationBar( // cài đặt thanh điều hướng dưới cùng
        currentIndex: _selectedIndex, // chỉ mục hiện tại bằng chỉ mục được chọn
        onTap: _onItemTapped, // gọi hàm khi nhấn vào vào mục 
        selectedItemColor: Colors.blueAccent, // màu mục được chọn
        unselectedItemColor: Colors.black45,// màu mục không được chọn
        type: BottomNavigationBarType.fixed, // kiểu cố định, BottomNavigatorBarType là một enum định nghĩa các kiểu hiển thị của thanh điều hướng dưới cùng trong Flutter. fixed nghĩa là tất cả các mục sẽ được hiển thị đồng thời và có kích thước bằng
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Trang chủ'),
          BottomNavigationBarItem(icon: Icon(Icons.schedule), label: 'TKB'),
          BottomNavigationBarItem(icon: Icon(Icons.edit_calendar), label: 'Lịch thi'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications), label: 'Thông báo'),
          BottomNavigationBarItem(icon: Icon(Icons.menu), label: 'Cài đặt'),
        ],
      ),
    );
  }
}
class HomeContent extends StatelessWidget {
  final String className;
  final Student student;
  
  const HomeContent({super.key, required this.className, required this.student});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView( // cho phép cuộn khi nội dung vượt quá
      child: Column( // widget dạng cột
        children: [
          const SizedBox(height: 20), // khoảng cách trên cùng
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16), // khoảng cách 2 bên, đối xứng theo chiều ngang
            child: Row( // widget dạng hàng 
              children: [
                Image.network( // logo HUTECH
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-tELDvl_eNyJhTKgJR8nS2zRZwIURWIy_Sw&s',
  height: 45,
),

                const SizedBox(width: 10), // khoảng cách giữa logo và chữ
                const Expanded(
                  child: Text(
                    'Tri thức - Đạo đức - Sáng tạo',
                    style: TextStyle(fontSize: 14, color: Colors.black87),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          const Divider(thickness: 1), // đường kẻ ngang, độ dày 1

          // 🔸 Tiêu đề Truy cập nhanh
          const Padding(
            padding: EdgeInsets.only(left: 16, top: 8, bottom: 4),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Truy cập nhanh',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
            ),
          ),

          // 🔹 Các ô truy cập nhanh
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: GridView.count(
              shrinkWrap: true,
              crossAxisCount: 3,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildQuickItem(
                  context,
                  icon: Icons.people_alt,
                  title: 'Thời khóa biểu',
                  color: Colors.greenAccent.shade100,
                  onTap: () {
                    Navigator.push(
                      context,
                        MaterialPageRoute(builder: (_) => StudyInfoScreen(className: className)),
                    );
                  },
                ),
                _buildQuickItem(
                  context,
                  icon: Icons.edit_calendar,
                  title: 'Lịch thi',
                  color: Colors.purpleAccent.shade100,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ExamScheduleScreen()),
                    );
                  },
                ),
                _buildQuickItem(
                  context,
                  icon: Icons.score,
                  title: 'Xem điểm',
                  color: Colors.orangeAccent.shade100,
                  onTap: () {
                    Navigator.push(
                      context,
                        MaterialPageRoute(builder: (_) => ScoreScreen(student: student)),
                    );
                  },
                ),

                _buildQuickItem(
                  context,
                  icon: Icons.fact_check,
                  title: 'Điểm danh',
                  color: Colors.orangeAccent.shade100,
                  onTap: () {},
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Tin HUTECH',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
  'https://urbanvietnam.vn/images/HUTECH.jpg',
  fit: BoxFit.cover,
),

            ),
          ),
          const SizedBox(height: 15),
        ],
      ),
    );
  }

  Widget _buildQuickItem(BuildContext context,
      {required IconData icon,
      required String title,
      required Color color,
      required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: Colors.black12),
          borderRadius: BorderRadius.circular(10),
        ),
        padding: const EdgeInsets.all(10),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              backgroundColor: color,
              radius: 25,
              child: Icon(icon, color: Colors.black87, size: 28),
            ),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontSize: 14)),
          ],
        ),
      ),
    );
  }
}
