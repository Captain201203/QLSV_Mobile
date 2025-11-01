import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';
import '../../../../services/student_import_service.dart';

class StudentImportScreen extends StatefulWidget {
  const StudentImportScreen({super.key});

  @override
  State<StudentImportScreen> createState() => _StudentImportScreenState();

}

class _StudentImportScreenState extends State<StudentImportScreen>{
  dynamic _selectedFile; // Thay đổi từ File? thành dynamic
  bool _isUploading = false;
  Map<String, dynamic>? _importResult;

  Future<void> _pickFile() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['xlsx', 'xls'],
        allowMultiple: false,
      );

      if(result != null){
        setState((){
          // Xử lý cho cả mobile/desktop và web
          if (result.files.first.path != null) {
            // Mobile/Desktop - sử dụng File object
            _selectedFile = File(result.files.first.path!);
          } else {
            // Web - sử dụng PlatformFile trực tiếp
            _selectedFile = result.files.first;
          }
          _importResult = null;
        });
      }
    }catch(e){
      _showSnackBar('Lỗi chọn file: $e', isError: true);
    }
  }

  Future<void> _uploadFile() async{
    if(_selectedFile == null){
      _showSnackBar('Vui lòng chọn file Excel',isError: true);
      return;
    }
    setState(() {
      _isUploading = true;
    });

    try{
      final result = await StudentImportService.importFromExcel(_selectedFile!);
      setState(() {
        _importResult = result;
        _isUploading = false;
      });

      _showSnackBar('Import thành công!',isError: false);
    }catch(e){
      setState(() {
        _isUploading = false;
      });

      _showSnackBar('Lỗi import: $e', isError: true);
    }
  }

  void _showSnackBar(String message, {required bool isError}){
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar( 
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.green,
      ),
      
    );

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Import Sinh viên từ Excel'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Hướng dẫn
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Hướng dẫn:',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text('1. File Excel phải có các cột: studentId, studentName, dateOfBirth, phoneNumber, email, className'),
                    const Text('2. Dòng đầu tiên là header'),
                    const Text('3. Chỉ hỗ trợ file .xlsx và .xls'),
                    const Text('4. Dung lượng tối đa 10MB'),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Chọn file
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const Text(
                      'Chọn file Excel:',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    
                    if (_selectedFile != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.green.shade50,
                          border: Border.all(color: Colors.green),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.check_circle, color: Colors.green),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _selectedFile is File 
                                  ? _selectedFile!.path.split('/').last
                                  : _selectedFile!.name,
                                style: const TextStyle(fontWeight: FontWeight.w500),
                              ),
                            ),
                            IconButton(
                              onPressed: () {
                                setState(() {
                                  _selectedFile = null;
                                  _importResult = null;
                                });
                              },
                              icon: const Icon(Icons.close),
                            ),
                          ],
                        ),
                      ),
                    ] else ...[
                      ElevatedButton.icon(
                        onPressed: _pickFile,
                        icon: const Icon(Icons.upload_file),
                        label: const Text('Chọn file Excel'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Nút upload
            if (_selectedFile != null)
              ElevatedButton(
                onPressed: _isUploading ? null : _uploadFile,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isUploading
                    ? const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          ),
                          SizedBox(width: 12),
                          Text('Đang upload...'),
                        ],
                      )
                    : const Text('Import Sinh viên'),
              ),
            
            const SizedBox(height: 20),
            
            // Kết quả import
            if (_importResult != null) ...[
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Kết quả Import:',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      
                      _buildResultRow('Tổng dòng', _importResult!['totalRows']?.toString() ?? '0'),
                      _buildResultRow('Dòng hợp lệ', _importResult!['valid']?.toString() ?? '0'),
                      _buildResultRow('Tạo mới', _importResult!['upserted']?.toString() ?? '0'),
                      _buildResultRow('Cập nhật', _importResult!['matchedUpdated']?.toString() ?? '0'),
                      _buildResultRow('Bỏ qua (lỗi lớp)', _importResult!['skippedByClass']?.toString() ?? '0'),
                      
                      if (_importResult!['errors'] != null && 
                          (_importResult!['errors'] as List).isNotEmpty) ...[
                        const SizedBox(height: 12),
                        const Text(
                          'Chi tiết lỗi:',
                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red),
                        ),
                        const SizedBox(height: 8),
                        ...(_importResult!['errors'] as List).map((error) => 
                          Padding(
                            padding: const EdgeInsets.only(left: 8, bottom: 4),
                            child: Text(
                              'Dòng ${error['row']}: ${error['reason']}',
                              style: const TextStyle(color: Colors.red, fontSize: 12),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildResultRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }


}