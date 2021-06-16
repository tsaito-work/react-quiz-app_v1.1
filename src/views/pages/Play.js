import React, { useState, useEffect } from 'react';
import Question from "../components/Question";
import { Container } from "../styles/CommonCss";
import { useLocation } from "react-router-dom";

/** locationから問題番号を取得する */
function getQuestionIndex(location) {
  let questionIndex = location.state && location.state.questionIndex;
  if (questionIndex === undefined) {
    return questionIndex = 0;
  }
  return questionIndex;
}
/** locationから回答履歴を取得する */
function getQuestionResult(location) {
  let questionResult = location.state && location.state.questionResult;
  if (questionResult === undefined) {
    questionResult = [];
  }
  return questionResult;
}

/** クイズのページを表示するコンポーネント */
export default function Play(props) {
  let location = useLocation();
  // 表示対象の問題番号
  const [questionIndex, setQuestionIndex] = useState(getQuestionIndex(location));
  // 回答した問題番号の履歴
  const [questionResult, setQuestionResult] = useState(getQuestionResult(location));

  /** 画面update時、unmount時実行 */
  useEffect(() => {
    // 次の問題を表示した際にstateの初期値を前画面からの情報に置き換える
    let unlisten = props.history.listen((location) => {
      setQuestionIndex(getQuestionIndex(location));
      setQuestionResult(getQuestionResult(location));
    });
    // unmount時listenを停止する
    return () => {
      unlisten();
    }
  }, [props.history]);

  /** 
   * 問題番号、回答履歴を設定
   * index：表示対象の問題番号
   * result：回答履歴
   */
  const setViewData = (index, result) => {
    setQuestionIndex(index);
    setQuestionResult(result);
  }

  return (
    <Container>
      {/* 問題数分内容を表示するコンポーネントを呼び出す */}
      <Question
        key={questionIndex}
        questionIndex={questionIndex}
        questionResult={questionResult}
        setViewData={setViewData}
      />
    </Container>
  );
}