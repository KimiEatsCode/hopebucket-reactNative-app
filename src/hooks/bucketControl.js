import React, { useEffect, useContext, useRef } from "react";
import LottieView from "lottie-react-native";
import { ListContext } from "../contexts/ListContext";
import { MAX_HOPE_ITEMS } from "../styles/theme";

const BUCKET_FULL_FRAME = 150;

const LottieControlBucket = () => {
  const lottieRef = useRef(null);
  const listContext = useContext(ListContext);
  const list = listContext.list;
  const totalHope = list.length;

  useEffect(() => {
    if (!lottieRef.current) return;

    if (totalHope <= 0) {
      lottieRef.current.reset();
      return;
    }

    const clamped = Math.min(totalHope, MAX_HOPE_ITEMS);
    const endFrame = Math.round((clamped / MAX_HOPE_ITEMS) * BUCKET_FULL_FRAME);
    const startFrame = Math.round(((clamped - 1) / MAX_HOPE_ITEMS) * BUCKET_FULL_FRAME);
    lottieRef.current.play(startFrame, endFrame);
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
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default LottieControlBucket;
