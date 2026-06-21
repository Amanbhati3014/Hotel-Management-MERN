import { useState } from "react";

function HotelCard({
  title,
  price,
  city,
  image,
  description,
  capacity,
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div
        className="
group
bg-white
rounded-3xl
overflow-hidden
shadow-2xl
hover:scale-105
duration-300
"
      >
        {image ? (
          <img
            src={`http://localhost:5000${image}`}
            alt={title}
            className="
h-72
w-full
object-cover
group-hover:scale-110
duration-500
"
          />
        ) : (
          <div className="grid h-72 w-full place-items-center bg-gray-200 text-gray-500">
            No image available
          </div>
        )}

        <div className="p-6">
          <h2
            className="
text-3xl
font-bold
text-black
"
          >
            {title}
          </h2>

          <p className="text-gray-500 mt-2">
            Room No:
            {city}
          </p>

          <p
            className="
text-yellow-600
text-2xl
font-bold
mt-4
"
          >
            Rs. {price}
          </p>

          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="
mt-5
w-full
bg-black
text-white
py-3
rounded-xl
hover:bg-yellow-500
"
          >
            View Details
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-yellow-600">
                  Room Details
                </p>
                <h3 className="mt-2 text-3xl font-black text-black">{title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-full bg-gray-100 px-3 py-1 text-xl font-bold text-gray-700"
                aria-label="Close details"
              >
                x
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl bg-gray-100">
              {image ? (
                <img
                  src={`http://localhost:5000${image}`}
                  alt={title}
                  className="h-56 w-full object-cover"
                />
              ) : null}
            </div>

            <div className="mt-5 space-y-3 text-gray-700">
              <p>
                <span className="font-semibold text-black">Room No:</span> {city}
              </p>
              <p>
                <span className="font-semibold text-black">Price:</span> Rs. {price}
              </p>
              {capacity ? (
                <p>
                  <span className="font-semibold text-black">Capacity:</span> {capacity}
                </p>
              ) : null}
              {description ? (
                <p className="leading-7">
                  <span className="font-semibold text-black">Description:</span>{" "}
                  {description}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setShowDetails(false)}
              className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white hover:bg-yellow-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default HotelCard;
