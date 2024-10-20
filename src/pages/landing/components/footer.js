import { useState } from 'react'
import { Discord, FooterLogo, Github, HbLogo, Linkedin, Logo, Twitter, Youtube } from '../assets/icons/generated'
import bg from '../assets/lines.svg'
import { ContactModal } from './contactModal'

export const Footer = () => {

    const [showModal, setShowModal] = useState(false)

    const toggleModal = () => {
        setShowModal(prev => !prev)
    }
    
    return (
        <footer>
            <div
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    objectFit: 'cover',
                }}
                className='h-fit py-7 px-6 lg:px-32 flex flex-col lg:flex-row justify-between gap-10'
            >
                <div className='flex flex-col gap-8'>
                    <FooterLogo />
                    <div className='flex items-center'>
                        <Twitter />
                        <Discord />
                        <Github />
                        <Linkedin />
                        <Youtube />
                    </div>
                    <span className='flex items-center gap-2'><HbLogo />Product of <br /> Heckerbella</span>
                    <p className='text-sm text-hck-grey-400'>© 2023. All rights reserved.</p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-1  gap-[50px]'>
                    <div className='flex flex-col gap-4'>
                        <h1 className='text-hck-grey-300 text-xs font-light'>PAGE LINKS</h1>
                        <a href="#home" className='text-hck-grey-400 text-sm hover:text-hck-main'>Home</a>
                        <a href="#features" className='text-hck-grey-400 text-sm hover:text-hck-main'>Features</a>
                        <a href="#solutions" className='text-hck-grey-400 text-sm hover:text-hck-main'>Solutions</a>
                        <a href="#contact" className='text-hck-grey-400 text-sm hover:text-hck-main'>Contact</a>
                    </div>

                    {/* <div className='flex flex-col gap-4'>
                        <h1 className='text-hck-grey-300 text-xs font-light'>RESOURCES</h1>
                        <a href="" className='text-hck-grey-400 text-sm hover:text-hck-main'>How to videos</a>
                        <a href="" className='text-hck-grey-400 text-sm hover:text-hck-main'>Pricing</a>
                        <a href="" className='text-hck-grey-400 text-sm hover:text-hck-main'>Early access</a>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <h1 className='text-hck-grey-300 text-xs font-light'>SECURITY</h1>
                        <a href="" className='text-hck-grey-400 text-sm hover:text-hck-main'>Report a bug issue</a>
                        <a href="" className='text-hck-grey-400 text-sm hover:text-hck-main'>Get to the team</a>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <h1 className='text-hck-grey-300 text-xs font-light'>LEGAL</h1>
                        <a href="" className='text-hck-grey-400 text-sm hover:text-hck-main'>Privacy Policy</a>
                        <a href="" className='text-hck-grey-400 text-sm hover:text-hck-main'>Terms of service</a>
                        <a href="" className='text-hck-grey-400 text-sm hover:text-hck-main'>Acceptable use policy</a>
                    </div> */}
                </div>
            </div>
            {
                showModal ?
                <ContactModal 
                    show={showModal}
                    close = {toggleModal}
                />
                :
                null
            }
        </footer>
    )
}