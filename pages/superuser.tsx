//@ts-nocheck
export async function getServerSideProps(context) {
    let res = await fetch("http://localhost:3000/api/handler", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let complaints = await res.json();

    return {
        props: { complaints },
    };
}
const [postsState, setPostsState] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  
return (
    <div className="container">
        <div>
            <div>
                {postsState.map((post, index) => {
                    return (
                        <div className="card" key={index}>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
);
