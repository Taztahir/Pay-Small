"use client";
import React from "react";
import Image from "next/image";
import { FlutedGlass } from "@paper-design/shaders-react";
import { motion } from "motion/react";
import Link from "next/link";

const navItems = [
  { name: "Product", href: "#" },
  { name: "Customer", href: "#" },
  { name: "Solution", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Company", href: "#" },
];

export default function HeroSection7() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden antialiased [font-synthesis:none] [--color-primary:#0097AE] bg-linear-to-b from-(--color-primary) to-white">
      {/* Background Shader */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FlutedGlass
          size={0.89}
          shape="lines"
          angle={0}
          distortionShape="prism"
          distortion={0.5}
          shift={0}
          blur={0}
          edges={0.25}
          stretch={0}
          scale={1.11}
          fit="cover"
          highlights={0.1}
          shadows={0.2}
          grainMixer={0.1}
          grainOverlay={0.1}
          colorBack="#00000000"
          colorHighlight="#FFFFFF"
          colorShadow="#000000"
          className="w-full h-full bg-transparent"
        />
      </div>

      {/* Navbar */}
      <nav className="max-w-5xl mx-auto w-full flex justify-between items-center py-5 px-4 sm:px-6 relative z-10">
        <div className="font-bold text-md tracking-tight text-white">SolaceUI</div>

        <div className="items-center gap-4 hidden md:flex">
          {navItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <span className="text-sm md:text-[1rem] text-white/70 hover:text-white transition-colors">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="#">
            <button className="px-3 py-1 text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors rounded-sm cursor-pointer">
              Log in
            </button>
          </Link>
          <Link href="#">
            <button className="px-3 py-1 text-sm font-medium bg-black text-white hover:bg-black/80 transition-colors rounded-sm cursor-pointer">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-start text-center pt-20 md:pt-28 px-4 pb-0 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white  leading-[1.1] tracking-tight mb-5">
            AI Agents That Code
            <br className="hidden md:block" /> Like Your Best Engineer
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-[#FFFFFF80] font-light  max-w-lg mx-auto mb-8 leading-relaxed">
            Autonomous agents that debug, refactor, and ship features while you
            focus on architecture and strategy
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full md:w-auto">
            <button
              className="w-full sm:w-[180px] h-[48px] rounded-xl bg-black text-white   font-light text-lg md:text-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-[inset_3px_3px_3px_rgba(242,242,242,0.3),inset_-3px_-3px_3px_rgba(242,242,242,0.3)]"
            >
              Book a demo
            </button>

            <button className="w-full sm:w-[180px] h-[48px] rounded-xl border-[1.5px] border-black text-black   font-light text-lg md:text-xl transition-all hover:scale-105 active:scale-95 hover:bg-black/5 cursor-pointer">
              Try for free
            </button>
          </div>
        </motion.div>

        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto mt-16 z-20 flex justify-center px-4 md:px-0"
        >
          <div className="w-full p-2 md:p-4 bg-[#FFFFFF40] rounded-[14px] shadow-2xl">
            <div className="relative w-full rounded-[10px] overflow-hidden border border-white/20">
              <Image
                src="https://res.cloudinary.com/harshitproject/image/upload/v1774017120/hero-light.png"
                alt="Dashboard App"
                width={1200}
                height={719}
                className="w-full h-auto object-cover object-top"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Fade Gradient to mask image overflow as per original design */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 z-30 pointer-events-none bg-linear-to-t from-white to-transparent" />
    </div>
  );
}
