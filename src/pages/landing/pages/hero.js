import { useState } from 'react'
import { ContactModal } from '../components/contactModal'
import bg from '../assets/heroBg.png'
import heroBg1 from '../assets/heroLines1.svg'
import heroBg2 from '../assets/heroLines2.svg'
import heroBg3 from '../assets/heroLines3.svg'
import heroBg4 from '../assets/heroLines4.svg'
import heroImg from '../assets/heroImg.png'
export const Hero = () => {

    const [showModal, setShowModal] = useState(false)

    const toggleContactModal = () => {
        setShowModal(prev => !prev)
    }

    return (
        <>
            <section id='home' className="w-full lg:h-screen h-[70dvh] lg:px-20 px-4 relative"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    objectFit: 'contain',
                }}
            >
                <div className='bg-hck-white rounded-3xl border border-x-[1px] border-t-[1px] border-b-[2px] border-hck-borderGrey flex flex-col lg:pt-[80px] pt-[40px] relative top-[100px] gap-8 overflow-hidden'>

                    <img src={heroBg1} alt="" className='w-[432px] hidden lg:block absolute left-0 top-0 opacity-40' />
                    <img src={heroBg4} alt="" className='w-[123px] lg:hidden block absolute left-0 top-0 opacity-40' />
                    <img src={heroBg2} alt="" className='w-[432px] hidden lg:block absolute right-0 top-0 opacity-40' />
                    <img src={heroBg3} alt="" className='w-[123px] lg:hidden block absolute right-0 top-0 opacity-40' />

                    <div className='flex flex-col items-center h-full lg:gap-8 gap-6'>
                        <div className='flex flex-col items-center gap-4 text-center z-10'>
                            <h1 className='lg:text-6xl text-4xl lg:w-[60%] w-[90%] font-light'>Elevate your <span className='text-hck-main'>healthcare</span> operations with <span className='text-hck-main'>HeckerCare</span>.</h1>
                            <p className='lg:text-[20px] lg:leading-6 text-sm text-hck-grey500 font-light'>Unlock Efficiency, Excellence and streamlined <br /> healthcare management with HeckerCare.</p>
                        </div>
                        <div className='flex flex-col items-center gap-4 text-center z-10'>
                            <a href='#contact' className="px-[16px] py-[8px] bg-hck-black text-hck-white w-fit rounded-[4px] flex items-center justify-center">Request Demo →</a>
                        </div>
                    </div>
                    <img src={heroImg} alt="" className='w-[1056px] self-center' />
                </div>
            </section>

            {
                showModal ?
                <ContactModal 
                    show={showModal}
                    close={toggleContactModal}
                />
                :
                null
            }
        </>
    )
}