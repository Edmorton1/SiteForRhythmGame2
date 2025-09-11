import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface Post {
	id: number;
	title: string;
}

const getData = async () => {
	console.log("ПОШЁЛ ЗАПРОС");
	const res = await fetch(`https://jsonplaceholder.typicode.com/posts/`);

	return res.json();
};

export const usePosts = () => {
	const result = useQuery<Post[]>({
		queryKey: ["posts"],
		queryFn: getData,
		initialData: [
			{ id: 1, title: "asdasd" },
			{ id: 2, title: "asdasd" },
		],
		staleTime: 10000,
	});
	console.log(result.data, result.error, result.isSuccess);

	useEffect(() => {
		if (result.isSuccess) console.log("Data succes");
	}, [result.isSuccess]);

	useEffect(() => {
		if (result.isError) console.log("Data succes");
	}, [result.isError]);

	return result;
};
