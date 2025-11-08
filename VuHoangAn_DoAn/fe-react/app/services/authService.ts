import axios from "axios";
import { Student} from "../types/student";

const API_URL = "http://localhost:3000/students";

export interface LoginResponse extends Partial<Student> {
    role: string;
    email: string;
    studentName?: string;
}

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse>{
        try{
            const res = await axios.post(`${API_URL}/login`, { email, password});
            return res.data;
        }catch ( error: any){
            if(error.response?.status === 404){
                throw new Error("Tài khoản không tồn tại")
            } else if(error.response?.status === 401){
                throw new Error("Mật khẩu hoặc tài khoản không đúng")
            } else if(error.response?.status === 403 ){
                throw new Error("Tài khoản không hợp lệ")
            }
            throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
        }
    },

    logout(){
        localStorage.removeItem("user");
        localStorage.removeItem("student");
        localStorage.removeItem("studentId");
        localStorage.removeItem("studentName");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
    },

    getCurrentUser(): LoginResponse | null {
        if(typeof window === "undefined") return null;
        const userJson = localStorage.getItem("user");
        return userJson ? JSON.parse(userJson) : null;
    },

    getCurrentStudent(): Student | null {
        if(typeof window === "undefined") return null;
        const studentJson = localStorage.getItem("student");
        return studentJson ? JSON.parse(studentJson) : null;
    },

    isAuthenticated(): boolean{
        return !!this.getCurrentUser();
    },

    getRole(): string | null {
        const user = this.getCurrentUser();
        return user?.role || null;
    }


}