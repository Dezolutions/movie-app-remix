import { ActionArgs, LoaderArgs, json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderArgs) {
  const data = await db.comment.findMany({
    where: {
      movieId: params.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return json({ data });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const message = formData.get('comment');
  const name = formData.get('name');

  if (!message || !name) {
    return json({ error: 'Both name and comment are required!' }, { status: 400 });
  }

  try {
    const data = await db.comment.create({
      data: {
        message: formData.get('comment') as string,
        movieId: formData.get('id') as string,
        name: formData.get('name') as string
      }
    })

    return json({ data });

  } catch (error) {
    return json({ error: 'An error occurred while adding the comment.' }, { status: 500 });
  }
}

export default function Comments() {
  const { id } = useParams();
  const { data } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const navigation = useNavigation();

  const formRef = useRef<HTMLFormElement>(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (navigation.state === "submitting" && formRef.current) {
      setDisabled(true)
    } else if(navigation.state === 'idle' && formRef.current) {
      setDisabled(false)
    }

    if(navigation.state === 'idle' && !actionData?.error && formRef.current) {
      formRef.current.reset()
    };

  }, [navigation.state]);

  return (
    <div className="rounded-lg border p-3">
      <h1 className="text-xl font-semibold mb-5">Your Opinion</h1>
      {actionData?.error 
        ? <p className="text-base p-2 bg-red-200 rounded-lg text-red-600">{actionData?.error}</p>
        : null
      }
      <Form method="POST" ref={formRef}>
        <input placeholder="Enter a name" type="text" name="name" className="w-full my-2 border border-teal-500 rounded-lg p-2" />
        <textarea
          name="comment"
          className="w-full border border-teal-500 rounded-lg p-2 resize-none"
          placeholder="Enter a comment"
        ></textarea>
        <input type="hidden" name="id" value={id} />
        
        <button
          type="submit"
          disabled={disabled}
          className="bg-teal-500 px-4 py-2 rounded-lg text-white disabled:opacity-50"
        >
        { navigation.state === "submitting" ? 'Loading...' : 'Add comment' }
        </button>
        
      </Form>
      
      {data.length 
        ? <>
           <h2 className="font-semibold text-xl mt-5">Reviews:</h2> 
            <div className="mt-5 flex flex-col gap-y-3">
              {data.map((post) => (
                <div key={post.id} className="border border-teal-50 p-2 rounded-lg bg-teal-50">
                  <div className="flex justify-between gap-2">
                    <p className="font-bold text-base">{post.name}</p>
                    <p className="text-sm text-gray-400 self-center">{new Date(post.createdAt).toLocaleDateString("en-US",{ year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <p>{post.message}</p>
                </div>
              ))}
            </div>
          </>
        : null}
    </div>
  );
}