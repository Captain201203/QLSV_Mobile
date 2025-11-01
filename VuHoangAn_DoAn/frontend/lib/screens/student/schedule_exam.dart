import 'package:flutter/material.dart';

class StudyInfoScreen extends StatelessWidget {
  const StudyInfoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),

      // 🔹 AppBar tùy chỉnh theo mẫu
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Thời khóa biểu',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.w600),
        ),
        centerTitle: false,
      ),

      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 🔸 Thanh chọn chế độ “Tuần / Học kỳ”
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  height: 35,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.blueAccent),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      // Nút “Tuần” (được chọn)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: Colors.blueAccent,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        alignment: Alignment.center,
                        child: const Text(
                          'Tuần',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                        ),
                      ),

                      // Nút “Học kỳ”
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        alignment: Alignment.center,
                        child: const Text(
                          'Học kỳ',
                          style: TextStyle(color: Colors.black87, fontWeight: FontWeight.w500),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // 🔹 Dòng hiển thị thời gian tuần
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 5),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Icon(Icons.arrow_back_ios, size: 18, color: Colors.black54),
                Text(
                  '13/10/2025 đến 19/10/2025',
                  style: TextStyle(fontSize: 15, color: Colors.black87),
                ),
                Icon(Icons.arrow_forward_ios, size: 18, color: Colors.black54),
              ],
            ),
          ),

          const Divider(height: 1),

          // 🔸 Danh sách môn học
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(10),
              children: const [
                // 🔹 Thứ 3
                DaySchedule(
                  day: 'Thứ 3, 14/10/2025',
                  subject: 'Lập trình trên thiết bị di động',
                  lesson: '7-11',
                  room: 'E1-08.18',
                ),
                SizedBox(height: 10),

                // 🔹 Thứ 6
                DaySchedule(
                  day: 'Thứ 6, 17/10/2025',
                  subject: 'Quản lý dự án công nghệ thông tin',
                  lesson: '2-6',
                  room: 'E1-09.08',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// 🧩 Widget hiển thị từng ngày học
class DaySchedule extends StatelessWidget {
  final String day;
  final String subject;
  final String lesson;
  final String room;

  const DaySchedule({
    super.key,
    required this.day,
    required this.subject,
    required this.lesson,
    required this.room,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 🔸 Hiển thị thứ + ngày
        Text(
          day,
          style: const TextStyle(
            color: Colors.red,
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),

        // 🧱 Khung thông tin môn học
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(6),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 4,
                spreadRadius: 1,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            title: Text(
              subject,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
            subtitle: Text(
              'Phòng: $room',
              style: const TextStyle(color: Colors.black54, fontSize: 14),
            ),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.black45),
            leading: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('Tiết', style: TextStyle(fontSize: 13, color: Colors.black54)),
                Text(
                  lesson,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
