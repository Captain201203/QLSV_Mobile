"use-client";

import {useEffect, useState} from "react";
import {X, Save} from "lucide-react";
import {Subject} from "@/app/types/subject";

interface SubjectFormProps{ // khởi tạo interface SubjectFormProps
    subject?: Subject | null; // Dữ liệu môn học nếu đang sửa
    onSubmit: (data: Subject) => void; // Hàm gọi khi submit form
    onCancel: () => void; // Hàm gọi khi hủy form
    loading?: boolean; // Trạng thái loading

}
//----------------------------------------------------------------------
// Hàm chính của component SubjectForm, khởi tạo form thêm/sửa môn học
export default function SubjectForm({subject, onSubmit, onCancel, loading}: SubjectFormProps){
    const [form, setForm] = useState<Subject>({ // khởi tạo state form với kiểu Subject
        subjectId:"",
        subjectName:"",
        credits:0,
        department:"",
        description:"",
    }); // const [form, setForm] = useState là phương thức khởi tạo state trong React

    const [errors, setErrors] = useState<Partial<Record<keyof Subject, string>>>({}); // khởi tạo state errors để lưu lỗi validation

//--------------------------------------------------------------------------------
    // Cập nhật form khi user chọn sửa môn học
    useEffect(()=>{
        if(subject) setForm(subject); // setForm là phương thức cập nhật state form với dữ liệu môn học khi user chọn sửa môn học
    }, [subject]); // useEffect để cập nhật form khi user chọn sửa môn học
//---------------------------------------------------------------------------------
    // kiểm tra tính hợp lệ của form
    const validateForm = (): boolean => { // hàm validateForm để kiểm tra tính hợp lệ của form
        const newErrors: Partial<Record<keyof Subject, string>> = {}; // khởi tạo đối tượng newErrors để lưu lỗi validation

        if(!form.subjectId.trim()) newErrors.subjectId = "Mã môn học là bắt buộc";
        if(!form.subjectName.trim()) newErrors.subjectName = "Tên môn học là bắt buộc";
        if(form.credits <= 0) newErrors.credits = "Số tín chỉ phải lớn hơn 0";
        if(!form.department.trim()) newErrors.department = "Khoa/Bộ môn là bắt buộc";
        setErrors(newErrors); // cập nhật state errors với các lỗi validation mới
        return Object.keys(newErrors).length === 0; // trả về true nếu không có lỗi validation
    }

//------------------------------------------------------------------
    // xử lý submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // ngăn chặn hành vi mặc định của form
        if(validateForm()) onSubmit(form); // nếu form hợp lệ thì gọi hàm onSubmit với dữ liệu form

    };
