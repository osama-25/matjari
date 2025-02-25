
export default function Loading() {
    return (
        <div data-testid="loading" className='max-w-screen w-screen flex space-x-2 justify-center items-center h-screen'>
            <div className='h-6 w-6 sm:h-8 sm:w-8 bg-blue-700 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-6 w-6 sm:h-8 sm:w-8 bg-blue-700 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-6 w-6 sm:h-8 sm:w-8 bg-blue-700 rounded-full animate-bounce'></div>
        </div>
    );
}
