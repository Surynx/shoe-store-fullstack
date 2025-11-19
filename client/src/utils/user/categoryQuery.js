import { useQuery } from "@tanstack/react-query";
import { getAllCategoryForUser } from "../../Services/user.api";

export default function categoryQuery() {

    const { data, isLoading } = useQuery({
    queryKey: ["categoryList"],
    queryFn: getAllCategoryForUser,
    });

    return {data,isLoading}
}