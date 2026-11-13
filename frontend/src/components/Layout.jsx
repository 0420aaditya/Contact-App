import Sidebar from "./Sidebar"
import Header from "./Header"

const Layout = ({ title, children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="app-main">
                <Header title={title} />
                <main className="page-content">{children}</main>
            </div>
        </div>
    )
}

export default Layout
