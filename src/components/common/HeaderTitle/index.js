const HeaderTitle = (props) => {
  const { userName = "", greeting = "Welcome", dashboardName = "" } = props;
  return (
    <h1>
      {greeting}, {dashboardName ? dashboardName : userName + "!👋"}
    </h1>
  );
};

export default HeaderTitle;
