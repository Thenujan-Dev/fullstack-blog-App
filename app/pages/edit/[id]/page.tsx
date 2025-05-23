import EditBlog from "@/app/components/EditBlog";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  return <EditBlog id={params.id} />;
};

export default Page;
