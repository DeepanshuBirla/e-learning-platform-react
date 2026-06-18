import { useNavigate } from "react-router-dom";

export default function VideoCourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col h-full">
      
      {/* Image Section */}
      <div className="relative h-40">
  <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded z-10">
    🎥 VIDEO
  </span>

 <img
  src={
    course.thumbnail?.startsWith("http")
      ? course.thumbnail
      : course.image ||
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"
  }
  alt={course.title}
  className="w-full h-full object-cover"
/>
</div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold">{course.title}</h3>

        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="bg-yellow-400 px-2 py-0.5 rounded-full font-semibold">
            NEW
          </span>
          <span className="bg-gray-200 px-2 py-0.5 rounded-full">
            {course.duration}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-2">
  {course.description?.slice(0, 80) || "Professional course for students"}
</p>

        <div className="mt-3 text-xs text-gray-500 space-y-1">
          <p>⭐ Rating: {course.rating}</p>
          <p>🎯 Mode: Online</p>
        </div>

        <div className="mt-3 text-lg font-bold text-blue-700">
          ₹{course.price || "25,000"}
        </div>

        {/* Button always at bottom */}
       <button
  onClick={() => navigate(`/learn/${course._id}`)}
  className="mt-auto w-full bg-purple-600 text-white py-2 rounded"
>
  Start Learning
</button>
      </div>
    </div>
  );
}
