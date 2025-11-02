app.use("/students", studentRoute); // sinh viên
app.use("/classes", classRoute); // lớp
app.use("/subjects", subjectRoute); // môn học
app.use("/accounts", accountRoute);// tài khoản

-------------------------------------------------
thêm xóa sửa sinh viên
tạo tài khoản sinh viên
thêm xóa sửa môn học
thêm xóa sửa lớp học
Thêm sinh viên vào lớp
Tạo thời khóa biểu
Sinh viên xem được thời khóa biểu

=> tiếp theo: quản lý điểm sinh viên
              Quản lý thời khóa biểu: thời khóa biểu gán với lớp, đã có danh sách sinh viên trong lớp => tất cả sinh viên cùng 1 lớp có chung 1 thời khóa biểu
              sinh viên xem được điểm ( Quản lý điểm -> danh sách lớp - > danh sách sinh viên -> danh sách môn -> nhập các trường điểm)
              sinh viên quản lý được tài khoản ( thay đổi số điện thoại địa chỉ )
              nghiên cứu quản lý khóa học ( lms )
              




------------------------------------------------
lệnh chạy trên điện thoại, chạy trước flutter run: adb reverse tcp:3000 tcp:3000      

lệnh restart backend khi có code mới Get-Process -Name "node" -ErrorAction SilentlyContinue