import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card"
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const PageNotFound = () => {
    const [currentYear, setCurrentYear] = useState('');

    useEffect(() => {
        setCurrentYear(new Date().getFullYear().toString());
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-primary/70 p-4">
            <Card className="shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] border-2 border-gray-800 w-full max-w-2xl rounded-none bg-[#c0c0c0]">
                {/* Windows Title Bar */}
                <div className="bg-linear-to-r from-[#000080] to-[#1084d0] h-8 w-full flex items-center justify-between px-2 border-b-2 border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-6 bg-red-500 flex items-center justify-center relative">
                            <X size={14} className="text-white font-extrabold" />
                        </div>
                        <span className="text-sm font-bold text-white">404 - Page Not Found</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="h-5 w-6 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center text-xs font-bold hover:bg-gray-300 active:border-gray-800 active:border-t-gray-400 active:border-l-gray-400">
                            _
                        </button>
                        <button className="h-5 w-6 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center text-xs font-bold hover:bg-gray-300 active:border-gray-800 active:border-t-gray-400 active:border-l-gray-400">
                            □
                        </button>
                        <button className="h-5 w-6 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center text-xs font-bold hover:bg-red-600 hover:text-white active:border-gray-800 active:border-t-gray-400 active:border-l-gray-400">
                            ✕
                        </button>
                    </div>
                </div>

                {/* Error Icon and Message */}
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="shrink-0">
                            <div className="h-16 w-16 bg-red-600 flex items-center justify-center border-2 border-gray-800">
                                <X size={40} className="text-white font-extrabold" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">The page cannot be found</h1>
                            <div className="space-y-2 text-gray-800">
                                <p>• The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                                <p>• Check the URL for proper spelling and capitalization.</p>
                                <p>• Click the <span className="font-bold">Reload</span> button to refresh the page.</p>
                                <p>• Click the <span className="font-bold">Go Back</span> button to return to the previous page.</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Details (Windows Style) */}
                    <div className="mt-6 bg-gray-100 border-2 border-gray-800 p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-gray-900">Error Code:</span>
                            <code className="text-sm bg-white border border-gray-400 px-2 py-1">404_NOT_FOUND</code>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">Module:</span>
                            <span className="text-sm text-gray-800">WEB_BROWSER</span>
                        </div>
                    </div>
                </div>

                {/* Buttons (Windows Style) */}
                <CardFooter className="flex justify-end gap-3 p-4 bg-[#c0c0c0] border-t-2 border-gray-800">
                    <Button
                        className="h-8 px-6 border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 bg-[#c0c0c0] text-gray-900 font-bold hover:bg-gray-300 active:border-gray-800 active:border-t-gray-400 active:border-l-gray-400 rounded-none shadow-none"
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        &nbsp;&nbsp;Reload&nbsp;&nbsp;
                    </Button>
                    <Button
                        className="h-8 px-6 border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 bg-[#c0c0c0] text-gray-900 font-bold hover:bg-gray-300 active:border-gray-800 active:border-t-gray-400 active:border-l-gray-400 rounded-none shadow-none"
                        onClick={() => {
                            window.history.back();
                        }}
                    >
                        &nbsp;Go Back&nbsp;
                    </Button>
                    <Button
                        className="h-8 px-6 border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 bg-[#c0c0c0] text-gray-900 font-bold hover:bg-gray-300 active:border-gray-800 active:border-t-gray-400 active:border-l-gray-400 rounded-none shadow-none"
                        onClick={() => {
                            window.location.href = '/';
                        }}
                    >
                        &nbsp;Home&nbsp;
                    </Button>
                </CardFooter>
            </Card>

            {/* Windows Taskbar Style Footer */}
            <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#c0c0c0] border-t-2 border-gray-800 flex items-center justify-between px-2">
                <div className="flex items-center gap-1">
                    <button className="h-6 w-24 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center text-xs font-bold hover:bg-gray-300">
                        <span className="ml-1">Start</span>
                    </button>
                    <div className="h-6 w-48 bg-white border-2 border-gray-800 flex items-center px-2">
                        <span className="text-xs text-gray-600">Page not found - Internet Explorer</span>
                    </div>
                </div>
                <div className="h-6 w-20 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center text-xs font-bold">
                    {currentYear}
                </div>
            </div>
        </div>
    )
}

export default PageNotFound
