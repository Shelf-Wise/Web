import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockKeyhole, User, Mail } from "lucide-react";

export function Registration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="poppins-bold text-xl">Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="poppins-regular">
          <div className="w-full flex flex-col gap-1 gap-4 ">
            <div className="flex flex-col gap-2  justify-start">
              <Label htmlFor="name" className="text-sm">
                Full Name
              </Label>
              <div className="flex flex-row items-center gap-1 pl-2 justify-between border rounded-2xl">
                <User width={15} />
                <Input
                  id="name"
                  type="name"
                  className=" border-none p-0 outline-none ring-0 rounded-2xl w-52 h-8"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-start">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <div className="flex flex-row items-center gap-1 pl-2 justify-between border rounded-2xl">
                <Mail width={15} />
                <Input
                  id="email"
                  type="email"
                  className=" border-none p-0 outline-none ring-0 rounded-2xl w-52 h-8"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <div className="flex flex-row items-center gap-1 pl-2 justify-between border rounded-2xl">
                <LockKeyhole width={15} />
                <Input
                  id="password"
                  type="password"
                  className=" border-none p-0 outline-none ring-0 rounded-2xl  w-52 h-8"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <Button variant={"default"} size={"lg"}>
                Register
              </Button>{" "}
              <p className="poppins-regular text-[11px] text-slate-400 pt-1">
                Already have an Account?{" "}
                <span className="text-[#D82727] cursor-pointer">Login</span>
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
