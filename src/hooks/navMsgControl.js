import React, { useEffect, useContext, useRef } from "react";
import LottieView from "lottie-react-native";
import { ListContext } from "../contexts/ListContext";

const LottieControlNavMsg = () => {
  const lottieRef = useRef(null);
  const listContext = useContext(ListContext);
  const list = listContext.list;
  const totalHope = list.length;

  useEffect(() => {
    if (!lottieRef.current) return;

    if (totalHope === 3) {
      lottieRef.current.play(55, 100);
    } else if (totalHope === 1) {
      // Go to frame 20 and stop
      lottieRef.current.play(0, 20);
    }
  }, [totalHope, list]);

  return (
    <LottieView
      ref={lottieRef}
      source={require("../../assets/Arrow-with-Msg.json")}
      autoPlay={false}
      loop={false}
      style={{
        position: "absolute",
        zIndex: -1,
        left: 0,
        top: 120,
        height: "70%",
        width: "100%",
      }}
    />
  );
};

export default LottieControlNavMsg;
