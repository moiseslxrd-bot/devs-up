import { useState } from "react";
import PaymentModal from "./PaymentModal";
import "../styles/CourseDetail.css";

function CourseDetail({ course, onBack }) {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <>
      <div className="course-detail">
        <button className="btn-back" onClick={onBack}>← Voltar</button>
        <div className="detail-emoji">{course.emoji}</div>
        <span className="detail-tag">{course.tag}</span>
        <h2>{course.title}</h2>
        <p className="detail-description">{course.description}</p>
        <strong className="detail-price">{course.price}</strong>
        <button className="btn-buy" onClick={() => setShowPayment(true)}>Quero destravar</button>
      </div>
      {showPayment && <PaymentModal course={course} onClose={() => setShowPayment(false)} />}
    </>
  );
}

export default CourseDetail;