import { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import API_URL from "../config";
import "../styles/CourseList.css";

function CourseList({ onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="loading">Carregando cursos...</p>;
  }

  return (
    <div className="course-list">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
      ))}
    </div>
  );
}

export default CourseList;