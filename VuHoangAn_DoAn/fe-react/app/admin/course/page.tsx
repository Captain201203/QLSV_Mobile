"use client";

import { useEffect, useState } from "react";
import { courseService } from "@/app/services/courseService";
import { Course } from "@/app/types/course";
import CourseCard from "@/app/components/course/courseCard";
import CourseForm from "@/app/components/course/courseForm";
import { Plus, X } from "lucide-react";

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách khóa học");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = async (data: Course) => {
    try {
      await courseService.create(data);
      setShowForm(false);
      fetchCourses();
    } catch {
      alert("Tạo khóa học thất bại");
    }
  };

  const handleUpdate = async (data: Course) => {
    try {
      await courseService.update(data.courseId, data);
      setShowForm(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch {
      alert("Cập nhật khóa học thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa khóa học này?")) return;
    try {
      await courseService.deleteCourse(id);
      fetchCourses();
    } catch {
      alert("Xóa khóa học thất bại");
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
        <button
          onClick={() => {
            setSelectedCourse(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} /> Thêm khóa học
        </button>
      </div>

      {showForm ? (
        <div className="mb-6 bg-white shadow rounded-lg p-4 relative">
          <button
            onClick={() => {
              setShowForm(false);
              setSelectedCourse(null);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          >
            <X />
          </button>
          <CourseForm
            course={selectedCourse}
            onSubmit={selectedCourse ? handleUpdate : handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.courseId}
            course={course}
            onEdit={() => handleEdit(course)}
            onDelete={() => handleDelete(course.courseId)}
          />
        ))}
      </div>
    </div>
  );
}
