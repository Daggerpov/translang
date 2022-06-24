//@ts-nocheck


const [complaintState, setComplaintsState] = useState([]);
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
