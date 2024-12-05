import { TypeAnimation } from "react-type-animation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import Scene from '@/components/ui/Doughnut'
// import Footer from "@/MyComponents/Footer";
declare global {
    namespace JSX {
      interface IntrinsicElements {
        'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { url: string };
      }
    }
  }
  
//----------------------------------------------------------------------------------------------------

export default function Homepage() {
    return (
        <div>
            <div className="flex justify-between">
                <div><Navbar_left /></div>
                <div><Navbar_right /></div>
            </div>
            <Hero_Header />
            {/* <Footer></Footer> */}
        </div>
    );
}

export function Hero_Header() {
    return (
        <div
            className="flex justify-center h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/backgroundHeroHeader.jpg')" }}
        >
            <Hero_Header_heading />
            {/* <Image_hero /> */}
            {/* <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js"></script>
            <spline-viewer url="https://prod.spline.design/7PUiaFEw5XZbxYNM/scene.splinecode"></spline-viewer> */}
        </div>
    );
}

export function Hero_Header_heading() {
    const navigate = useNavigate();

    const handleMapClick = () => {
        navigate('/images');
    };

    return (
        <div className="w-1/2 flex items-center justify-center">
            <div className="text-center">
            <div className="w-1/2 mx-auto h-1 bg-white rounded-full shadow-[0_10px_20px_5px_rgba(59,130,246,0.7)] mb-4"></div>
                <div className="text-8xl font-bold mb-4 ">Emerge3D</div>
                <div className="text-3xl mb-8">
                    <SubHeading />
                </div>
                <div className="flex justify-center space-x-4">
                    <Button className="text-lg font-semibold" onClick={handleMapClick}>Generate</Button>
                    <div className="p-2 pl-4 underline cursor-pointer text-lg font-semibold ">Explore</div>
                </div>
            </div>
        </div>
    );
}

const SubHeading = () => {
    return (
        <div style={{ width: '800px', margin: '0 auto' }}>
            <TypeAnimation
                sequence={[
                    'From Flat Pixels to Dynamic Depth',
                    1000,
                    'Reimagining 2D Perspectives',
                    1000,
                ]}
                wrapper="div"
                speed={50}
                style={{
                    fontSize: '1.5em',
                    display: 'inline-block',
                    whiteSpace: 'nowrap', // Keeps text formatting as-is
                    lineHeight: '1.5em', // Adds spacing between lines
                }}
                repeat={Infinity}
            />
        </div>
    );
};

export function Image_hero() {
    return (
        <div >
            {/* className="w-1/2 flex items-center justify-center" */}
            {/* <img
                className="w-[80%] h-auto object-cover"
                src="test/bbychan-fotor-bg-remover-20241030131252.png"
                alt="image"
            /> */}
           
            {/* <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js"></script>
           
           <spline-viewer url="https://prod.spline.design/7PUiaFEw5XZbxYNM/scene.splinecode"></spline-viewer> */}
           {/* <Scene></Scene> */}
        </div>
    );
}

export function Navbar_left() {
    const [active, setActive] = useState(null);

    return (
        <div className="fixed top-4 inset-x-0 max-w-4xl mt-7 ml-16 z-50 bg-white shadow-md rounded-full bg-opacity-60 border border-transparent dark:bg-black dark:border-white/[0.2] rounded-tr-none">
            <div className="flex justify-between items-center py-1 px-4">
                <img src="Logo.png" alt="Logo" className="h-12 mx-2 pl-6" // Change h-8 to h-12 for larger size
                    style={{ marginRight: 'auto', marginLeft: '0', alignSelf: 'center' }} // Align to left and center vertically
                />
                <div className="flex flex-1 justify-evenly items-center space-x-2">
                    <Link to="/" className="text-xl  font-semibold font-antialiased  text-black hover:underline">Home</Link>
                    <ScrollLink to="what-is-navix" smooth={true} duration={500} className="text-xl font-semibold  text-black cursor-pointer hover:underline">
                        What is Emerge3D
                    </ScrollLink>
                    <ScrollLink to="why-navix" smooth={true} duration={500} className="text-xl font-semibold  text-black cursor-pointer hover:underline">
                        Devs
                    </ScrollLink>
                </div>
            </div>
        </div>
    );
}
export function Navbar_right() {
    const [active, setActive] = useState(null);

    return (
        <div className="fixed top-4 right-0 w-auto mt-7 mr-16 z-50 bg-white shadow-md rounded-full bg-opacity-60 border border-transparent dark:bg-black dark:border-white/[0.2] rounded-tl-none min-w-[200px] overflow-hidden">
            <div className="flex justify-between items-center py-1 px-4 ">
                <div className="text-xl font-semibold text-black cursor-pointer hover:underline">
                    Generate
                </div>
                <Avatar>
                    <AvatarImage src="/generate.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

            </div>
        </div>
    );
}
