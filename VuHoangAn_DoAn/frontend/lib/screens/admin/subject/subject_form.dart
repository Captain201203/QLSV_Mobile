import 'package:flutter/material.dart';
import '../../../theme.dart';
import '../../../models/subject.dart';

class SubjectForm extends StatefulWidget {
  final Subject? subject; 
  const SubjectForm({super.key, this.subject});
  

  @override
  State<SubjectForm> createState() => _SubjectFormState();
}

class _SubjectFormState extends State<SubjectForm> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _subjectNameController = TextEditingController();
  final TextEditingController _subjectCodeController = TextEditingController();
  final TextEditingController _creditsController = TextEditingController(text: '3');
  String? _selectedMajor;

  @override
  void initState() {
    super.initState();
    // Nếu đang ở chế độ edit, load dữ liệu vào form
    if (widget.subject != null) {
      _subjectNameController.text = widget.subject!.subjectName;
      _subjectCodeController.text = widget.subject!.subjectId;
      _creditsController.text = widget.subject!.credits.toString();
      _selectedMajor = widget.subject!.department;
    }
  }

  @override
  void dispose() {
    _subjectNameController.dispose();
    _subjectCodeController.dispose();
    _creditsController.dispose();
    super.dispose();
  }

  final List<String> majors = [
    'Công nghệ thông tin',
    'Quản trị kinh doanh',
    'Marketing',
    'Thương mại điện tử',
    'Logistics',
    'Tâm lý học',
    'Quan hệ công chúng',
    'Quản trị khách sạn',
    'Luật',
    'Thời Trang',
    'Ngôn ngữ Anh',
    'Ngôn ngữ Hàn Quốc',
    'Ngôn ngữ Nhật Bản',
    'Trí tuệ nhân tạo',
    'Công nghệ ô tô',
    'Kỹ thuật điện',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: Text(widget.subject == null ? 'Thêm Môn Học' : 'Sửa Môn Học'),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
        elevation: 2,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Card(
          color: Colors.white,
          elevation: 3,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 🟦 Tên môn học
                  const Text(
                    'Tên môn học',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _subjectNameController,
                    decoration: const InputDecoration(
                      hintText: 'Nhập tên môn học',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Vui lòng nhập tên môn học';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  // 🟦 Mã môn học
                  const Text(
                    'Mã môn học',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _subjectCodeController,
                    decoration: const InputDecoration(
                      hintText: 'Nhập mã môn học',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Vui lòng nhập mã môn học';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  // 🟦 Số tín chỉ
                  const Text(
                    'Số tín chỉ',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _creditsController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      hintText: 'Nhập số tín chỉ',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Vui lòng nhập số tín chỉ';
                      }
                      final credits = int.tryParse(value);
                      if (credits == null || credits <= 0) {
                        return 'Số tín chỉ phải là số nguyên dương';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  // 🟦 Ngành học
                  const Text(
                    'Ngành học',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    initialValue: _selectedMajor,
                    decoration: const InputDecoration(
                      hintText: 'Chọn ngành học',
                    ),
                    items: majors
                        .map(
                          (major) => DropdownMenuItem(
                            value: major,
                            child: Text(major),
                          ),
                        )
                        .toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedMajor = value;
                      });
                    },
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Vui lòng chọn ngành học';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 30),

                  // 🟦 Nút lưu
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.save),
                      label: Text(widget.subject == null ? 'Thêm Môn Học' : 'Cập Nhật Môn Học'),
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          final updatedSubject = Subject(
                            id: widget.subject?.id ?? '',
                            subjectId: _subjectCodeController.text,
                            subjectName: _subjectNameController.text,
                            credits: int.parse(_creditsController.text),
                            department: _selectedMajor!,
                            description: widget.subject?.description,
                          );

                          Navigator.pop(context, updatedSubject);

                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(widget.subject == null 
                                  ? 'Đã thêm môn học thành công!' 
                                  : 'Đã cập nhật môn học thành công!'),
                              behavior: SnackBarBehavior.floating,
                              backgroundColor: Colors.green,
                            ),
                          );
                        }
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
