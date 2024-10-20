export const FeatureCard = ({ icon, text, title, cardStyle }) => {
    return (
        <div className={`${cardStyle} flex flex-col rounded-[4px] bg-hck-white p-6 gap-2 w-full border border-x-[1px] border-t-[1px] border-b-[2px] border-hck-borderGrey`}>
            {icon}
            <h1 className="text-[19px] font-semibold">{title}</h1>
            <p className="text-hck-grey-400 text-[17px] font-light">{text}</p>
        </div>
    )
}