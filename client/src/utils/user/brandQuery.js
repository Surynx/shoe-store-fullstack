import { useQuery } from "@tanstack/react-query";
import { getAllBrandForUser } from "../../Services/user.api";

export default function brandQuery() {

    const { data, isLoading } = useQuery({
    queryKey: ["brandList"],
    queryFn: getAllBrandForUser,
    });

    return {data,isLoading}
}


