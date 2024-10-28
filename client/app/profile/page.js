// 'use client'
import { redirect } from 'next/navigation';
import Info from './info/page';
import axios from 'axios';

// var data;
const Profile = () => {

    // await new Promise(resolve => setTimeout(3000));
    redirect('/profile/info');
};

export default Profile;
