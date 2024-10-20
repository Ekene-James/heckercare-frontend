import { useEffect, useRef } from 'react';
import bg from '../assets/contactBG.png'
import { useForm } from '../hooks/useForm'
import { Input } from './input'


export const ContactModal = ({ close }) => {

    const scrollRef = useRef()

    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regName = /^[A-Za-z]+$/;
    let regTel = /^[0-9]+$/;

    const isValidName = (value) => (value.trim() !== '' && value.trim() !== null && regName.test(value))
    const isValidEmail = (value) => (value.trim() !== '' && value.trim() !== null && regEmail.test(value))
    const isValidTel = (value) => (value.trim() !== '' && value.trim() !== null && value.length == 10 && regTel.test(value))

    const {
        value: enteredName,
        hasError: nameError,
        isValid: nameIsValid,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        reset: resetName
    } = useForm(isValidName)

    const {
        value: enteredEmail,
        hasError: emailError,
        isValid: emailIsValid,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail
    } = useForm(isValidEmail)

    const {
        value: enteredTel,
        hasError: telError,
        isValid: telIsValid,
        valueChangeHandler: telChangeHandler,
        inputBlurHandler: telBlurHandler,
        reset: resetTel
    } = useForm(isValidTel)

    useEffect(() => {
        scrollToView()
    }, [])

    const scrollToView = () => {
        scrollRef.current?.scrollIntoView?.({ behavior: "smooth" });
    };

    return (
        <section
            ref={scrollRef}
            style={{
                backgroundImage: `url(${bg})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                objectFit: 'cover',
            }}
            className={`absolute z-[1000] lg:h-[100dvh] flex-col items-center justify-center lg:py-28 lg:px-24 p-10`}
        >
            <div className='bg-hck-white h-full w-full rounded-3xl p-6 lg:p-28 font-light flex flex-col lg:flex-row gap-8 lg:gap-[102px]'>
                <div className='flex flex-col gap-4 lg:gap-8 lg:w-3/5'>
                    <h1 className='lg:text-6xl text-3xl'>Your <span className='text-hck-main'>Heckercare</span> journey begins here.</h1>
                    <p className='lg:text-xl text-sm text-hck-grey-500'>Your free demo period will provide you with unrestricted access to the entire Heckercare system for the next 4 weeks. This is your chance to explore all the features and see the benefits firsthand.</p>
                </div>
                <div className='lg:w-2/5 space-y-4'>
                    <Input
                        label="Full Name"
                        value={enteredName}
                        onChange={nameChangeHandler}
                        onBlur={nameBlurHandler}
                        placeholder="Enter your full name"
                        error={nameError}
                        noBorder
                    />
                    <Input
                        label="Phone Number"
                        value={enteredTel}
                        onChange={telChangeHandler}
                        onBlur={telBlurHandler}
                        placeholder="Enter your phone number"
                        error={telError}
                        noBorder
                    />
                    <Input
                        label="Email Address"
                        value={enteredEmail}
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                        placeholder="Enter your email address"
                        error={emailError}
                        noBorder
                    />
                    <button className='bg-hck-main py-3 px-8 w-full text-sm lg:text-base text-hck-white rounded-lg mt-8'>Gain Access Now →</button>
                    <button onClick={close} className='bg-hck-red py-3 px-8 w-full text-sm lg:text-base text-hck-white rounded-lg mt-8'>Cancel</button>
                </div>
            </div>

        </section>
    )
}