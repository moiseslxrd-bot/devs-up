import { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import API_URL from "../config";
import "../styles/CourseList.css";

function CourseList({ onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.tag.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="loading">Carregando cursos...</p>;
  }

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Buscar cursos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="no-results">Nenhum curso encontrado.</p>
      ) : (
        <div className="course-list">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;