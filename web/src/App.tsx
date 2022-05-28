import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import AccountProvider from "./providers/AccountProvider";
import Index from "./views/Index";
import Login from "./views/Login";
import Register from "./views/Register";
import Notes from "./views/Notes";
import Note from "./views/Note";
import Upload from "./views/Upload";
import ApiProvider from "./providers/ApiProvider";
import UserIndex from "./views/User/Index";
import UserLikes from "./views/User/Likes";
import Help from "./views/Help";

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: "none",
        },
      },
    },
  },
});

const routes = [
  { path: "/", component: Index },
  { path: "login", component: Login },
  { path: "register", component: Register },
  { path: "notes", component: Notes },
  { path: "upload", component: Upload },
  { path: "user/:id", component: UserIndex },
  { path: "user/me/likes", component: UserLikes },
  { path: "help", component: Help },
];

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AccountProvider>
        <ApiProvider>
          <Router>
            <TopBar />
            <Box overflowY="scroll" h={{ base: "95vh", md: "94vh" }}>
              <Routes>
                {routes.map(route => (
                  <Route key={route.path} path={route.path} element={<route.component />} />
                ))}
                <Route path="note">
                  <Route path=":id" element={<Note />} />
                  <Route path="new" element={<Navigate to="/upload" />} />
                  {/* <Route path="*" element={<Note />} /> */}
                </Route>
              </Routes>
            </Box>
          </Router>
        </ApiProvider>
      </AccountProvider>
    </ChakraProvider>
  );
};

export default App;
