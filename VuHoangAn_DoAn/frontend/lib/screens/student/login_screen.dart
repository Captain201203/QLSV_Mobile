import 'package:flutter/material.dart';
import 'package:frontend/screens/admin/admin_home_screen.dart';
import 'home_screen.dart';
import '../../services/student_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key}); // Khởi tạo LoginScreen

  @override
  State<LoginScreen> createState() => _LoginScreenState(); // khởi tạo state cho widget
  

  
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(); // controller cho trường email
  final _passwordController = TextEditingController(); //controller cho trường mật khẩu

  String? errorMessage; //biến lưu trữ thông báo lỗi ( có thể null )
  bool _loading = false; //biến trạng thái đang tải, dấu _ để biến này là private

  Future<void> loginStudent()async{ // hàm đăng nhập sinh viên
    setState((){ // cập nhật trạng thái 
      _loading = true; // 
      errorMessage = null;
    });

    try{
      final email = _emailController.text.trim(); // lấy giá trị email từ controller và loại bỏ khoảng trắng
      final password = _passwordController.text.trim(); // lấy giá trị mật khẩu từ controller và loại bỏ khoảng trắng

      if(email.isEmpty || password.isEmpty){ // nếu tài khoản hoặc mật khẩu bỏ trống
        setState(() { // cập nhật trạng thái 
          errorMessage = 'Vui lòng nhập đầy đủ thông tin'; // xuất thông báo
        });
        return;
      }

      if(email == 'admin' && password == 'admin@123'){
        Navigator.pushReplacement( // chuyển trang và không thể quay lại 
          context, // ngữ cảnh hiện tại, context là tham số bắt buộc để điều hướng trong Flutter
          MaterialPageRoute(builder: (_) => const AdminHomeScreen() ), // tạo route đến trang AdminHomeScreen
        );
      }

      final student = await StudentService.loginStudent(email,password);

      if(student != null){
        Navigator.pushReplacement( // chuyển trang và không thể quay lại
          context, 
          MaterialPageRoute(
            builder: (_) => HomeScreen(className: student.className, student: student), // truyền className và student vào HomeScreen
          ),
        );

      } else {
        setState(() {
          errorMessage = 'Email hoặc mật khẩu không đúng';
        });
      }
    }catch(e){
      setState(() {
        errorMessage = 'Lỗi đăng nhập : $e';
      });
    }finally{
      setState(() {
        _loading = false;
      });
    }
  }


  @override // ghi đè phương thức build để xây dựng giao diện người dùng
  Widget build(BuildContext context) { // phương thức build trả về widget
    return Scaffold( // khung giao diện cơ bản
      backgroundColor: Colors.white, // backround màu trắng
      body: Column( // bố cục cột
        children: [ // danh sách con của cột, children là dạng danh sách, child là một widget đơn
          Container( // khung chứa
            width: double.infinity, // chiếm toàn bộ chiều rộng
            height: 150, // chiều cao 150
            decoration: const BoxDecoration( // trang trí khung, boxDecoration là lớp trang trí hộp
              color: Color(0xFF4A90E2), // màu nền xanh dương
              borderRadius: BorderRadius.only( // bo góc, only là chỉ định góc nào được bo
                bottomLeft: Radius.circular(40), // bo góc dưới bên trái 40
                bottomRight: Radius.circular(40),// bo góc dưới bên phải 40
              ),
            ),
            alignment: Alignment.center, // alignment là căn chỉnh, center là căn giữa
            child: const Text( // con là 1 text
              'ĐĂNG NHẬP',
              style: TextStyle( // định dạng text
                color: Colors.white, //màu chữ trắng
                fontSize: 22, // cỡ chữ 22
                fontWeight: FontWeight.bold, // chữ in đậm
                letterSpacing: 1.2, // khoảng cách giữa các chữ
              ),
            ),
          ),
          const SizedBox(height: 30), // khoảng cách giữa các widget là 30 ( khoảng cách dọc )
          //Form đăng nhập
          Padding( // thêm khoảng cách bên ngoài
            padding: const EdgeInsets.symmetric(horizontal: 30), // khoảng cách ngang 30, edgeinsets là lớp xác định khoảng cách, symmtric là đối xứng, horizontal là ngang
            child: Container( // tạo khung chứa
            //---------------------------------------
              // phần này để tạo khung form đăng nhập
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 30), // khoảng cách bên trong khung, vertical là dọc
              decoration: BoxDecoration( // trang trí khung
                color: Colors.white, // màu nền trắng
                borderRadius: BorderRadius.circular(20), // bo góc 20
                boxShadow: [ // cài đặt đổ bóng
                  BoxShadow( 
                    color: Colors.grey.withOpacity(0.3), // màu xám với độ mờ 0.3
                    spreadRadius: 2, // Làm cho bóng đổ mở rộng thêm 2 pixel ra ngoài ranh giới của hộp.
                    blurRadius: 8, // Làm cho rìa của bóng đổ bị nhòe đi 8 pixel, tạo cảm giác mềm mại, không bị sắc nét.
                    offset: const Offset(0, 3), // Đặt bóng đổ lệch xuống dưới 3 pixel ($y=3$) và không lệch ngang ($x=0$), tạo cảm giác ánh sáng đang chiếu từ trên xuống.
                  ),
                ],
              ),
              //---------------------------------------
              // phần này để tạo form đăng nhập. biểu tượng người, trường email, trường mật khẩu, nút đăng nhập
              child: Column( // bố cục cột
                mainAxisSize: MainAxisSize.min, // kích thước chính là nhỏ nhất 
                children: [
                  const CircleAvatar(  // biểu tượng hình tròn 
                    radius: 40, // bán kính 40
                    backgroundColor: Colors.black12, // màu nền xám nhạt 
                    child: Icon(Icons.person, size: 50, color: Colors.black54), // con là biểu tượng người với kích thước 50 và màu xám đậm
                  ),
                  const SizedBox(height: 25), // khoảng cách dọc 25

                  // email field, trường điền email
                  TextField(
                    controller: _emailController, // khai báo controller cho trường email 
                    keyboardType: TextInputType.emailAddress, // kiểu bàn phím là email
                    decoration: InputDecoration( // trang trí cho trường nhập email
                      labelText: 'Email', // nhãn hiển thị
                      enabledBorder: OutlineInputBorder( // viền khi không được chọn 
                        borderSide: const BorderSide(color: Colors.blue), // màu viền xanh dương
                        borderRadius: BorderRadius.circular(20), // bo góc cho trường nhập 20 
                      ),
                      focusedBorder: OutlineInputBorder( // viền khi được chọn
                        borderSide: const BorderSide(color: Colors.blue, width: 2), // màu viền xanh dương và độ rộng 2
                        borderRadius: BorderRadius.circular(20),// bo góc 20
                      ),
                      contentPadding: const EdgeInsets.symmetric( // khoảng cách bên trong trường nhập, symmetric để đối xứng
                        vertical: 10, // khoảng cách dọc 10
                        horizontal: 15,// khoảng cách ngang 15
                      ),
                    ),
                  ),
                  const SizedBox(height: 15), // khoảng cách với trường nhập mật khẩu là 15

                  // passwod field: trường nhập password
                  TextField(
                    controller: _passwordController, // khai báo controller cho trường mật khẩu
                    obscureText: true, // ẩn văn bản nhập vào ( dấu * )
                    decoration: InputDecoration( // trang trí cho trường nhập mật khẩu
                      labelText: 'Mật khẩu',
                      enabledBorder: OutlineInputBorder( // viền khi không được chọn
                        borderSide: const BorderSide(color: Colors.blue), // màu viền xanh dương
                        borderRadius: BorderRadius.circular(20), 
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide:
                            const BorderSide(color: Colors.blue, width: 2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        vertical: 10,
                        horizontal: 15,
                      ),
                    ),
                  ),

                  //Error Message
                  if (errorMessage != null) // nếu có thông báo lỗi
                    Padding(
                      padding: const EdgeInsets.only(top: 10), // khoảng cách trên 10
                      child: Text( // hiển thị thông báo lỗi
                        errorMessage!,
                        style: const TextStyle(color: Colors.red), // màu chữ đỏ
                      ),
                    ),
                  const SizedBox(height: 15),

                  //--------nút quên mật khẩu và đăng nhập--------
                  Align( // căn chỉnh cho con, là TextButton
                    alignment: Alignment.centerRight,   // căn phải
                    child: TextButton( // nút văn bản
                      onPressed: () {}, // hàm khi nhấn nút ( hiện chưa làm gì )
                      child: const Text( 
                        'Quên mật khẩu?', // nút quên mật khẩu
                        style: TextStyle(color: Colors.black87),// màu chữ xám đậm
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  //Login Button: nút đăng nhập
                  SizedBox( // khung chứa
                    width: double.infinity, // chiếm toàn bộ chiều rộng 
                    child: ElevatedButton( // nút nâng cao, elevatedButton là nút có hiệu ứng nổi
                      onPressed: _loading ? null : loginStudent, // nếu đang load thì vô hiệu hóa nút, nếu không thì gọi hàm loginStudent để chuyển trang
                      style: ElevatedButton.styleFrom( // định dạng nút
                        backgroundColor: const Color(0xFF4A90E2), // màu nền xanh dương
                        padding: const EdgeInsets.symmetric(vertical: 14),// khoảng cách bên trong nút dọc 14, symmetric để đối xứng
                        shape: RoundedRectangleBorder(// hình dạng nút là hình chữ nhật bo góc
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: _loading ? const CircularProgressIndicator( color: Colors.white) : const Text( // nếu đang load thì hiển thị vòng tròn tải, nếu không thì hiển thị chữ đăng nhập
                        'Đăng nhập',
                        style: TextStyle( // định dạng chữ trên nút
                          fontSize: 16, // cỡ chữ 16
                          color: Colors.white, // màu chữ trắng
                          fontWeight: FontWeight.bold, // chữ in đậm
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
    
  }
}
