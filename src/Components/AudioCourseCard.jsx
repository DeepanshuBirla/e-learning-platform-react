import { useNavigate } from "react-router-dom";

export default function AudioCourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl shadow hover:shadow-lg transition overflow-hidden ">
      <div className="relative h-40">
        <span className="bg-green-600 absolute top-2 left-2 text-white text-xs px-2 py-1 rounded">
          🎧 AUDIO
        </span>

        <img
  src={
    course.thumbnail?.startsWith("http")
      ? course.thumbnail
      : course.image ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
  }
  alt={course.title}
  className="w-full h-full object-cover"
/>
      </div>
      <div className="p-4">
        <h3 className="mt-3 font-bold">{course.title}</h3>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="bg-yellow-400 px-2 py-0.5 rounded-full font-semibold">
            NEW
          </span>
          <span className="bg-gray-200 px-2 py-0.5 rounded-full">
            {course.duration}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
  {course.description?.slice(0, 80) ||
    "Professional audio learning course"}
</p>
         <div className="mt-3 text-xs text-gray-500 space-y-1">
          <p>⭐ Rating: {course.rating}</p>
          <p>🎯 Mode: Online</p>
        </div>


         <div className="mt-3 text-lg font-bold text-blue-700">
          ₹{course.price || "25,000"}
        </div>
       <button
  onClick={() => navigate(`/learn/${course._id}`)}
  className="mt-4 w-full bg-green-600 text-white py-2 rounded"
>
  Start Learning
</button>
      </div>
    </div>
  );
}
