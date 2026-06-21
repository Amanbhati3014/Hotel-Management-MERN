import {useState}from "react";
import {useNavigate} from "react-router-dom";
import api from "../services/api";


function Login(){

const navigate = useNavigate();
const [form,setForm]=useState({email:"",password:""});
const handleChange=(e)=>{
setForm({...form,
[e.target.name]:
e.target.value
}); 
};


const handleSubmit= async(e)=>{
e.preventDefault();

try{

const res = await api.post("/api/auth/login",form);
console.log(res.data);

localStorage
.setItem(
"token",

res.data.token

);

localStorage.setItem(
"role",
res.data.user.role
);

localStorage
.setItem(

"user",
// Storing the user object as a JSON string
JSON.stringify(
res.data.user
)

);


alert(
"Login Success"
);

navigate(
"/"
);

}

catch(err){

alert(

err.response?.data?.message

||

"Login Failed"

);

}

};


return(

<div
className="
min-h-screen
flex
justify-center
items-center
bg-gray-100
"
>

<form

onSubmit={
handleSubmit
}

className="
bg-white
p-10
rounded-2xl
shadow-lg
w-[400px]
"
>

<h1
className="
text-3xl
font-bold
mb-6
"
>

Login

</h1>


<input

type="email"

name="email"

placeholder="Email"

onChange={
handleChange
}

className="
border
w-full
p-3
mb-4
rounded
"

/>


<input

type="password"

name="password"

placeholder="Password"

onChange={
handleChange
}

className="
border
w-full
p-3
mb-4
rounded
"

/>


<button

className="
w-full
bg-black
text-white
p-3
rounded
"
>

Login

</button>

</form>

</div>

);

}

export default Login;