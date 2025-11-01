import 'package:flutter/material.dart';
import '../../../theme.dart';
import '../../../models/class.dart';
import '../../../services/class_service.dart';

class ClassFormPage extends StatefulWidget {
  final Class? classes;

  const ClassFormPage({super.key, this.classes});

  @override
  State<ClassFormPage> createState() => _ClassFormPageState();
}

class _ClassFormPageState extends State<ClassFormPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _classIdController = TextEditingController();
  final TextEditingController _classNameController = TextEditingController();
  String? _selectedDepartment;

  final List<String> departments = [
    'Công nghệ thông tin',
    'Quản trị kinh doanh',
    'Marketing',
    'Thương mại điện tử',
    'Luật',
    'Tâm lý học',
    'Ngôn ngữ Anh',
    'Ngôn ngữ Nhật',
    'Ngôn ngữ Hàn Quốc',
    'Kỹ thuật điện',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.classes != null) {
      _classIdController.text = widget.classes!.classId;
      _classNameController.text = widget.classes!.className;
      _selectedDepartment = widget.classes!.department;
    }
  }

  Future<void> _saveClass() async {
    if (_formKey.currentState!.validate()) {
      final newClass = Class(
        id: widget.classes?.id ?? '',
        classId: _classIdController.text.trim(),
        className: _classNameController.text.trim(),
        department: _selectedDepartment!,
      );

      try {
        if (widget.classes == null) {
          await ClassService.createClass(newClass);
        } else {
          await ClassService.updateClass(newClass.id, newClass.toJson());
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(widget.classes == null
                ? "Đã thêm lớp học thành công!"
                : "Đã cập nhật lớp học thành công!"),
            backgroundColor: Colors.green,
          ),
        );

        Navigator.pop(context, true);
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Lỗi: $e"), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.classes != null;

    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: Text(isEditing ? "Sửa lớp học" : "Thêm lớp học"),
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Card(
          elevation: 3,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Mã lớp học", style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _classIdController,
                    decoration: const InputDecoration(hintText: "Nhập mã lớp học"),
                    validator: (value) => value == null || value.isEmpty ? "Không được để trống" : null,
                  ),
                  const SizedBox(height: 16),

                  const Text("Tên lớp học", style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _classNameController,
                    decoration: const InputDecoration(hintText: "Nhập tên lớp học"),
                    validator: (value) => value == null || value.isEmpty ? "Không được để trống" : null,
                  ),
                  const SizedBox(height: 16),

                  const Text("Ngành học", style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: _selectedDepartment,
                    items: departments
                        .map((dept) => DropdownMenuItem(value: dept, child: Text(dept)))
                        .toList(),
                    onChanged: (value) => setState(() => _selectedDepartment = value),
                    decoration: const InputDecoration(hintText: "Chọn ngành học"),
                    validator: (value) => value == null ? "Vui lòng chọn ngành học" : null,
                  ),
                  const SizedBox(height: 30),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.save),
                      label: Text(isEditing ? "Cập nhật" : "Lưu"),
                      onPressed: _saveClass,
                      style: ElevatedButton.styleFrom(backgroundColor: kPrimary),
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
