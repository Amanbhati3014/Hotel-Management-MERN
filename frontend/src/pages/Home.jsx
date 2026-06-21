import { useEffect, useState } from "react";
import api from "../services/api";
import HotelCard from "../components/HotelCard";

function Home(){

const [rooms,setRooms]=useState([]);

const [search,setSearch]=useState("");

const [minPrice,setMinPrice]=useState("");

const [capacity,setCapacity]=useState("");



const fetchRooms=async()=>{

try{

const res=

await api.get(

`/api/rooms?search=${search}&minPrice=${minPrice}&capacity=${capacity}`

);

setRooms(

res.data.rooms || []

);

}

catch(err){

console.log(err);

}

};



useEffect(()=>{

fetchRooms();

},

[search,minPrice,capacity]);



return(

<div className="bg-gray-950 min-h-screen text-white">


{/* HERO */}

<div
className="
h-[70vh]
flex
flex-col
justify-center
items-center
text-center
px-8
"
>

<h1
className="
text-7xl
font-black
bg-gradient-to-r
from-yellow-300
to-orange-500
bg-clip-text
text-transparent
"
>

Stay Beyond Luxury

</h1>


<p
className="
mt-6
text-xl
text-gray-400
max-w-2xl
"
>

Discover premium rooms with world-class comfort.

</p>

</div>




{/* FILTER */}

<div
className="
max-w-6xl
mx-auto
mb-16
bg-white/10
backdrop-blur-lg
rounded-3xl
p-8
grid
md:grid-cols-3
gap-5
"
>

<input
placeholder="Search Rooms"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="
bg-black/30
rounded-xl
p-4
outline-none
"
/>


<input
placeholder="Minimum Price"
value={minPrice}
onChange={(e)=>setMinPrice(e.target.value)}
className="
bg-black/30
rounded-xl
p-4
outline-none
"
/>


<input
placeholder="Capacity"
value={capacity}
onChange={(e)=>setCapacity(e.target.value)}
className="
bg-black/30
rounded-xl
p-4
outline-none
"
/>

</div>




{/* GRID */}

<div
className="
max-w-7xl
mx-auto
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
gap-10
pb-20
px-8
"
>

{

rooms.map(

(room)=>(

<HotelCard

key={room._id}

title={room.title}

price={room.price}

city={room.roomNumber}

image={room.images?.[0]}

description={room.description}

capacity={room.capacity}

/>

)

)

}

</div>

</div>

);

}

export default Home;
