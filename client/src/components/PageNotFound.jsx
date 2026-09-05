import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <div className="flex flex-col w-full h-full  items-center justify-center text-sm max-md:px-4">
            <h1 className="text-8xl md:text-9xl font-md text-slate-500">404</h1>
            <div className="h-1 w-16 rounded bg-slate-500 my-5 md:my-7"></div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800">Page Not Found</p>
           <div className="flex items-center gap-4 mt-6">
                <Link to="/" className="px-4 py-2 bg-gray-500 text-white rounded ">
                    Return Home
                </Link>

            </div>
        </div>
    );
}

export default PageNotFound


