
interface HeaderProps {

}

function Header() {
    return(
        <header className={`w-full h-[10vh] bg-gray-400/3 p-4 items-center`}>
            <img src={"/logo.svg"} className={`w-28`}/>
        </header>
    )
}

export default Header;