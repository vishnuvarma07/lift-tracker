import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import SplitsPage from "./pages/SplitsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SplitDaysPage from "./pages/SplitDaysPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route
          path="/splits"
          element={
            <ProtectedRoute>
              <SplitsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/splits/:splitId"
          element={
              <ProtectedRoute>
                  <SplitDaysPage />
              </ProtectedRoute>
          }
        />
        
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;