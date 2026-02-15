import React, { useEffect, useContext, useRef } from "react";
import LottieView from "lottie-react-native";
import { ListContext } from "../contexts/ListContext";

const LottieControlBucket = () => {
  const lottieRef = useRef(null);
  const listContext = useContext(ListContext);
  const list = listContext.list;
  const totalHope = list.length;

  useEffect(() => {
    if (!lottieRef.current) return;

    if (totalHope === 0) {
      lottieRef.current.reset();
    } else if (totalHope === 1) {
      lottieRef.current.play(0, 40);
    } else if (totalHope === 2) {
      lottieRef.current.play(40, 70);
    } else if (totalHope === 3) {
      lottieRef.current.play(70, 150);
    }
  }, [totalHope, list]);

  return (
    <LottieView
      ref={lottieRef}
      source={require("../../assets/bucket-lottie.json")}
      autoPlay={false}
      loop={false}
      style={{
        position: "absolute",
        zIndex: -1,
        height: "70%",
        width: "100%",
        top: "8%", // Centers vertically: (100%-70%)/2=15%
      }}
    />
  );
};

export default LottieControlBucket;
