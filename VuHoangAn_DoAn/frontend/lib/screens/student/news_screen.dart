import 'package:flutter/material.dart';
import '../../widgets/bottom_nav.dart';
import 'news_detail_screen.dart';

class NewsScreen extends StatelessWidget {
  const NewsScreen({super.key});

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
            'Trường Đại học Công nghệ TP.HCM (HUTECH) phối hợp cùng các đại học quốc tế tổ chức Hội nghị IRCIEST 2025 nhằm gắn kết tri thức và hướng đến phát triển bền vững...'
      },
      {
        'title':
            'Sinh viên HUTECH giành giải cao tại cuộc thi Nghiên cứu Khoa học 2025',
        'image':
            'https://file1.hutech.edu.vn/file/editor/homepage1/658422-z7144526239882_e68e88d8c59dd574512c799f6e560660.jpg',
        'content':
            'Nhóm sinh viên Khoa CNTT HUTECH đã xuất sắc giành giải Nhất tại cuộc thi Nghiên cứu Khoa học cấp thành phố, khẳng định năng lực sáng tạo và ứng dụng công nghệ cao.'
      },
      {
        'title': 'HUTECH tổ chức Ngày hội việc làm 2025 với hơn 200 doanh nghiệp',
        'image':
            'https://file1.hutech.edu.vn/file/editor/homepage1/910647-z7142224059195_af916da784d8b4aa1de23548ff457504.jpg',
        'content':
            'Ngày hội việc làm HUTECH 2025 thu hút hơn 200 doanh nghiệp trong và ngoài nước, mang đến hơn 5.000 cơ hội nghề nghiệp cho sinh viên ở mọi ngành học.'
      },
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      bottomNavigationBar: const BottomNavBar(currentIndex: 3),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0056A6),
        centerTitle: true,
        automaticallyImplyLeading: false,
        title: const Text(
          'Tin tức',
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: ListView(
        children: [
          const SizedBox(height: 10),
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
  Widget build(BuildContext context) { // 
    return GestureDetector(
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
