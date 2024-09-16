import axios from "axios";


export default async function checkLogin(path, router) {

    try {
        const token = localStorage.getItem("token");

        console.log(token);

        if (token) {
            // Check login status by sending the JWT token in the Authorization header
            console.log("HIT THIS");
            const res = await axios.get('http://localhost:8080' + path, { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("hit that");





            if (res.status === 200) {
                // User is authenticated, redirect to home or another protected page
                router.push(path);
            }
            else
                router.push('/login');
        }



    } catch (err) {
        router.push('/login');
        console.log("Error checking login status:", err);
    }
};


