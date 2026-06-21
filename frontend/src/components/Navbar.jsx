import { Link, useNavigate } from "react-router-dom";

function Navbar(){

const navigate =
useNavigate();

const token =
localStorage.getItem(
"token"
);



const logout=()=>{

localStorage.removeItem(
"token"
);
localStorage.removeItem(
"role"
);

navigate(
"/login"
);

window.location.reload();

};



return(

<nav
className="
bg-black
text-white
px-10
py-5
flex
justify-between
items-center
"
>

<Link
to="/"
className="
text-3xl
font-bold
text-yellow-400
"
>

LuxuryStay

</Link>



<div
className="
flex
gap-6
items-center
"
>

<Link to="/">

Home

</Link>


<Link to="/admin">

Admin

</Link>



{

token

?

<button

onClick={
logout
}

className="
bg-red-500
px-5
py-2
rounded
hover:bg-red-600
"

>

Logout

</button>

:

<Link
to="/login"
>

<button
className="
bg-yellow-500
px-5
py-2
rounded
text-black
hover:scale-105
duration-300
"
>

Login

</button>

</Link>

}

</div>

</nav>

);

}

export default Navbar;