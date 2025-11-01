import 'package:flutter/material.dart';
import '../../../models/student.dart';
import '../../../services/student_service.dart';

// -------------Widget form thêm hoặc sửa thông tin sinh viên---------------
class StudentFormPage extends StatefulWidget {
  final Student? student; // Dữ liệu sinh viên (nếu đang sửa)
  final String? prefilledClassName; // Tên lớp được điền sẵn
  
  const StudentFormPage({
    super.key, 
    this.student, // Dữ liệu sinh viên nếu đang sửa
    this.prefilledClassName, // Tên lớp được điền sẵn
  });

  @override
  State<StudentFormPage> createState() => _StudentFormPageState();
}

//--------------- State của form — xử lý nhập liệu và lưu sinh viên-------------------
class _StudentFormPageState extends State<StudentFormPage> {
  final _formKey = GlobalKey<FormState>(); // Khóa form
  late TextEditingController _studentIdController;
  late TextEditingController _studentNameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneNumberController;
  late TextEditingController _classNameController;
  DateTime? _selectedDateOfBirth;

  // -------------------Khởi tạo controller và gán dữ liệu nếu đang sửa---------------
  @override
  void initState() {
    super.initState();
    _studentIdController = TextEditingController(text: widget.student?.studentId ?? '');
    _studentNameController = TextEditingController(text: widget.student?.studentName ?? '');
    _emailController = TextEditingController(text: widget.student?.email ?? '');
    _phoneNumberController = TextEditingController(text: widget.student?.phoneNumber ?? '');
    
    // Ưu tiên: nếu đang sửa sinh viên thì dùng className của sinh viên đó
    // Nếu không thì dùng prefilledClassName (từ trang lớp học)
    _classNameController = TextEditingController(
      text: widget.student?.className ?? widget.prefilledClassName ?? ''
    );
    
    _selectedDateOfBirth = widget.student?.dateOfBirth;
  }

  // Hàm chọn ngày sinh
  Future<void> _selectDateOfBirth() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDateOfBirth ?? DateTime(2000), // mặc định 2000 nếu chưa chọn
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDateOfBirth) {
      setState(() { // cập nhật trạng thái ngày sinh đã chọn
        _selectedDateOfBirth = picked;
      });
    }
  }

  @override
  void dispose() { // dispose dùng để giải phóng bộ nhớ
    _studentIdController.dispose();
    _studentNameController.dispose();
    _emailController.dispose();
    _phoneNumberController.dispose();
    _classNameController.dispose();
    super.dispose();
  }

  // Hàm lưu dữ liệu sinh viên khi nhấn nút Lưu
  void _save() async {
    if (_formKey.currentState!.validate()) {
      if (_selectedDateOfBirth == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Vui lòng chọn ngày sinh')),
        );
        return;
      }

      showDialog(
        context: context, // Hiển thị dialog loading
        barrierDismissible: false, // Người dùng không thể đóng dialog bằng cách nhấn ngoài
        builder:(context)=> const Center(child: CircularProgressIndicator()), // Hiển thị dialog loading
      );

      try{
        final newStudent = Student( // Tạo đối tượng Student từ dữ liệu nhập
          id: widget.student?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
          studentId: _studentIdController.text,
          studentName: _studentNameController.text,
          dateOfBirth: _selectedDateOfBirth!,
          phoneNumber: _phoneNumberController.text,
          email: _emailController.text,
          className: _classNameController.text,
        );

        if(widget.student == null){
          // Tạo sinh viên mới
          await StudentService.createStudent(newStudent);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Thêm sinh viên thành công')),
          );
        }else{
          // Cập nhật sinh viên
          await StudentService.updateStudent(widget.student!.id, newStudent.toJson());
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Sửa sinh viên thành công')),
          );
        }
        
        // Đóng dialog loading
        Navigator.pop(context);
        // Trả về StudentListPage với kết quả thành công
        Navigator.pop(context, true);
    }catch(error){
        // Đóng dialog loading khi có lỗi
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi khi lưu sinh viên: $error')),
        );
    }
    }
  }

  // Giao diện form nhập sinh viên
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.student == null ? 'Thêm sinh viên' : 'Sửa sinh viên',
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              // Icon sinh viên
              const Center(
                child: CircleAvatar(
                  radius: 60,
                  backgroundColor: Colors.blue,
                  child: Icon(
                    Icons.person,
                    size: 60,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Ô nhập mã sinh viên
              TextFormField(
                controller: _studentIdController,
                decoration: const InputDecoration(
                  labelText: 'Mã sinh viên',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => v!.isEmpty ? 'Nhập mã sinh viên' : null,
              ),
              const SizedBox(height: 15),

              // Ô nhập tên sinh viên
              TextFormField(
                controller: _studentNameController,
                decoration: const InputDecoration(
                  labelText: 'Tên sinh viên',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => v!.isEmpty ? 'Nhập tên sinh viên' : null,
              ),
              const SizedBox(height: 15),

              // Ô nhập tên lớp
              TextFormField(
                controller: _classNameController,
                decoration: const InputDecoration(
                  labelText: 'Tên lớp',
                  border: OutlineInputBorder(),
                  hintText: 'VD: CNTT01, KTPM01',
                ),
                validator: (v) => v!.isEmpty ? 'Nhập tên lớp' : null,
              ),
              const SizedBox(height: 15),

              // Ô chọn ngày sinh
              GestureDetector(
                onTap: _selectDateOfBirth,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today),
                      const SizedBox(width: 10),
                      Text(
                        _selectedDateOfBirth != null
                            ? '${_selectedDateOfBirth!.day}/${_selectedDateOfBirth!.month}/${_selectedDateOfBirth!.year}'
                            : 'Chọn ngày sinh',
                        style: TextStyle(
                          fontSize: 16,
                          color: _selectedDateOfBirth != null
                              ? Colors.black
                              : Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 15),

              // Ô nhập số điện thoại
              TextFormField(
                controller: _phoneNumberController,
                decoration: const InputDecoration(
                  labelText: 'Số điện thoại',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
                validator: (v) => v!.isEmpty ? 'Nhập số điện thoại' : null,
              ),
              const SizedBox(height: 15),

              // Ô nhập email
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (v) {
                  if (v!.isEmpty) return 'Nhập email';
                  if (!v.contains('@')) return 'Email không hợp lệ';
                  return null;
                },
              ),
              const SizedBox(height: 25),

              // Nút lưu thông tin sinh viên
              ElevatedButton(
                onPressed: _save,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  'Lưu',
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
