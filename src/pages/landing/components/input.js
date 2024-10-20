export const Input = ({ label, text, disabled, error, value, onChange, onBlur, errorText, placeholder, textArea, noBorder, className, name }) => {
    return (
        <div className={`flex flex-col items-start gap-2 w-full ${className}`}>
            <label className="text-xs font-medium">
                {label}
            </label>
            {textArea ?
                <textarea
                    rows={9}
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={` ${disabled ? "bg-hck-grey-50 text-hck-grey-400 border-hck-borderDarkGrey" : "bg-hck-white text-hck-black"}
                ${error ? "border-hck-red text-hck-red" : ""} 
                ${noBorder ? "" : "border border-x-[1px] border-b-[2px] border-t-[1px]"} text-sm font-light p-4 rounded-[4px] w-full outline-none focus:border-hck-main`}
                    placeholder={placeholder}
                >

                </textarea>
                :
                <input
                    name={name}
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`${disabled ? "bg-hck-grey-50 text-hck-grey-400 border-hck-borderDarkGrey" : " text-hck-black"}
                ${error ? "border-hck-red text-hck-red border border-x-[1px] border-b-[2px] border-t-[1px]" : ""} 
                ${noBorder ? "bg-hck-grey-50" : "border border-x-[1px] border-b-[2px] border-t-[1px]"} text-sm font-light p-4 rounded-[4px] w-full outline-none focus:border-hck-main`}
                    placeholder={placeholder}
                >
                    {text}
                </input>}
            {error ? errorText ? (
                <div className='flex items-center pt-1'>
                    <p className='text-xs text-hck-red300'>{errorText}</p>
                </div>
            ) : null : null}
        </div>
    )
}