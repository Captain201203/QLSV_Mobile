import Student from '../../models/student/model.js';
import Account from '../../models/account/model.js';
import bcrypt from "bcrypt";

export const createAccountForStudent = async () => {
    try {
        // Lấy tất cả sinh viên từ database
        const students = await Student.find(); 
        
        if (students.length === 0) {
            throw new Error('Không có sinh viên nào trong hệ thống');
        }

        const result = []; // Mảng để lưu kết quả tạo tài khoản
        
        for (const student of students) {
            try {
                // Kiểm tra xem tài khoản đã tồn tại chưa
                const existingAccount = await Account.findOne({ email: student.email }); // kiểm tra email 
                // nếu tồn tại thì trả về thông tin tài khoản đã có, nếu chưa thì tạo tài khoản
                if (existingAccount) {
                    // Nếu đã tồn tại, trả về thông tin có sẵn
                    result.push({
                        _id: existingAccount._id,
                        name: existingAccount.studentName,
                        username: existingAccount.email,
                        password: student.studentId, // Hiển thị MSSV gốc (không hash)
                        role: existingAccount.role,
                        status: 'Đã tồn tại'
                    });
                } else {
                    // Tạo mật khẩu hash từ studentId (MSSV)
                    const hashedPassword = await bcrypt.hash(student.studentId, 10); // tạo mật khẩu bằng mssv,  bcrypt với độ phức tạp là 10
                    
                    // Tạo tài khoản mới
                    const newAccount = await Account.create({ // tạo tài khoản
                        studentName: student.studentName,
                        email: student.email,
                        password: hashedPassword,
                        role: 'sinh viên'
                    });
                    
                    result.push({ // Thêm thông tin tài khoản mới vào kết quả, .push là phương thức thêm phần tử mới vào cuối mảng của javascript
                        _id: newAccount._id,
                        name: newAccount.studentName,
                        username: newAccount.email,
                        password: student.studentId, // Hiển thị MSSV gốc (không hash)
                        role: newAccount.role,
                        status: 'Tạo mới thành công'
                    });
                }
            } catch (error: any) {
                // Log lỗi cho từng sinh viên cụ thể
                console.error(`Lỗi xử lý sinh viên ${student.studentName}:`, error.message);
                result.push({
                    _id: null,
                    name: student.studentName,
                    username: student.email,
                    password: '',
                    role: 'sinh viên',
                    status: `Lỗi: ${error.message}`
                });
            }
        }
        
        return result; // trả về mảng tài khoản
        
    } catch (error: any) {
        console.error('Lỗi trong createAccountForStudent:', error.message);
        throw new Error(`Không thể tạo tài khoản sinh viên: ${error.message}`);
    }
};