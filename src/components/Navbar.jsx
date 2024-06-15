import {
  BellFilled,
  MessageFilled,
  QuestionCircleFilled,
  SearchOutlined,
  SunFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function Navbar() {
  const userId = localStorage.getItem("userId");

  return (
    <div className="hidden md:flex gap-8 justify-around items-center p-5 bg-white select-none w-full">
      <div
        className={`flex gap-8 w-[50%] items-center ${
          userId ? "justify-start" : "justify-center"
        }`}
      >
        <div className="text-cyan-400 text-3xl font-bold">Sociopedia</div>
        {userId && (
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
      {userId && (
        <div className="flex justify-evenly gap-10 items-center">
          <div className="actions flex justify-around gap-8 items-center">
            <SunFilled style={{ fontSize: "22px", cursor: "pointer" }} />
            <MessageFilled style={{ fontSize: "22px", cursor: "pointer" }} />
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
