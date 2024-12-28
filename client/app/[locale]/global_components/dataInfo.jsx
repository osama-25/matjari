"use client";


const getInfo = async () => {
    try {


        const token = localStorage.getItem('token'); // Adjust based on where your token is stored

        console.log("token: " + token);
        if (!token) {

            console.log("No token found");
            return;
        }

        const response = await fetch("http://localhost:8080/data/get", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch token info");
        }

        const data = await response.json(); // Parse the JSON response
        console.log(data);

        const info = data.user;

        return info;

    } catch (error) {
        //console.error("Error fetching token info:", error);
        throw new Error("Failed to fetch token info");
        // setError(error.message); // Set error state
    }

}


const modifyData = async (info) => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch("http://localhost:8080/data/modify", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: info.email,
                user_name: info.user_name,
                fname: info.fname,
                lname: info.lname,
                phone_number: info.phone_number // Include phone_number in the modification
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data modified successfully:", data);
    } catch (error) {
        console.error("Error modifying data:", error);
    }
};

// Call the function when needed
export { modifyData, getInfo };
