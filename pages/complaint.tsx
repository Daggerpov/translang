import type { NextPage } from "next";

import Link from "next/link";

const Complaint: NextPage = () => {
    return (
        <>
            <h1>Submit a Complaint here</h1>
            <h2>
                <Link href="/">
                    <a>Back to home</a>
                </Link>
            </h2>
        </>
    );
};


export default Complaint;
