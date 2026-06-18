import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import API from "../services/api";

import siteData from "../Data/siteData.json";
import booksData from "../Data/bookData.json";
import coursesData from "../Data/coursesData.json";
import { useNavigate } from "react-router-dom";

import HeroSlider from "./HeroSlider";
import CategoriesSection from "./CategoriesSection";
import BookCard from "./BookCard";
import VideoCourseCard from "./VideoCourseCard";
import AudioCourseCard from "./AudioCourseCard";

export default function HomePage() {
  const navigate = useNavigate();

  const [latestCourses, setLatestCourses] = useState([]);

const courseImages = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=900&q=80",
];

useEffect(() => {
  fetchLatestCourses();
}, []);

const fetchLatestCourses = async () => {
  try {
    const res = await API.get("/courses");

    const coursesWithImages = (res.data.courses || []).map((course, index) => ({
      ...course,
      id: course._id,
      image: courseImages[index % courseImages.length],
thumbnail: courseImages[index % courseImages.length],
      type: course.category?.toLowerCase().includes("audio") ? "audio" : "video",
      duration: course.duration || "10 Hours",
      rating: course.rating || "4.8",
      price: course.price || "₹25,000",
      mode: "Online",
    }));

    setLatestCourses(coursesWithImages);
    console.log(coursesWithImages);
  } catch (error) {
    console.log("Courses load failed", error);
  }
};

  const instructorImages = [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  ];

  return (
    <div className="bg-gradient-to-b from-[#f8fbff] to-[#eef4ff]">
      <HeroSlider slides={siteData.heroSlides} />

      {/* ================= INSTRUCTORS ================= */}
      <section className="py-16 px-4 sm:px-8 md:px-12 lg:px-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">
          {siteData.instructorsSection.title}
        </h2>

        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
          Learn from experienced mentors who guide you with practical knowledge.
        </p>

        <div className="max-w-[1300px] mx-auto">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={28}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {siteData.instructorsSection.items.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 overflow-hidden group">
                  <div className="relative h-52 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 flex justify-center items-center">
                    <div className="absolute inset-0 bg-black/10"></div>

                    <img
                      src={instructorImages[i % instructorImages.length]}
                      alt={item.name}
                      className="relative w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition"
                    />

                    <span className="absolute top-4 right-4 bg-white text-green-600 text-xs font-bold px-3 py-1 rounded-full">
                      Verified
                    </span>
                  </div>

                  <div className="p-6 text-center bg-gray-50">
                    <h3 className="text-xl font-bold text-slate-800">
                      {item.name}
                    </h3>

                    <p className="text-purple-600 font-semibold text-sm mt-1">
                      {item.role}
                    </p>

                    <p className="text-gray-600 text-sm mt-4 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex justify-center gap-5 text-xs text-gray-600 mt-5">
                      <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                        ⭐ 4.9
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                        👨‍🎓 5k+ Students
                      </span>
                    </div>

                    <button className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition">
                      View Profile
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ================= LATEST COURSES ================= */}
      <section className="py-12 px-4 bg-gray-100">
  <h2 className="text-3xl font-bold text-center mb-8">
    Latest Courses
  </h2>

  <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
    {latestCourses.map((course) =>
      course.type === "audio" ? (
        <AudioCourseCard key={course._id} course={course} />
      ) : (
        <VideoCourseCard key={course._id} course={course} />
      )
    )}
  </div>
</section>

      {/* ================= BOOKS SECTION ================= */}
      <section className="py-12 px-4 sm:px-6 md:px-10 lg:px-14 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-slate-800">
          {booksData.booksSection.title}
        </h2>

        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-10">
          {booksData.booksSection.subtitle}
        </p>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {booksData.books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <CategoriesSection />

      {/* ================= WHY CHOOSE ================= */}
      <section className="py-12 px-3 sm:px-6 md:px-10 lg:px-14 bg-white">
        <h2 className="text-3xl font-bold text-center mb-4 text-slate-800">
          {siteData.whyChooseSection.title}
        </h2>

        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
          Learn from experts, grow faster, and achieve your goals with confidence.
        </p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {siteData.whyChooseSection.items.map((item, i) => (
            <div
              key={i}
              className="group bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl shadow-md hover:shadow-xl transition border border-blue-100 p-8 text-center relative overflow-hidden"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-5 group-hover:scale-110 transition">
                {i + 1}
              </div>

              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-12 px-3 sm:px-6 md:px-10 lg:px-14 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-4 text-slate-800">
          {siteData.howItWorksSection.title}
        </h2>

        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
          Follow these simple steps and start your learning journey with confidence.
        </p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {siteData.howItWorksSection.steps.map((step, i) => (
            <div
              key={i}
              className="relative bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center border border-blue-100"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-lg mb-4">
                {step.stepNumber}
              </div>

              {i !== siteData.howItWorksSection.steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-4 w-8 h-1 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              )}

              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {step.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= AFFILIATE ================= */}
      <section className="py-12 px-3 sm:px-6 md:px-10 lg:px-14 bg-gradient-to-r from-purple-900 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              {siteData.affiliateSection.title}
            </h2>

            <p className="mt-4 text-lg text-white/90">
              {siteData.affiliateSection.description}
            </p>

            <ul className="mt-6 space-y-3 text-white/90">
              <li>✅ High commission on every sale</li>
              <li>✅ Zero investment to start</li>
              <li>✅ Trusted coaching brand</li>
              <li>✅ Real-time earnings tracking</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/affiliate-register")}
                className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition"
              >
                {siteData.affiliateSection.ctaLabel}
              </button>

              <button className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-700 transition">
                Learn More
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <h3 className="text-2xl font-bold">₹50K+</h3>
              <p className="text-sm mt-1">Monthly Earnings</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <h3 className="text-2xl font-bold">10K+</h3>
              <p className="text-sm mt-1">Affiliates</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <h3 className="text-2xl font-bold">30%</h3>
              <p className="text-sm mt-1">Commission</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <h3 className="text-2xl font-bold">24/7</h3>
              <p className="text-sm mt-1">Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}