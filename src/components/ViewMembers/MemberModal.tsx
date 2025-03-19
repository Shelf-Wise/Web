import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  useAddMemberMutation,
  useGetMemberByIdQuery,
  useUpdateMemberMutation,
} from "@/state/member/MemberApiSlice";
import { useEffect, useState } from "react";
import { useUploadBlobMutation } from "@/state/image/imageApiSlice";
import { Loader2 } from "lucide-react";

const memberFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  nic: z.string().min(1, "NIC is required"),
  telephone: z.string().min(1, "Phone number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  imageUrl: z.any(),
});

interface MemberModalProps {
  open: boolean;
  openChange: (open: boolean) => void;
}

type MemberForm = z.infer<typeof memberFormSchema>;

export const MemberModal: React.FC<MemberModalProps> = ({
  open,
  openChange,
}) => {
  const [addMember] = useAddMemberMutation();
  const [memberId, setMemberId] = useState<string | null>(null);
  const { data: memberData } = useGetMemberByIdQuery(memberId ?? "", {
    skip: !memberId,
  });
  const [updateMember] = useUpdateMemberMutation();
  const [uploadBlob, { isLoading: uploadingImage }] = useUploadBlobMutation();
  const [previewUrl, setPreviewUrl] = useState<string>(
    "https://ui.shadcn.com/placeholder.svg"
  );

  const form = useForm<MemberForm>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      fullName: "",
      address: "",
      email: "",
      nic: "",
      telephone: "",
      dob: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    const newUrlSearchParams = new URLSearchParams(window.location.search);
    const modalParam = newUrlSearchParams.get("modal");
    const modalParamId = newUrlSearchParams.get("id");
    console.log(modalParam, modalParamId);
    if (modalParam === "add-member") {
      openChange(true);
    } else if (modalParam === "edit-member" && modalParamId) {
      setMemberId(modalParamId);
      openChange(true);
      console.log(memberData);
      form.reset({
        fullName: memberData?.value.fullName ?? "HII",
        address: memberData?.value.address ?? "",
        email: memberData?.value.email ?? "",
        nic: memberData?.value.nic ?? "",
        telephone: memberData?.value.telephone ?? "",
        dob: memberData?.value.dob ?? "",
        imageUrl: memberData?.value.imageUrl ?? "",
      });
      
      if (memberData?.value.imageUrl) {
        setPreviewUrl(memberData.value.imageUrl);
      }
      
      console.log("form", form);
    }
  }, [memberData]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const imageData = new FormData();
        imageData.append('file', file);

        const result = await uploadBlob(imageData).unwrap();

        if (result?.url) {
          form.setValue("imageUrl", result.url);
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  const onSubmit: SubmitHandler<MemberForm> = async (data) => {
    console.log(data);
    console.log(form.getValues());

    const memberData = {
      ...data,
      imageUrl: data.imageUrl || previewUrl
    };

    if (memberId && memberId !== null) {
      await updateMember({ id: memberId, ...memberData }).unwrap();
    } else {
      await addMember(memberData).unwrap();
    }
    openChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[925px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {memberId && memberId !== null ? "Edit Member" : "Add Member"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {memberId && memberId !== null ? "Edit Member" : "Add a new member"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className=" gap-4 py-4 flex">
              <div>
                <img
                  src={previewUrl}
                  alt="Member Profile"
                  width={400}
                  className="rounded-full"
                />
              </div>

              <Separator orientation="vertical" />
              
              <div className="space-y-4">
                {/* fullName */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 ">
                      <FormLabel htmlFor="name" className="text-right">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Harry Potter"
                          {...field}
                          className="col-span-3 text-muted-foreground"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 ">
                      <FormLabel htmlFor="address" className="text-right">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="address"
                          {...field}
                          placeholder="202 Beach Road, Matale, Sri Lanka"
                          className="col-span-3 text-muted-foreground"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel htmlFor="email" className="text-right">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          {...field}
                          placeholder="example@localhost.com"
                          className="col-span-3 text-muted-foreground"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* nic */}
                <FormField
                  control={form.control}
                  name="nic"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel htmlFor="nic" className="text-right">
                        NIC
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="nic"
                          {...field}
                          placeholder="200214900000"
                          className="col-span-3 text-muted-foreground"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* phone */}
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel htmlFor="phone" className="text-right">
                        Telephone
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="phone"
                          {...field}
                          placeholder="0769937578"
                          type="tel"
                          className="col-span-3 text-muted-foreground"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* dob */}
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel htmlFor="dob" className="text-right">
                        Date Of Birth
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          id="dob"
                          className="col-span-3 text-muted-foreground"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* imageUrl */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel htmlFor="imageUrl" className="text-right">
                    Profile
                  </FormLabel>
                  <div className="col-span-3">
                    <Input
                      type="file"
                      accept="image/*"
                      id="imageUrl"
                      onChange={handleImageChange}
                      className="text-muted-foreground"
                    />
                    {uploadingImage && (
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading image...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => openChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || uploadingImage}>
                {form.formState.isSubmitting || uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {memberId ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  memberId ? "Update Member" : "Add Member"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}