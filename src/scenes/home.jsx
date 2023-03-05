import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import Navbar from "../components/Navbar";
import UsersNav from "../components/UsersNav";
import { Grid, GridItem } from "@chakra-ui/react";

export default function home() {
  return (
    <Grid>
      <GridItem as="main" className="pt-5">
        <Navbar />
        <UsersNav />
        <GridItem
          as="aside"
          templateColumns="repeat(6, 1fr)"
          bg="purple.400"
          p="30px"
          className="min-h-screen"
        ></GridItem>
      </GridItem>
    </Grid>
  );
}
