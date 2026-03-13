import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import "./style.css";

export const SingleTextSkeletonLoader = () => {
  return (
    <div className="single-text-skeleton-card">
      <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={200} />
    </div>
  );
};

export const TextSkeletonLoader = () => {
  return (
    <div className="question-skeleton-card">
      <div className="question-number-mark-loader">
        <div className="number-loader">
          <Stack spacing={1}>
            <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
          </Stack>
        </div>
        <div className="marks-loader">
          <Stack spacing={1}>
            <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
          </Stack>
        </div>
      </div>
      <div className="question-option-loader">
        <div className="question-loader">
          <Stack spacing={1}>
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "75%" }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "25%" }} />
          </Stack>
        </div>
        <div className="option-loader-wrapper">
          {[...Array(4)].map((x, index) => (
            <div key={index} className="option-loader">
              <Stack spacing={1}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1.5rem" }}
                  width={100}
                />
              </Stack>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TimerSkeletonLoader = () => {
  return <Skeleton variant="text" />;
};

export const QuestionButtonSkeletonLoader = () => {
  return [...Array(40)].map((x, index) => (
    <div className="button-loader" key={index + 2}>
      <Stack spacing={1}>
        <Skeleton variant="circular" width={25} height={25} />
      </Stack>
    </div>
  ));
};

export const SingleQuestionButtonSkeletonLoader = () => {
  return (
    <div className="button-loader">
      <Stack spacing={1}>
        <Skeleton variant="circular" width={25} height={25} />
      </Stack>
    </div>
  );
};
export const SerialNoTextSkeletonLoader = () => {
  return (
    <div className="marks-loader">
      <Stack spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
      </Stack>
    </div>
  );
};
