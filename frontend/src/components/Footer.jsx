
import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-10 my-10 mt-40 mb-5 text-sm">
        {/* ---Left--- */}
        <div>
            <img className='mb-5 w-40' src={assets.logo}></img>
            <p className="w-full md:w-3/3 text-gray-700 leading-6">
            At HEALTHFOLIO, we believe that managing your health should be simple, efficient, and accessible. Our mission is to bridge the gap between patients, healthcare providers, and administrators, ensuring a seamless and transparent experience for everyone involved.
            </p>
        </div>

        {/* ---Center--- */}
        <div>
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-700">
                <a href="/">Home</a>
                <a href="/about">About Us</a>
                <a href="/contact">Contact Us</a>
                {/* <li>Privacy Policy</li> */}
            </ul>
        </div>

        {/* ---Right--- */}
        <div>
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-700">
                <li>+91-78888-80XXX</li>
                <li>healthpholio@gmail.com</li>
            </ul>
        </div>
      </div>

      <div>
        {/* Copright Text */}
        <hr/>
        <p className="py-4 text-sm text-center">Copyright 2024@ HealthFolio - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;