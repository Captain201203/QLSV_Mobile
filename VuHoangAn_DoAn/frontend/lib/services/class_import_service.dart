import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:typed_data';
import 'dart:io';
import 'api_service.dart';

class ClassImportService {
  static const String _endpoint = '/classes/upload-excel';
  
  // Hàm importFromExcel nhận file và trả về Map<String, dynamic>
  static Future<Map<String, dynamic>> importFromExcel(dynamic file) async{
    try{
      Uint8List fileBytes;
      String fileName;

      // Xử lý file cho mobile/desktop và web
      if (file is File) {
        // Mobile/Desktop - sử dụng File object
        fileBytes = await file.readAsBytes();
        fileName = file.path.split('/').last;
      } else {
        // Web - sử dụng PlatformFile từ file_picker
        fileBytes = file.bytes!;
        fileName = file.name;
      }

      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${ApiService.baseUrl}$_endpoint'),
      );
      request.headers.addAll(ApiService.headers);

      request.files.add(
        http.MultipartFile.fromBytes(
          'file',
          fileBytes,
          filename: fileName,
        ),
      );

      var response = await request.send();
      var responseBody = await response.stream.bytesToString();

      if(response.statusCode == 200){
        return json.decode(responseBody);
      }else{
        throw Exception('Lỗi upload: $responseBody');
      }
    }catch(e){
      throw Exception('Không thể upload file: $e');
    }
  }
}