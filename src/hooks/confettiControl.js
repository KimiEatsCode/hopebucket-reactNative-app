import React, { useEffect, useContext, useRef } from "react";
import LottieView from "lottie-react-native";
import { ListContext } from "../contexts/ListContext";

const LottieControlConfetti = () => {
  const lottieRef = useRef(null);
  const listContext = useContext(ListContext);
  const list = listContext.list;
  const totalHope = list.length;

  useEffect(() => {
    if (!lottieRef.current) return;

    if (totalHope === 3) {
      lottieRef.current.play();
    } else {
      lottieRef.current.reset();
    }
  }, [totalHope, list]);

  return (
    <LottieView
      ref={lottieRef}
      source={require("../../assets/confetti-lottie.json")}
      autoPlay={false}
      loop={false}
      style={{
        position: "absolute",
        zIndex: -1,
        left: 0,
        top: 0,
        height: "100%",
        width: "100%",
      }}
    />
  );
};

export default LottieControlConfetti;
