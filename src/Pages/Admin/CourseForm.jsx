import { useState } from "react";

export default function CourseForm({ initialData, onSubmit, submitText }) {
  const [form, setForm] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <input name="title" value={form.title} onChange={handleChange}
        placeholder="Course Title" className="border p-2 rounded" />

      <input name="slug" value={form.slug} onChange={handleChange}
        placeholder="Slug (spoken-english)" className="border p-2 rounded" />

      <input name="duration" value={form.duration} onChange={handleChange}
        placeholder="Duration (10 Hours)" className="border p-2 rounded" />

      <input name="totalLessons" type="number"
        value={form.totalLessons} onChange={handleChange}
        placeholder="Total Lessons" className="border p-2 rounded" />

      <input name="language" value={form.language} onChange={handleChange}
        placeholder="Language" className="border p-2 rounded" />

      <input name="instructorName" value={form.instructorName}
        onChange={handleChange}
        placeholder="Instructor Name" className="border p-2 rounded" />
        <input
  name="category"
  value={form.category || ""}
  onChange={handleChange}
  placeholder="Category (Frontend, Backend, MERN)"
  className="border p-2 rounded"
/>

<input
  name="thumbnail"
  value={form.thumbnail || ""}
  onChange={handleChange}
  placeholder="Thumbnail URL"
  className="border p-2 rounded"
/>

      <input name="instructorRole" value={form.instructorRole}
        onChange={handleChange}
        placeholder="Instructor Role" className="border p-2 rounded" />

      <input name="instructorExperience" value={form.instructorExperience}
        onChange={handleChange}
        placeholder="Experience (6+ Years)" className="border p-2 rounded" />

      <textarea name="shortDescription" value={form.shortDescription}
        onChange={handleChange}
        placeholder="Short Description"
        className="border p-2 rounded md:col-span-2" />

      <textarea name="longDescription" value={form.longDescription}
        onChange={handleChange}
        placeholder="Long Description"
        className="border p-2 rounded md:col-span-2" rows="4" />

      <button
        type="submit"
        className="md:col-span-2 bg-blue-600 text-white py-2 rounded"
      >
        {submitText}
      </button>
    </form>
  );
}
