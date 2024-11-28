export const MenuItem = ({ text, href }) => {
    return (
        <li>
            <a
                href={href}
                className="block p-4 text-gray-200 hover:bg-gray-700"
            >
                {text}
            </a>
        </li>
    )
}