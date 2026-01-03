function Header() {
  return (
    <>
      <header
        className="text-black bg-blue-400 flex justify-center py-2 mb-2 "
        role="banner"
        aria-label="Dashboard header"
        style={{ width: "100%" }}
      >
        <h1 className="flex">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "8px" }}
            aria-hidden="true"
            role="img"
            aria-label="Dashboard icon"
          >
            <path
              d="M12 2v8M12 14v8M4.93 4.93l5.66 5.66M13.41 13.41l5.66 5.66M2 12h8M14 12h8M4.93 19.07l5.66-5.66M13.41 10.59l5.66-5.66"
              stroke="#29d952"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-bold">Sales Team Dashboard</span>
        </h1>
      </header>
    </>
  );
}

export default Header;
