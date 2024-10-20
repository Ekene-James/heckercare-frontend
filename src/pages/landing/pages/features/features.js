import { Analytics, Billing, Calendar, Documents, Drugs, Health, Lab, Manager, Medical } from "../../assets/icons/generated"
import { FeatureCard } from "./featureCard"

export const Features = () => {
    return (
        <section id="features" className="lg:px-[120px] px-6 bg-hck-grey-100 lg:pt-[300px] pt-[100px]">
            <div className="flex flex-col items-center w-full py-[50px] lg:pt-[50px] gap-3">
                <h1 className='lg:text-5xl text-3xl font-light'>Key features that transform</h1>
                <h1 className='lg:text-5xl text-3xl text-hck-main font-light'>Healthcare <Health className="inline" /> <span className="text-hck-green-400">Management <Manager className="inline" /></span></h1>
            </div>

            <div className="grid lg:grid-cols-6 gap-6">
                <FeatureCard cardStyle="lg:col-span-3" icon={<Medical />} title="Electronic Medical Records" text="Secure and accessible patient data in one place." />
                <FeatureCard cardStyle="lg:col-span-3" icon={<Lab />} title="Lab Results" text="Quick access with automatic alerts for abnormalities." />
                <FeatureCard cardStyle="lg:col-span-2" icon={<Billing />} title="Comprehensive Billing" text="Manage claims and insurance effortlessly." />
                <FeatureCard cardStyle="lg:col-span-2" icon={<Drugs />} title="Medication Management" text="Stay on top of patient prescriptions." />
                <FeatureCard cardStyle="lg:col-span-2" icon={<Calendar />} title="Streamlined Appointments" text="Intuitive calendar for efficient scheduling." />
                <FeatureCard cardStyle="lg:col-span-3" icon={<Analytics />} title="Analytics" text="Identify trends for continuous improvement." />
                <FeatureCard cardStyle="lg:col-span-3" icon={<Documents />} title="Efficient Documentation" text="Customizable templates for accurate records." />
            </div>
        </section>
    )
}