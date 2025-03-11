import { Registration } from "@/components/auth/Registration"

export const RegistrationPage = () => {
    return (
        <div className="w-screen h-screen flex justify-end pt-20 pr-44 overflow-hidden" style={{ backgroundImage: "url(./auth-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
            <div className="flex justify-end p-10 items-start">
                <Registration />
            </div>
        </div>
    )
}