import 'dart:async';
import 'package:flutter/material.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  final List<TextEditingController> _controllers =
      List.generate(4, (_) => TextEditingController());
  String? message;
  Color messageColor = Colors.red;
  Timer? _messageTimer;

  void _submitCode() {
    String code = _controllers.map((c) => c.text).join();

    if (code == "1234") {
      setState(() {
        message = "Điểm danh thành công";
        messageColor = Colors.green;
      });
    } else {
      setState(() {
        message = "Mã điểm danh không đúng hoặc đã hết hạn";
        messageColor = Colors.red;
      });
    }

    // Ẩn thông báo sau 15 giây
    _messageTimer?.cancel();
    _messageTimer = Timer(const Duration(seconds: 15), () {
      if (mounted) {
        setState(() {
          message = null;
        });
      }
    });
  }

  @override
  void dispose() {
    for (var controller in _controllers) {
      controller.dispose();
    }
    _messageTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xfff1f5f9),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 24),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.2),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "Điểm danh",
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                "Mã điểm danh sẽ được giảng viên cung cấp\ntrong quá trình điểm danh",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.black54),
              ),
              const SizedBox(height: 20),

              // 4 ô nhập mã
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(4, (index) {
                  return Container(
                    width: 45,
                    height: 55,
                    margin: const EdgeInsets.symmetric(horizontal: 6),
                    child: TextField(
                      controller: _controllers[index],
                      textAlign: TextAlign.center,
                      keyboardType: TextInputType.number,
                      maxLength: 1,
                      decoration: InputDecoration(
                        counterText: "",
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: const BorderSide(
                              color: Color(0xffd1d5db), width: 1.5),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: const BorderSide(
                              color: Color(0xff1d4ed8), width: 2),
                        ),
                      ),
                      onChanged: (value) {
                        if (value.isNotEmpty && index < 3) {
                          // Nhảy sang ô tiếp theo khi nhập
                          FocusScope.of(context).nextFocus();
                        } else if (value.isEmpty && index > 0) {
                          // Khi xoá -> quay lại ô trước
                          FocusScope.of(context).previousFocus();
                        }
                      },
                    ),
                  );
                }),
              ),
              const SizedBox(height: 10),

              // Thông báo kết quả
              if (message != null)
                Text(
                  message!,
                  style: TextStyle(color: messageColor, fontSize: 14),
                ),
              const SizedBox(height: 20),

              // Nút xác nhận
              SizedBox(
                width: double.infinity,
                height: 45,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xff1d4ed8),
                    foregroundColor: Colors.white, // 👉 chữ màu trắng
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: _submitCode,
                  child: const Text("Xác nhận", style: TextStyle(fontSize: 16)),
                ),
              ),
              const SizedBox(height: 12),

              // Nút thoát
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: const Text(
                  "Thoát",
                  style: TextStyle(
                    color: Colors.black54,
                    fontSize: 15,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
