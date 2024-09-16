"use client";
import { Button } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import axios from "axios";
import checkLogin from "../login/checklogin";
import { useEffect } from "react";
export default function TestPage() {

    useEffect(() => {
        checkLogin('/auth/test');
    }, [])
    return <>
        <h1>HI</h1>
        <Button onClick={async () => {

            checkLogin('/auth/test');
            // const data = res.data;
            // console.log("Data: ------------ : " + data.success + "   " + data.message);

        }}> CLICK </Button>
    </>
}