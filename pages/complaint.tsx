import type { NextPage } from "next";

import Link from "next/link";
import {useRouter} from "next/router";

const Complaint: NextPage = () => {
    const router = useRouter();
    const languageFrom = router.query.languageFrom
        ? router.query.languageFrom
        : "JavaScript";
    const languageTo = router.query.languageTo ? router.query.languageTo : "Python";
    


    return (
        <>
            <h1>Submit a Complaint here</h1>
            <h2>
                <Link
                    href={{
                        pathname: "/",
                        // query: { languageFrom, languageTo },
                    }}
                >
                    <button
                        // onClick={}
                        // style={}
                        className="btn"
                    >
                        Make another translation
                    </button>
                </Link>
            </h2>

            <h1>
                These are the languages you used: {languageFrom} & {languageTo}
            </h1>
        </>
    );
};


export default Complaint;
