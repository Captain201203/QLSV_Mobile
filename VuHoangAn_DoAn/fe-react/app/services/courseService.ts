import {Course} from "@/app/types/course";
import { classService } from "./classService";
import { Class } from "../types/class";

const API_URL = "http://localhost:3000/courses";

export const courseService = {
    async getAll(): Promise<Course[]>{
        const res = await fetch(API_URL, {cache: "no-store"});
        if(!res.ok) throw new Error("Failed to fetch course");
        return res.json();

    },

    async getById(id: string): Promise<Course>{
        const res = await fetch(`${API_URL}/${id}`, {cache: "no-store"});
        if(!res.ok) throw new Error("Failed to fetch course");
        return res.json();
    },

    async create(data: Course): Promise<Course>{
        const res = await fetch(API_URL,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        })

        if(!res.ok) throw new Error("Failed to create course");
        return res.json();

    },

    async update(id: string, data: Course): Promise<Course>{
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
        if(!res.ok) throw new Error("Failed to update course");
        return res.json();
    },

    async deleteCourse(courseId: string): Promise<void> {
        const res = await fetch(`${API_URL}/${courseId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete course");
    },

    async addClass(courseId: string, classId: string): Promise<Course>{
        const res = await fetch(`${API_URL}/${courseId}/classes`,{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({classId}),
        });

        if(!res.ok) throw new Error("Failed to add class");
        return res.json();


    },

    async removeClass(courseId: string, classId: string): Promise<Course> {
        const res = await fetch(`${API_URL}/${courseId}/classes/${classId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to remove class");
        return res.json();
    }, 

    async getClasses(courseId: string): Promise<Class[]> {
        const res = await fetch(`${API_URL}/${courseId}/classes`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to get classes");
        return res.json();
    },


    
}