import { Health } from "../../assets/icons/generated"
import { WhyCard } from "./whyCard"
import why1 from '../../assets/why1.png'
import why2 from '../../assets/why2.png'
import why3 from '../../assets/why3.png'
import why4 from '../../assets/why4.png'
import why5 from '../../assets/why5.png'

export const Why = () => {
    return (
        <section id="solutions" className="flex flex-col items-center lg:px-[120px] px-6 bg-hck-grey-100 lg:pt-[100px] pt-[100px]">
            <h1 className='lg:text-5xl text-3xl font-light pb-[50px]'>Why choose <span className="text-hck-main">HeckerCare <Health className="inline" /></span></h1>
            <div className="grid lg:grid-cols-6 grid-rows-3 lg:h-[818px] gap-6">
                <WhyCard cardStyle="lg:col-span-2 lg:row-span-2" title="Error Reduction & Patient Safety" bg={why1} text="Ensure precision in patient care through automated processes, reducing the risk of errors." />
                <WhyCard cardStyle="lg:col-span-4" title="Increased Efficiency & Productivity" bg={why2} text="Streamline administrative tasks and workflows, allowing your staff to focus on providing quality patient care." />
                <WhyCard cardStyle="lg:col-span-2" title="Enhanced Communication & Collaboration" bg={why3} lightBg text="Facilitate seamless communication among healthcare professionals" />
                <WhyCard cardStyle="lg:col-span-2 lg:row-span-2" title="Revenue Boost through Efficient Billing" bg={why5} text="Maximize revenue by simplifying billing processes, reducing billing errors, and ensuring timely claim submissions and reimbursements." />
                <WhyCard cardStyle="lg:col-span-4" lightBg title="Regulatory Compliance Assurance" bg={why4} text="Stay up-to-date with evolving healthcare regulations and standards." />
            </div>
        </section>
    )
}