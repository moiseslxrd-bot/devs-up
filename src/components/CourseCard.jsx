import { useState } from "react";
import PaymentModal from "./PaymentModal";
import "../styles/CourseCard.css";

function CourseCard({ course, onSelectCourse }) {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <>
      <div className="course-card" onClick={() => onSelectCourse(course)}>
        <div className="course-emoji">{course.emoji}</div>
        <span className="course-tag">{course.tag}</span>
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <div className="course-footer">
          <strong className="course-price">{course.price}</strong>
          <button className="btn-buy" onClick={(e) => { e.stopPropagation(); setShowPayment(true); }}>
            Quero destravar
          </button>
        </div>
      </div>
      {showPayment && <PaymentModal course={course} onClose={() => setShowPayment(false)} />}
    </>
  );
}

export default CourseCard;