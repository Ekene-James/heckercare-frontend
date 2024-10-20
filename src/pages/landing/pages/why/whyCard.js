export const WhyCard = ({ text, title, cardStyle, bg, lightBg }) => {
    return (
        <div className={`${cardStyle} flex flex-col rounded-[4px] p-6 gap-2 w-full lg:h-full h-[400px] border border-x-[1px] border-t-[1px] border-b-[2px] border-hck-borderGrey`}
            style={{
                backgroundImage: `url(${bg})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                objectFit: 'contain',
            }}
        >
            <h1 className={`${lightBg ? "" : "text-hck-white"} text-[26px] font-semibold  lg:w-[302px]`}>{title}</h1>
            <p className={`${lightBg ? "text-hck-grey-600" : "text-hck-grey-300"}  text-sm font-light lg:w-[310px]`}>{text}</p>
        </div>
    )
}