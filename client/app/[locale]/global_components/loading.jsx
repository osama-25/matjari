
export default function Loading() {
    return (
        <div className='w-screen flex space-x-2 justify-center items-center h-screen'>
            <div className='h-8 w-8 bg-blue-700 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-8 w-8 bg-blue-700 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-8 w-8 bg-blue-700 rounded-full animate-bounce'></div>
        </div>
    );
}