//------------------------------------------------------------------
    // xử lý thay đổi giá trị của các trường trong form
    const handleChange = (field: keyof Subject, value: string) =>{ // field: keyof Subject là kiểu của trường trong Subject, value: string là giá trị mới của trường
        setForm((prev)=> ({ ...prev, [field]:value})); // cập nhật state form với giá trị mới của trường, ..pre là giữ nguyên các giá trị khác trong form
        if(errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined})); // nếu có lỗi validation của trường thì xóa lỗi đó
    };

    return(
        // lớp nền mờ cho form, fixed là cố định vị trí, inset-0 là chiếm toàn bộ màn hình, bg-black bg-opacity-50 là nền đen mờ, overflow-y-auto là cuộn dọc nếu nội dung vượt quá chiều cao, h-full w-full là chiều cao và chiều rộng đầy đủ, z-50 là lớp trên cùng
        <div className = "fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50"> 
            {/* hộp thoại form, relative là vị trí tương đối, top-10 là cách lề trên 10 đơn vị, mx-auto là căn giữa ngang, p-5 là padding 5 đơn vị, border là viền, w-full max-w-2x1 là chiều rộng đầy đủ nhưng tối đa 2xl, shadow-lg là bóng lớn, rounded-md là bo góc vừa phải, bg-white là nền trắng */}
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2x1 shadow-lg rounded-md bg-white">
                {/* tiêu đề form và nút đóng form, flex là để sắp xếp các phần tử con theo hàng, items-center là căn giữa theo chiều dọc, justify-between là căn giữa theo chiều ngang, mb-6 là margin dưới 6 đơn vị */}
                <div className="flex items-center justify-between mb-6">
                    {/* tiêu đề form, text-lg là cỡ chữ lớn, font-semibold là chữ đậm vừa phải */}
                    <h3 className="text-lg font-semibold">{subject ? "Cập nhật môn học" : "Thêm môn học"}</h3>
                    {/* nút đóng form, text-gray-500 là màu xám nhạt, hover:text-gray-700 là khi hover thì màu xám đậm hơn */}
                    <button className="text-gray-500 hover:text-gray-700" onClick={onCancel}>
                        <i className="fas fa-times"></i> {/* biểu tượng dấu x */}
                    </button>
                </div>

                {/* form thêm/sửa môn học */}
                <form onSubmit={handleSubmit} className = "space-y-6">
                    {/* lưới 2 cột cho các trường trong form, grid là lưới, grid-cols-1 md:grid-cols-2 là 1 cột trên màn hình nhỏ và 2 cột trên màn hình lớn, gap-6 là khoảng cách giữa các phần tử trong lưới */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mã môn học */}
                        <div>
                            {/*block text-sm là cỡ chữ nhỏ, font-medium là chữ đậm vừa phải, text-black là màu chữ đen */}
                            <label className="block text-sm font-medium text-black">Mã môn học</label>
                            <input // trường nhập mã môn học
                            type="text"  // kiểu text
                            value={form.subjectId} // gán value từ state form
                            onChange={(e) => handleChange("subjectId", e.target.value)} // Cập nhật state khi người dùng nhập. e.target.value là giá trị mới của trường
                            className={`mt-1 block w-full border text-black  ${ // Bắt đầu lớp CSS với margin-top 1, block hiển thị đầy đủ chiều rộng
                                errors.subjectId ? "border-red-500" : "border-gray-300" // Hiển thị viền đỏ nếu có lỗi, nếu không thì viền xám
                            }rounded-md shadow-sm py-2 px-3`}
                            placeholder="Nhập mã môn học"
                            />
                            {/* Hiển thị lỗi nếu có, mt-1 là margin-top 1, text-red-600 là màu chữ đỏ */}
                            {errors.subjectId && <p className="mt-1 text-sm text-red-600">{errors.subjectId}</p>} {/* Hiển thị lỗi nếu có */}
                        </div>

                        {/* Tên môn học */}
                        <div>
                            {/*block text-sm là cỡ chữ nhỏ, font-medium là chữ đậm vừa phải, text-black là màu chữ đen */}
                            <label className="block text-sm font-medium text-black">Tên môn học</label>
                            <input // trường nhập tên môn học
                            type="text"  // kiểu text
                            value={form.subjectName} // gán value từ state form
                            onChange={(e) => handleChange("subjectName", e.target.value)} // Cập nhật state khi người dùng nhập. e.target.value là giá trị mới của trường
                            className={`mt-1 block w-full border text-black  ${ // Bắt đầu lớp CSS với margin-top 1, block hiển thị đầy đủ chiều rộng
                                errors.subjectName ? "border-red-500" : "border-gray-300" // Hiển thị viền đỏ nếu có lỗi, nếu không thì viền xám
                            }rounded-md shadow-sm py-2 px-3`}
                            placeholder="Nhập tên môn học"
                            />
                            {/* Hiển thị lỗi nếu có, mt-1 là margin-top 1, text-red-600 là màu chữ đỏ */}
                            {errors.subjectName && <p className="mt-1 text-sm text-red-600">{errors.subjectName}</p>} {/* Hiển thị lỗi nếu có */}
                        </div>

                        {/* Số tín chỉ */}
                        <div>
                            {/*block text-sm là cỡ chữ nhỏ, font-medium là chữ đậm vừa phải, text-black là màu chữ đen */}
                            <label className="block text-sm font-medium text-black">Số tín chỉ</label>
                            <input // trường nhập số tín chỉ
                            type="text"  // kiểu text
                            value={form.credits} // gán value từ state form
                            onChange={(e) => handleChange("credits", e.target.value)} // Cập nhật state khi người dùng nhập. e.target.value là giá trị mới của trường
                            className={`mt-1 block w-full border text-black  ${ // Bắt đầu lớp CSS với margin-top 1, block hiển thị đầy đủ chiều rộng
                                errors.credits ? "border-red-500" : "border-gray-300" // Hiển thị viền đỏ nếu có lỗi, nếu không thì viền xám
                            }rounded-md shadow-sm py-2 px-3`}
                            placeholder="Nhập số tín chỉ"
                            />
                            {/* Hiển thị lỗi nếu có, mt-1 là margin-top 1, text-red-600 là màu chữ đỏ */}
                            {errors.credits && <p className="mt-1 text-sm text-red-600">{errors.credits}</p>} {/* Hiển thị lỗi nếu có */}
                        </div>

                        {/* Khoa/Bộ môn */}
                         <div>
                            {/*block text-sm là cỡ chữ nhỏ, font-medium là chữ đậm vừa phải, text-black là màu chữ đen */}
                            <label className="block text-sm font-medium text-black">Khoa/ngành</label>
                            <input // trường nhập khoa/ngành
                            type="text"  // kiểu text
                            value={form.department} // gán value từ state form
                            onChange={(e) => handleChange("department", e.target.value)} // Cập nhật state khi người dùng nhập. e.target.value là giá trị mới của trường
                            className={`mt-1 block w-full border text-black  ${ // Bắt đầu lớp CSS với margin-top 1, block hiển thị đầy đủ chiều rộng
                                errors.department ? "border-red-500" : "border-gray-300" // Hiển thị viền đỏ nếu có lỗi, nếu không thì viền xám
                            }rounded-md shadow-sm py-2 px-3`}
                            placeholder="Nhập số tín chỉ"
                            />
                            {/* Hiển thị lỗi nếu có, mt-1 là margin-top 1, text-red-600 là màu chữ đỏ */}
                            {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>} {/* Hiển thị lỗi nếu có */}
                        </div>

                        {/* Ghi chú */}
                         <div>
                            {/*block text-sm là cỡ chữ nhỏ, font-medium là chữ đậm vừa phải, text-black là màu chữ đen */}
                            <label className="block text-sm font-medium text-black">Ghi chú</label>
                            <input // trường nhập ghi chú
                            type="text"  // kiểu text
                            value={form.description} // gán value từ state form
                            onChange={(e) => handleChange("description", e.target.value)} // Cập nhật state khi người dùng nhập. e.target.value là giá trị mới của trường
                            className={`mt-1 block w-full border text-black  ${ // Bắt đầu lớp CSS với margin-top 1, block hiển thị đầy đủ chiều rộng
                                errors.description ? "border-red-500" : "border-gray-300" // Hiển thị viền đỏ nếu có lỗi, nếu không thì viền xám
                            }rounded-md shadow-sm py-2 px-3`}
                            placeholder="Nhập số tín chỉ"
                            />
                            {/* Hiển thị lỗi nếu có, mt-1 là margin-top 1, text-red-600 là màu chữ đỏ */}
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>} {/* Hiển thị lỗi nếu có */}
                        </div>
                    </div>

                    {/* nút hủy và lưu, flex là để sắp xếp các phần tử con theo hàng, justify-end là căn phải, space-x-4 là khoảng cách giữa các phần tử con */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        {/* nút hủy */}
                        <button
                        type="button"
                        onClick={onCancel} // gọi hàm onCancel khi nhấn nút hủy
                        // nút hủy, px-4 py-2 là padding ngang 4 và dọc 2, border border-gray-300 là viền xám nhạt, rounded-md là bo góc vừa phải, text-sm là cỡ chữ nhỏ, font-medium là chữ đậm vừa phải, text-gray-700 là màu chữ xám đậm, bg-white là nền trắng, hover:bg-gray-50 là khi hover thì nền xám rất nhạt 
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Hủy   
                        </button>

                        {/* nút lưu */}
                        <button
                        type="submit"
                        disabled={loading} // vô hiệu hóa nút khi đang loading
                        // nút lưu, px-4 py-2 là padding ngang 4 và dọc 2, bg-blue-600 là nền xanh dương đậm, border border-transparent là viền trong suốt, rounded-md là bo góc vừa phải, text-sm là cỡ chữ nhỏ, font-medium là chữ đậm vừa phải, text-white là màu chữ trắng, hover:bg-blue-700 là khi hover thì nền xanh dương đậm hơn, disabled:opacity-50 là khi vô hiệu hóa thì độ mờ 50%, disabled:cursor-not-allowed là khi vô hiệu hóa thì con trỏ chuột không được phép           
                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Đang lưu..." : (subject ? "Cập nhật" : "Lưu")} {/* Hiển thị "Đang lưu..." khi loading, nếu không thì hiển thị "Cập nhật" nếu đang sửa môn học, ngược lại hiển thị "Lưu" */}

                        </button>

                    </div>

                </form>
            </div>

        </div>
    )
}