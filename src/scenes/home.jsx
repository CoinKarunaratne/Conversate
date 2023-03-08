import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import UsersNav from "../components/UsersNav";
import { Grid, GridItem } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import { auth } from "../config/firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function home() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user == null) {
      navigate("/");
    }
  }, []);

  return (
    <Grid className="max-h-[100vh]">
      <GridItem as="main">
        <Navbar />
        <UsersNav />
        <Grid
          as="aside"
          templateColumns="repeat(6, 1fr)"
          className="min-h-[80vh]"
        >
          <GridItem
            as="aside"
            className="col-span-6 sm:col-span-2 bg-sky-900 h-[130vh] md:h-[80vh]"
          >
            <Sidebar />
          </GridItem>
          <GridItem
            as="aside"
            colSpan={"4"}
            background="url(https://i.pinimg.com/originals/3d/0d/f6/3d0df617979763be00dc72a01aaa6c13.jpg)"
            className="hidden sm:inline-block"
          >
            <Outlet />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
}
