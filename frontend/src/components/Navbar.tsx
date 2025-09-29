import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-between max-w-[500px] bg-gray-200 m-5 rounded-full">
      <button className="rounded-full bg-blue-300 w-[40px] h-[40px]">+</button>
      <h2 className="my-2">Meal.io</h2>
      <button className="rounded-full bg-blue-300 w-[40px] h-[40px]">+</button>
    </div>
  );
};

export default Navbar;
