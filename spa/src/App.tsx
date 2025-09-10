import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./pages/ProtectedLayout";
import { routes } from "./routes/routes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routes.map(({ path, element: Component, protected: isProtected }) =>
              isProtected ? (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute>
                      <ProtectedLayout>
                        <Component />
                      </ProtectedLayout>
                    </ProtectedRoute>
                  }
                />
              ) : (
                <Route key={path} path={path} element={<Component />} />
              )
            )}
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
