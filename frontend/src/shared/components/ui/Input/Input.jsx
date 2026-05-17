import React from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';

export default function Input(props) {
  return (
    <div className="relative w-full">
      <input 
        {...props}
        className="w-full rounded-btn border border-gray-300 pl-4 pr-12 py-3 focus:outline-none focus:border-accent text-on-surface"
      />
      <button className="bg-accent text-white rounded-btn p-2 m-1 absolute right-0 top-0 hover:opacity-90 transition-opacity">
        <MagnifyingGlass size={20} weight="bold" />
      </button>
    </div>
  );
}
