import React, { useState } from "react";
import FelaProvider from "./FelaProvider";
import Places from "./components/Places";
import Weather from "./components/Weather";
import Flex from "./components/Flex";
import Loader from "./components/Loader";

const containerStyle = { padding: "30px", alignItems: "center" };
const contentStyle = { maxWidth: "768px", width: "100%" };
const loaderContainerStyle = { alignItems: "center", justifyContent: "center" };

function App() {
  const [location, setLocation] = useState(null);

  return (
    <FelaProvider>
      <Flex column extend={containerStyle}>
        <Flex extend={contentStyle} column>
          <Places onChange={setLocation} label="Where are you?" />
          {location && (
            <React.Suspense
              fallback={
                <Flex extend={loaderContainerStyle}>
                  <Loader />
                </Flex>
              }
            >
              <Weather location={location} />
            </React.Suspense>
          )}
        </Flex>
      </Flex>
    </FelaProvider>
  );
}

export default App;
