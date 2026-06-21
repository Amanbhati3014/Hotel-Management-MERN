import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

function Admin() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    roomNumber: "",
    capacity: "",
  });

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const decodedUser = token ? decodeToken(token) : null;
  const user = storedUser || decodedUser;
  const isAdmin =
    localStorage.getItem("role") === "admin" ||
    user?.role === "admin";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      return;
    }

    fetchRooms();
  }, [isAdmin, navigate, token]);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/api/rooms");
      setRooms(Array.isArray(res.data) ? res.data : res.data.rooms || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  const reset = () => {
    setEditingId(null);
    setImages([]);
    setForm({
      title: "",
      description: "",
      price: "",
      roomNumber: "",
      capacity: "",
    });
  };

  const submitRoom = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      images.forEach((img) => data.append("images", img));

      if (editingId) {
        await api.put(`/api/rooms/${editingId}`, data);
      } else {
        await api.post("/api/rooms", data);
      }

      reset();
      fetchRooms();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Room save failed");
    }
  };

  const deleteRoom = async (id) => {
    try {
      await api.delete(`/api/rooms/${id}`);
      fetchRooms();
    } catch (err) {
      console.log(err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">Access denied</p>
          <h1 className="mt-4 text-3xl font-black">Admin only area</h1>
          <p className="mt-3 text-gray-400">
            You are logged in, but your account does not have admin permissions.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-slate-950 text-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-yellow-300">Admin Dashboard</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black">Manage rooms</h1>
          <p className="mt-3 text-gray-400">Create, update, and delete rooms with a compact admin UI.</p>
        </div>

        <form
          onSubmit={submitRoom}
          className="mb-10 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl md:grid-cols-2"
        >
          <input
            name="title"
            placeholder="Room Title"
            value={form.title}
            onChange={handleChange}
            className="rounded-xl bg-black/30 p-3 outline-none ring-1 ring-white/10"
          />
          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="rounded-xl bg-black/30 p-3 outline-none ring-1 ring-white/10"
          />
          <input
            name="roomNumber"
            placeholder="Room Number"
            value={form.roomNumber}
            onChange={handleChange}
            className="rounded-xl bg-black/30 p-3 outline-none ring-1 ring-white/10"
          />
          <input
            name="capacity"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            className="rounded-xl bg-black/30 p-3 outline-none ring-1 ring-white/10"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="min-h-28 rounded-xl bg-black/30 p-3 outline-none ring-1 ring-white/10 md:col-span-2"
          />
          <input
            type="file"
            multiple
            onChange={handleImage}
            className="md:col-span-2"
          />
          <div className="flex gap-3 md:col-span-2">
            <button className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black">
              {editingId ? "Update Room" : "Create Room"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-xl text-black"
            >
              <div className="bg-slate-100">
                {room.images?.[0] ? (
                  <img
                    src={`http://localhost:5000${room.images[0]}`}
                    alt={room.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="grid h-44 place-items-center bg-slate-200 text-slate-500">
                    No image
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <h2 className="text-xl font-bold">{room.title}</h2>
                  <p className="mt-1 max-h-12 overflow-hidden text-sm text-gray-500">{room.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 text-sm font-semibold text-gray-700">
                  <span className="rounded-full bg-gray-100 px-3 py-1">Rs. {room.price}</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1">Room {room.roomNumber}</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1">People {room.capacity}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(room._id);
                      setForm({
                        title: room.title,
                        description: room.description,
                        price: room.price,
                        roomNumber: room.roomNumber,
                        capacity: room.capacity,
                      });
                    }}
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRoom(room._id)}
                    className="flex-1 rounded-xl bg-red-500 py-2.5 font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
