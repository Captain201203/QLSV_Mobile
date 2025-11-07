import 'package:flutter/material.dart';
import 'package:frontend/screens/student/score_screen.dart';
import 'study_info_screen.dart';
import 'exam_schedule_screen.dart';
import 'notification_screen.dart';
import 'settings_screen.dart';
import '../../models/student.dart';
import '../student/news_detail_screen.dart';
import '../../widgets/bottom_nav.dart';
import '../../widgets/quick_access.dart';

class HomeScreen extends StatefulWidget {
  final String? className;
  final Student? student;

  const HomeScreen({super.key, this.className, this.student});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // Note: this screen was simplified to avoid requiring callers to always
  // supply `className` and `student` when navigating via the BottomNavBar.

  void _openNews(BuildContext context, Map<String, String> news) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => NewsDetailScreen(
          title: news['title']!,
          imageUrl: news['image']!,
          content: news['content']!,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final newsList = [
      {
        'title':
            'HUTECH đồng hành cùng các đại học quốc tế tại IRCIEST 2025: Gắn kết tri thức, hướng đến phát triển bền vững',
        'image':
            'https://file1.hutech.edu.vn/file/editor/homepage1/851429-z7144526260155_fe10d3d2718526e3881c888139a48785.jpg',
        'content':
            'Trường Đại học Công nghệ TP.HCM (HUTECH) phối hợp cùng các đại học quốc tế tổ chức Hội nghị IRCIEST 2025 nhằm gắn kết tri thức và hướng đến phát triển bền vững...',
      },
      {
        'title':
            'Sinh viên HUTECH giành giải cao tại cuộc thi Nghiên cứu Khoa học 2025',
        'image':
            'https://file1.hutech.edu.vn/file/editor/homepage1/658422-z7144526239882_e68e88d8c59dd574512c799f6e560660.jpg',
        'content':
            'Nhóm sinh viên Khoa CNTT HUTECH đã xuất sắc giành giải Nhất tại cuộc thi Nghiên cứu Khoa học cấp thành phố, khẳng định năng lực sáng tạo và ứng dụng công nghệ cao.',
      },
      {
        'title':
            'HUTECH tổ chức Ngày hội việc làm 2025 với hơn 200 doanh nghiệp',
        'image':
            'https://file1.hutech.edu.vn/file/editor/homepage1/910647-z7142224059195_af916da784d8b4aa1de23548ff457504.jpg',
        'content':
            'Ngày hội việc làm HUTECH 2025 thu hút hơn 200 doanh nghiệp trong và ngoài nước, mang đến hơn 5.000 cơ hội nghề nghiệp cho sinh viên ở mọi ngành học.',
      },
      {
        'title':
            'Lễ tốt nghiệp HUTECH 2025: Hơn 3.000 tân cử nhân chính thức ra trường',
        'image':
            'https://file1.hutech.edu.vn/file/editor/homepage1/221841-z7144526245956_36c9b012d1b2b1c1a22c097d03a1b353.jpg',
        'content':
            'Lễ tốt nghiệp năm 2025 diễn ra trang trọng tại Hội trường HUTECH, đánh dấu hành trình học tập thành công của hơn 3.000 tân cử nhân và kỹ sư các ngành.',
      },
      {
        'title':
            'CLB Sinh viên Tình nguyện HUTECH tổ chức chiến dịch “Mùa hè xanh 2025”',
        'image':
            'https://file1.hutech.edu.vn/file/editor/homepage1/221841-z7144526245956_36c9b012d1b2b1c1a22c097d03a1b353.jpg',
        'content':
            'Chiến dịch tình nguyện “Mùa hè xanh 2025” của sinh viên HUTECH diễn ra tại nhiều địa phương, mang lại nhiều hoạt động ý nghĩa cho cộng đồng và xã hội.',
      },
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      bottomNavigationBar: const BottomNavBar(currentIndex: 0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1DA1F2),
        centerTitle: true,
        automaticallyImplyLeading: false, // ✨ tắt nút quay lại
        title: const Text('Trang chủ', style: TextStyle(color: Colors.white)),
      ),

      body: ListView(
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 10), // EdgeInsets.symmetric là padding cho cả 2 bên, horizontal là padding cho bên trái và bên phải, vertical là padding cho bên trên và bên dưới
            child: Text(
              'Truy cập nhanh',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0056A6),
              ),
            ),
          ),
          const QuickAccessSection(),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
              'Tin tức trong khoa',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0056A6),
              ),
            ),
          ),
          const SizedBox(height: 8),

          // Danh sách tin tức
          ...newsList.map(
            (news) => _NewsCard(
              title: news['title']!,
              imageUrl: news['image']!,
              content: news['content']!,
              onTap: () => _openNews(context, news),
            ),
          ),
        ],
      ),
    );
  }
}

/// Widget hiển thị từng tin
class _NewsCard extends StatelessWidget {
  final String title;
  final String imageUrl;
  final String content;
  final VoidCallback onTap;

  const _NewsCard({
    required this.title,
    required this.imageUrl,
    required this.content,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector( // GestureDetector là widget xử lý sự kiện nhấn vào mục
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                imageUrl,
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              content,
              style: const TextStyle(fontSize: 15, color: Colors.black87),
            ),
            const SizedBox(height: 6),
            const Align(
              alignment: Alignment.centerRight,
              child: Text(
                'Xem chi tiết →',
                style: TextStyle(
                  fontSize: 14,
                  color: Color(0xFF0056A6),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const Divider(),
          ],
        ),
      ),
    );
  }
}
