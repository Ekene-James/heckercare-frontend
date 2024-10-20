import { useEffect, useRef, useState } from "react";
import { Input } from "../../components/input"
import { useForm } from "../../hooks/useForm"
import emailjs from '@emailjs/browser';

export const Experience = () => {

    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regName = /^[A-Za-z]+$/;
    let regTel = /^[0-9]+$/;

    const isValidName = (value) => (value.trim() !== '' && value.trim() !== null && regName.test(value))
    const isValidEmail = (value) => (value.trim() !== '' && value.trim() !== null && regEmail.test(value))
    const isValidTel = (value) => (value.trim() !== '' && value.trim() !== null && value.length == 10 && regTel.test(value))
    const isEmpty = (value) => (value.trim() !== '' && value.trim() !== null)

    const [disabled, setDisabled] = useState(true)

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

    const {
        value: enteredMessage,
        hasError: messageError,
        isValid: messageIsValid,
        valueChangeHandler: messageChangeHandler,
        inputBlurHandler: messageBlurHandler,
        reset: resetMessage
    } = useForm(isEmpty)

    const {
        value: enteredCompanyName,
        hasError: companyNameError,
        isValid: companyNameIsValid,
        valueChangeHandler: companyNameChangeHandler,
        inputBlurHandler: companyNameBlurHandler,
        reset: resetCompanyName
    } = useForm(isEmpty)

    const form = useRef();

    const sendEmail = (event) => {
        event.preventDefault();
        emailjs.sendForm(
            'service_8r6kt9l', 
            'template_ker34bf', 
            form.current, 
            '9zysICIynyFBrrPzO'
            ).then((result) => {

                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            }
        );
        event.target.reset()
        resetEmail();
        resetCompanyName();
        resetName();
        resetTel();
        resetMessage()
    }

    return (
        <section id="contact" className="lg:px-[120px] px-6 bg-hck-grey-100 lg:pt-[100px] pt-[100px]">
            <div className="border-x-[1px] border-b-[2px] border-t-[1px] border-hck-borderLightGrey flex flex-col lg:flex-row lg:items-center bg-hck-grey-50 rounded-xl lg:p-10 p-6 space-y-4">
                <div className="lg:w-2/5 space-y-4">
                    <h1 className='lg:text-5xl text-2xl font-light'>Experience the future of healthcare management</h1>
                    <p className="text-hck-grey-500 text-base font-light">Unlock Efficiency, Excellence and streamlined healthcare management with HeckerCare.</p>
                </div>

                <div className="bg-hck-white rounded-lg p-6 space-y-6 lg:w-3/5 border border-hck-borderGrey">
                    <span className="text-hck-green-400 bg-hck-green-100 border-x-[1px] border-b-[2px] border-t-[1px] border-hck-borderLightGrey px-1 py-[2px] rounded-[4px] text-thin">REQUEST DEMO</span>
                    <form ref={form} onSubmit={sendEmail} className="lg:grid lg:grid-cols-2 flex flex-col gap-4">
                        <Input
                            label="Full Name"
                            value={enteredName}
                            onChange={nameChangeHandler}
                            onBlur={nameBlurHandler}
                            placeholder="Enter your full name"
                            // error={nameError}
                            name="user_name"
                        />
                        <Input
                            label="Phone Number"
                            value={enteredTel}
                            onChange={telChangeHandler}
                            onBlur={telBlurHandler}
                            placeholder="Enter your phone number"
                            // error={telError}
                            name='user_phone'
                        />
                        <Input
                            label="Email Address"
                            value={enteredEmail}
                            onChange={emailChangeHandler}
                            onBlur={emailBlurHandler}
                            placeholder="Enter your email address"
                            // error={emailError}
                            name='user_email'
                        />
                        <Input
                            label="Hospital/Organization Name"
                            value={enteredCompanyName}
                            onChange={companyNameChangeHandler}
                            onBlur={companyNameBlurHandler}
                            placeholder="Enter your hospital name"
                            // error={companyNameError}
                            name='user_company'
                        />
                        <textarea
                            label="Message"
                            value={enteredMessage}
                            onChange={messageChangeHandler}
                            onBlur={messageBlurHandler}
                            placeholder="Enter your message"
                            // error={messageError}
                            className={`bg-hck-white text-hck-black
                            border border-x-[1px] border-b-[2px] border-t-[1px] text-sm font-light p-4 rounded-[4px] w-full outline-none focus:border-hck-main col-span-2`}
                            name='user_message'
                            rows={9}
                        />
                        <button type="submit" className="px-[16px] py-[8px] bg-hck-black w-[180px] text-hck-white rounded-[4px] flex items-center justify-center">Request Demo →</button>
                    </form>
                </div>
            </div>

        </section>
    )
}