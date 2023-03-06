import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import Navbar from "../components/Navbar";
import UsersNav from "../components/UsersNav";
import { Grid, GridItem } from "@chakra-ui/react";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";

export default function home() {
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
          <GridItem as="aside" className="col-span-6 sm:col-span-2 bg-sky-900">
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
