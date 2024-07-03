import {
  BellFilled,
  MessageFilled,
  QuestionCircleFilled,
  SearchOutlined,
  SunFilled,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isNotAuthenticated =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="hidden md:flex gap-8 justify-around items-center p-5 bg-white select-none w-full">
      <div
        className={`flex gap-8 w-[50%] items-center ${
          !isNotAuthenticated ? "justify-start" : "justify-center"
        }`}
      >
        <Link to="/" className="text-cyan-400 text-3xl font-bold">
          Goodold
        </Link>
        {!isNotAuthenticated && (
          <div className="application-grey p-2 rounded-xl flex items-center">
            <input
              className="application-grey outline-none ml-2 placeholder:text-sm"
              type="text"
              placeholder="Search..."
            />
            <SearchOutlined
              style={{
                paddingRight: "10px",
                cursor: "pointer",
              }}
            />
          </div>
        )}
      </div>
      {!isNotAuthenticated && (
        <div className="flex justify-evenly gap-10 items-center">
          <div className="actions flex justify-around gap-8 items-center">
            <SunFilled style={{ fontSize: "22px", cursor: "pointer" }} />
            <Link to="/chat">
              <MessageFilled style={{ fontSize: "22px", cursor: "pointer" }} />
            </Link>
            <BellFilled style={{ fontSize: "22px", cursor: "pointer" }} />
            <QuestionCircleFilled
              style={{ fontSize: "22px", cursor: "pointer" }}
            />
          </div>
          <Link
            to="/login"
            onClick={() => {
              localStorage.clear();
            }}
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}
