import React from "react";
import FavTopNav from "./TopNav";
import { Item } from "../Item";

const items = [
    { id: 1, name: 'Electronics', image: '/favicon.ico' },
    { id: 2, name: 'Fashion', image: '/favicon.ico' },
    { id: 3, name: 'Home', image: '/favicon.ico' },
    { id: 4, name: 'Books', image: '/favicon.ico' },
];

const Profile = () => {
    return (
        <>
            <FavTopNav />
            <section className="flex flex-col gap-4 my-8 mx-8 rounded-md">
                {items.map(item => (
                    <Item id={item.id} name={item.name} image={item.image}
                        price={'$$$'} chatid={item.id}
                        desc={'Some Description uyfyucytctiycciytc'} heart={true}
                    />
                ))}
            </section>
        </>
    );
}
export default Profile