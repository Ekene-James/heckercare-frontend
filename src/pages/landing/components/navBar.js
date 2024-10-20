import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Logo, Menu } from "../assets/icons/generated"
import { useMediaQuery } from "../hooks/useMediaQuery"

export const NavBar = () => {

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false)

    const toggleMenu = () => {
        setShowMenu(prev => !prev)
    }

    let isMobile = useMediaQuery('(max-width: 425px)')

    const smallNav =
        <nav className="relative">
            <div className="w-full flex flex-col items-center justify-center fixed top-8 text-xs z-[60]">
                <div className="bg-hck-black px-2 py-1 flex items-center justify-between gap-2 rounded-lg">
                    <span className="px-[16px] py-[8px] bg-hck-main w-[141px] rounded-[4px] flex justify-center items-center text-hck-white gap-1 font-bold"><Logo />Heckercare</span>
                    <a href="#contact" className="px-[16px] py-[8px] flex-1 bg-hck-white w-fit rounded-[4px] flex items-center justify-center">Request Demo</a>
                    <Menu onClick={toggleMenu} />
                </div>
            </div>
            <div className={`${showMenu ? 'right-[0px] block top-0' : 'right-[-490px] hidden'} bg-hck-black w-[100vw] absolute h-[100vh] text-hck-white font-normal text-sm z-[100]`}>
                <ul className={`${showMenu ? 'right-[0px] block' : 'right-[-490px] hidden'} flex flex-col items-center justify-center gap-4 bg-hck-main w-4/5 h-full p-8 absolute transition-all top-0 duration-500 ease-in`}>
                    <li onClick={toggleMenu} ><a href="#home">Home</a></li>
                    <li onClick={toggleMenu} ><a href="#features">Features</a></li>
                    <li onClick={toggleMenu} ><a href="#solutions">Solutions</a></li>
                    <li onClick={toggleMenu} ><a href="#contact">Contact</a></li>
                </ul>
            </div>
        </nav>

    const bigNav = <nav className="w-full flex items-center justify-center fixed top-8 z-[60]">
        <div className="bg-hck-black py-1 px-[5px] flex justify-between gap-8 rounded-lg">
            <a href="#hero" className="px-[10px] py-[11px] bg-hck-main w-[141px] rounded-[4px] flex justify-center items-center text-hck-white gap-1 font-bold"><Logo />Heckercare</a>
            <ul className="flex items-center justify-center text-hck-white font-normal text-sm gap-8">
                <div><a href="#home">Home</a></div>
                <div><a href="#features">Features</a></div>
                <div><a href="#solutions">Solutions</a></div>
                <div><a href="#contact">Contact</a></div>
            </ul>
            <a href="#contact" className="px-[16px] py-[8px] bg-hck-white w-fit rounded-[4px] flex items-center justify-center">Request Demo</a>
        </div>
    </nav>

    return (
        <>
            {isMobile ? smallNav : bigNav}
        </>
    )
}