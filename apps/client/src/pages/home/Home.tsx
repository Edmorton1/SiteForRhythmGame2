//prettier-ignore
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePosts } from "./usePosts";

interface Post {
	id: number;
	title: string;
}

export default function Home() {
	const { mutate, isPending } = useMutation({
		mutationKey: ["add post"],
		mutationFn: async (newPost: Post) =>
			fetch("https://jsonplaceholder.typicode.com/posts/", {
				method: "POST",
				body: JSON.stringify(newPost),
			}),
	});

	const { data, isSuccess } = usePosts();

	const queryClient = useQueryClient();

	const isFetch = useIsMutating();
	console.log(isFetch);

	return (
		<>
			<button
				disabled={isPending}
				onClick={() => mutate({ id: 1, title: "asdasd" })}>
				Добавить
			</button>
			<button
				onClick={() => queryClient.invalidateQueries({ queryKey: ["posts"] })}>
				Invalidate Props
			</button>
			{isSuccess && data.map(post => <div key={post.id}>{post.title}</div>)}
		</>
	);
}
